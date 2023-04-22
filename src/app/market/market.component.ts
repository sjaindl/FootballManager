import { Component, OnInit } from '@angular/core'
import { FirebaseService } from '../services/firebase.service'
import { AuthService } from '../services/auth.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Player } from '../shared/player'
import { Storage } from '@angular/fire/storage'
import { collectionData, docData, getDocs } from '@angular/fire/firestore'
import { Config } from '../shared/config'

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {

  players: Player[] = []
  playersOfTeam: Player[] = []
  balance = 0

  dataSource: Player[]
  teamPositionSortOrder = new Map<string, number>()
  displayedColumns: string[] = ['position', /* 'team', */ 'playerImage', 'player', 'marketValue', 'points', 'buy']

  log = false

  constructor(public firebaseService: FirebaseService, public authService: AuthService, private storage: Storage, private snackBar: MatSnackBar) {
    this.teamPositionSortOrder.set("Tormann", 1)
    this.teamPositionSortOrder.set("Verteidigung", 2)
    this.teamPositionSortOrder.set("Mittelfeld", 3)
    this.teamPositionSortOrder.set("Angriff", 4)
  }

  ngOnInit() {
    docData(this.firebaseService.getUserFoundedLeague(Config.curLeague,this.authService.currentLeague.name)).forEach((leagueDoc) => {
      if(this.log) {
        console.log('leagueDoc with balance: ' + JSON.stringify(leagueDoc))
      }
      this.balance = leagueDoc['balance']
    })

    getDocs(this.firebaseService.getTeams(Config.curLeague)).then((teamsSnapshot) => {
      teamsSnapshot.forEach((team) => {
        
        if(this.log) {
          console.log('team: ' + JSON.stringify(team.data()))
          console.log(team.id)
        }

        getDocs(this.firebaseService.getPlayers(Config.curLeague, team.id)).then((playersSnapshot) => {
          playersSnapshot.forEach(p => {
            let player = new Player()
            let data = p.data()

            if(this.log) {
              console.log("init player: " + JSON.stringify(data))
            }

            player.init(data, team.id)
            player.loadImageRef(this.storage)

            this.players.push(player)
          })

          this.setDataSource()
          this.fetchPlayersOfTeam(team.id)
        })
      })
    }) 
  }

  fetchPlayersOfTeam(teamId) {
    collectionData(this.firebaseService.getPlayersOfTeam(Config.curLeague, this.authService.currentLeague.name)).subscribe(playersOfTeamArray => {
      if(this.log) {
        console.dir(playersOfTeamArray)
      }

      this.playersOfTeam = []

      playersOfTeamArray.forEach(p => {
        let playerData = p
        let playerOfTeam = new Player()

        let player = this.getPlayerByName(playerData["player"])

        if(this.log) {
          console.log("check player: " + playerData["player"])
          console.log("got player" + player)
        }

        playerOfTeam.init(player, teamId)
        playerOfTeam.player = player.player
        this.playersOfTeam.push(playerOfTeam)
        // console.log('player of team: ' + playerOfTeam.player)
        this.setDataSource()
      })
    })
  }

  setDataSource() {
    this.dataSource = this.players.sort((a, b) => {
      var aPositionSortOrder = this.teamPositionSortOrder.get(a.position)
      var bPositionSortOrder = this.teamPositionSortOrder.get(b.position)

      if (aPositionSortOrder < bPositionSortOrder) {
        return -1
      } 
      else if (aPositionSortOrder > bPositionSortOrder) {
        return 1
      }
      else {
        if (a.player < b.player) {
          return -1
        } 
        else if (a.player > b.player) {
          return 1
        } else {
          return 0
        }
      }
    })
  }

  getPlayerByName(name): Player {
    var p = null
    this.players.forEach(player => {
      if (player.player.split(' ').join('') == name.split(' ').join('')) {
        p = player
      }
    })

    return p
  }

  buy(player) {
    var change = player.marketValue
    var isInTeam = this.lIsInTeam(player)
    if (!isInTeam) {
      change *= -1
    }

    if(this.log) {
      console.log('buy: ' + change)
      console.dir(player)
    }

    //Balance after buy < 0 not allowed - not enough money.
    if (this.balance + change < 0) {
      this.openSnackBar('Kontostand nicht ausreichend.', 'Transfer abgebrochen.')
      return
    }

    this.firebaseService.changeBalance(Config.curLeague, this.authService.currentLeague.name, change)
    this.balance += change

    if (isInTeam) {
      this.firebaseService.removePlayerOfTeam(Config.curLeague, this.authService.currentLeague.name, player)

      //Delete player from team
      this.playersOfTeam.forEach(element => {
        if (element.player == player.player) {
          let index = this.playersOfTeam.indexOf(element)
          this.playersOfTeam.splice(index, 1)
        }
      })

      //set player stats
      this.firebaseService.playerSold(Config.curLeague, player)
    } else {
      this.firebaseService.addPlayerOfTeam(Config.curLeague, this.authService.currentLeague.name, player.player)
      
      //Add new player to team
      let playerOfTeam = new Player()
      playerOfTeam.init(player, player.teamId)
      playerOfTeam.player = player.player
      this.playersOfTeam.push(playerOfTeam)

      //set player stats
      this.firebaseService.playerBought(Config.curLeague, player)
    }
    // this.fetchPlayersOfTeam(player.team)
  }

  desc(player) {
    return this.lIsInTeam(player) ? 'Verkaufen' : 'Kaufen'
  }

  lIsInTeam(player) {
    var isInTeam = false
    this.playersOfTeam.forEach(element => {
      if (element.player == player.player) {
        isInTeam = true
        return
      }
    })
    return isInTeam
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    })
  }
}
