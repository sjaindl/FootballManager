import { Component, OnInit } from '@angular/core'
import { FirebaseService } from '../services/firebase.service'
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {

  teams: any[]
  players: Player[] = []
  playersOfTeam: Player[] = []
  balance = 0

  dataSource: Player[]
  teamPositionSortOrder = new Map<string, number>()
  displayedColumns: string[] = ['position', /* 'team', */ 'player', 'marketValue', 'buy']

  constructor(public firebaseService: FirebaseService, public authService: AuthService, private snackBar: MatSnackBar) {
    this.teamPositionSortOrder.set("Tormann", 1)
    this.teamPositionSortOrder.set("Verteidigung", 2)
    this.teamPositionSortOrder.set("Mittelfeld", 3)
    this.teamPositionSortOrder.set("Angriff", 4)
  }

  ngOnInit() {
    this.firebaseService.getUserFoundedLeague("grenzlandcup",this.authService.currentLeague.name).get().subscribe((leagueDoc) => {
      this.balance = leagueDoc.get('balance')
    })

    this.firebaseService.getTeams("grenzlandcup").valueChanges().subscribe((teamsArray) => {
      this.teams = teamsArray

      teamsArray.forEach(team => {
        console.log(team.id)
        this.firebaseService.getPlayers("grenzlandcup", team.id).valueChanges().subscribe((playersArray) => {

          playersArray.forEach(p => {
            let player = new Player()
            player.init(p, team.id)
            this.players.push(player)
          })

          this.setDataSource()
          this.fetchPlayersOfTeam(team.id)
        })
      })
    })
  }

  fetchPlayersOfTeam(teamId) {
    this.firebaseService.getPlayersOfTeam("grenzlandcup", this.authService.currentLeague.name).valueChanges().subscribe((playersOfTeamArray) => {
      playersOfTeamArray.forEach(p => {
        let playerOfTeam = new Player()
        let player = this.getPlayerByName(p.player)
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

    //Balance after buy < 0 not allowed - not enough money.
    if (this.balance + change < 0) {
      this.openSnackBar('Kontostand nicht ausreichend.', 'Transfer abgebrochen.')
      return
    }

    this.firebaseService.changeBalance("grenzlandcup", this.authService.currentLeague.name, change)
    this.balance += change

    if (isInTeam) {
      this.firebaseService.removePlayerOfTeam("grenzlandcup", this.authService.currentLeague.name, player)

      //Delete player from team
      this.playersOfTeam.forEach(element => {
        if (element.player == player.player) {
          let index = this.playersOfTeam.indexOf(element)
          this.playersOfTeam.splice(index, 1)
        }
      })
    } else {
      this.firebaseService.addPlayerOfTeam("grenzlandcup", this.authService.currentLeague.name, player.player)
      
      //Add new player to team
      let playerOfTeam = new Player()
      playerOfTeam.init(player, player.teamId)
      playerOfTeam.player = player.player
      this.playersOfTeam.push(playerOfTeam)

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

export class Player {
  team: string
  player: string
  marketValue: number
  position: string

  init(json, team) {
    this.player = json.name
    this.marketValue = json.marketValue
    this.position = json.position
    this.team = team
  }
}
