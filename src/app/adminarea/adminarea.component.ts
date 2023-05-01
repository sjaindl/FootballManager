import { Component, OnInit, ChangeDetectorRef } from '@angular/core'
import { FirebaseService } from '../services/firebase.service'
import { AuthService } from '../services/auth.service'
import { Player } from '../shared/player'
import { MatSnackBar } from '@angular/material/snack-bar'
import { collectionData, doc, docData, updateDoc } from '@angular/fire/firestore'
import { Config } from '../shared/config'

@Component({
  selector: 'app-adminarea',
  templateUrl: './adminarea.component.html',
  styleUrls: ['./adminarea.component.css']
})
export class AdminareaComponent implements OnInit {

  teams: any[]
  players: Player[] = []
  displayedColumns: string[] = ['position', /* 'team', */ 'player', 'marketValue', 'points', 'pointsCurrentRound', 'newMarketValue', 'sold', 'bought']
  dataSource: Player[]
  teamPositionSortOrder = new Map<string, number>()
  freezed: boolean = false
  news: string
  
  constructor(public firebaseService: FirebaseService, public authService: AuthService, public changeDetectorRefs: ChangeDetectorRef, private snackBar: MatSnackBar) { 
    this.teamPositionSortOrder.set("Tormann", 1)
    this.teamPositionSortOrder.set("Verteidigung", 2)
    this.teamPositionSortOrder.set("Mittelfeld", 3)
    this.teamPositionSortOrder.set("Angriff", 4)
  }

  ngOnInit() {
    docData(this.firebaseService.isFreezed()).subscribe(doc => {
      var isFreezed = doc['freeze']
      this.freezed = isFreezed
    })

    collectionData(this.firebaseService.getLeagueNews(Config.curLeague)).subscribe(news => {
      let anyNews: any = news
      this.news = anyNews[0].newsLine
    })

    collectionData(this.firebaseService.getTeams(Config.curLeague)).subscribe(teamsArray => {
        this.teams = teamsArray
  
        teamsArray.forEach(team => {
          console.log(team.id)
          collectionData(this.firebaseService.getPlayers(Config.curLeague, team.id)).subscribe(playersArray => {
            playersArray.forEach(p => {
              let player = new Player()
              player.init(p, team.id)
              player.playerId = p.playerId
              player.sold = p.sold
              player.bought = p.bought

              this.players.push(player)
            })

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

        })
      })
    })
  }

  playersInTeamCount() {
    collectionData(this.firebaseService.getTeams(Config.curLeague)).subscribe(teamsArray => {
      this.teams = teamsArray

      teamsArray.forEach(team => {
        console.log(team.id)
        var subsc = collectionData(this.firebaseService.getPlayers(Config.curLeague, team.id)).subscribe((playersArray) => {
          subsc.unsubscribe()
          
          playersArray.forEach(p => {
            var bought = 0

            var usub = collectionData(this.firebaseService.getUsers()).subscribe((users) => {
              usub.unsubscribe()
              let numberOfUsersToCheck = users.length
              var currentUser = 0
        
              users.forEach(user => {
                var anyUser: any = user

                var lsub = collectionData(this.firebaseService.getUserFoundedLeagues(Config.curLeague, anyUser.uid)).subscribe((leaguesArray) => {
                  lsub.unsubscribe()
                  
                  leaguesArray.forEach(liga => {
                    
                    var psub = collectionData(this.firebaseService.getPlayersOfTeam(Config.curLeague, liga.name, anyUser.uid)).subscribe((playersOfTeamArray) => {
                      psub.unsubscribe()

                      playersOfTeamArray.forEach(pteam => {
                        if (p.name.split(' ').join('') == pteam.player.split(' ').join('')) {
                          bought += 1
                          console.log(pteam.player + ', ' + bought + ', liga: ' + liga.name + ', spieler: ' + anyUser.displayName)
                        }
                      })
                      let players = this.firebaseService.getPlayers(Config.curLeague, 'hvtdp')
                      updateDoc(doc(players, p.playerId), {
                        bought: bought
                      })
                    })
                  })
                  
                })
                currentUser += 1
                if (currentUser == numberOfUsersToCheck) {
                  console.log('finished')
                }
              })
            })
          })

        })
      })
    })
  }

  save() {
    console.log("check players ..")
    if(!this.checkPlayers()) {
      return
    }

    console.log("setPlayerPointsLastRound ..")
    this.setPlayerPointsLastRound()
    console.log("changePlayerPoints ..")
    this.firebaseService.changePlayerPoints(Config.curLeague, this.players, false).then((res) => {
        this.resetData()
        this.openSnackBar('Punkteberechnung abgeschlossen!', '')
      }) 
  }

  checkPlayers() {
    console.log("Check ..")
    var isValid = true
    this.players.forEach(player => {
      console.log(player.player + ", player.pointsCurrentRound: " + player.pointsCurrentRound)
      if (player.pointsCurrentRound != undefined) {
        if(isNaN(+player.pointsCurrentRound)) {
          this.openSnackBar('Ungültige Werte für Spieler ' + player.player, '')
          isValid =  false
        }
      }

      if (player.newMarketValue != undefined) {
        if(isNaN(+player.newMarketValue)) {
          this.openSnackBar('Ungültige Werte für Spieler ' + player.player, '')
          isValid =  false
        }
      }
    })
    
    return isValid
  }

  setPlayerPointsLastRound() {
    this.players.forEach(player => {
      if (player.pointsCurrentRound != undefined || player.newMarketValue != undefined) {
          let playersCol = this.firebaseService.getPlayers(Config.curLeague, player.team)
          let playersDoc = doc(playersCol, player.playerId)
          let playerPoints = player.points ? player.points : 0

          let newMarketValue = player.newMarketValue ? +player.newMarketValue : +player.marketValue
          let newPoints = player.pointsCurrentRound ? +playerPoints + +player.pointsCurrentRound : +playerPoints
          let newPointsLastRound = player.pointsCurrentRound ? +player.pointsCurrentRound : 0

          console.log("player: " + player.player + ", newPoints: " + newPoints + ", newPointsLastRound: " + newPointsLastRound + ", newMarketValue: " + newMarketValue)

          updateDoc(playersDoc, {
            marketValue: newMarketValue,
            points: newPoints,
            pointsLastRound: newPointsLastRound
          })
          
          player.marketValue = player.newMarketValue ? +player.newMarketValue : +player.marketValue
          player.points = player.pointsCurrentRound ? +playerPoints + +player.pointsCurrentRound : +playerPoints
        }
      })
      
      console.log("setPlayerPointsLastRound done ..")
      this.openSnackBar('Spielerpunkte gesetzt!', '')
  }

  resetPlayerPoints() {
    console.log("changePlayerPoints ..")
    this.firebaseService.changePlayerPoints(Config.curLeague, this.players, true)
    console.log("changePlayerPoints done ..")

    this.players.forEach(player => {
          let playersCol = this.firebaseService.getPlayers(Config.curLeague, player.team)
          let playersDoc = doc(playersCol, player.playerId)

          console.log("player " + player.player)

          updateDoc(playersDoc, {
            marketValue: 100000,
            points: 0,
            pointsLastRound: 0
          })

          console.log("player " + player.player + " done ..")
          
      })
      
      
      this.openSnackBar('Spielerpunkte gesetzt!', '')
  }

  resetData() {
      console.log("reset data ..")
      this.players.forEach(player => {
        player.pointsCurrentRound = null
        player.newMarketValue = null
      })
  }

  saveNews() {
    this.firebaseService.setLeagueNews(Config.curLeague, this.news).then( () => {
      this.openSnackBar('News aktualisiert', 'News')
    })
  }

  freezeDesc() {
    return this.freezed ? 'Entsperren!' : 'Sperren!'
  }

  freeze() {
    this.freezed = !this.freezed
    this.firebaseService.freeze(this.freezed)
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    })
  }
}
