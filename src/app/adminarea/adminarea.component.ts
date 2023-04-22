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

  getPlayerByName(name): Player {
    var p = null
    this.players.forEach(player => {
      if (player.player.split(' ').join('') == name.split(' ').join('')) {
        p = player
      }
    })

    return p
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
    this.firebaseService.changePlayerPoints(Config.curLeague, this.players).then((res) => {
        this.openSnackBar('Punkteberechnung abgeschlossen!', '')
      }) 
  }

  setPlayerPointsLastRound() {
    this.players.forEach(player => {
      if (player.pointsCurrentRound != null || player.newMarketValue != null) {
          let playersCol = this.firebaseService.getPlayers(Config.curLeague, player.team)
          let playersDoc = doc(playersCol, player.playerId)
          updateDoc(playersDoc, {
            marketValue: player.newMarketValue ? +player.newMarketValue : +player.marketValue,
            points: player.pointsCurrentRound ? +player.points + +player.pointsCurrentRound : +player.points,
            pointsLastRound: player.pointsCurrentRound ? player.pointsCurrentRound : 0
          })
          
          player.marketValue = player.newMarketValue ? +player.newMarketValue : +player.marketValue
          player.points = +player.pointsCurrentRound ? +player.points + +player.pointsCurrentRound : +player.points
          player.pointsCurrentRound = null
          player.newMarketValue = null
        }
      })
      
      this.openSnackBar('Spielerpunkte gesetzt!', '')
  }

  saveNews() {
    this.firebaseService.setLeagueNews('grenzlandcup', this.news).then( () => {
      this.openSnackBar('News aktualisiert', 'News')
    })
  }

  freezeDesc() {
    return this.freezed ? 'Unfreeze!' : 'Freeze!'
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
