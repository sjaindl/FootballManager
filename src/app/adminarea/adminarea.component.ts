import { Component, OnInit, ChangeDetectorRef } from '@angular/core'
import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../services/auth.service';
import { Player } from '../shared/player';

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
  
  constructor(public firebaseService: FirebaseService, public authService: AuthService, public changeDetectorRefs: ChangeDetectorRef) { 
    this.teamPositionSortOrder.set("Tormann", 1)
    this.teamPositionSortOrder.set("Verteidigung", 2)
    this.teamPositionSortOrder.set("Mittelfeld", 3)
    this.teamPositionSortOrder.set("Angriff", 4)
  }

  ngOnInit() {
    this.firebaseService.isFreezed().subscribe((doc) => {
      var isFreezed = doc.get('freeze')
      this.freezed = isFreezed
    })

    this.firebaseService.getTeams("grenzlandcup").valueChanges().subscribe((teamsArray) => {
        this.teams = teamsArray
  
        teamsArray.forEach(team => {
          console.log(team.id)
          this.firebaseService.getPlayers("grenzlandcup", team.id).valueChanges().subscribe((playersArray) => {
  
            playersArray.forEach(p => {
              let player = new Player(null)
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
    this.firebaseService.getTeams("grenzlandcup").valueChanges().subscribe((teamsArray) => {
      this.teams = teamsArray

      teamsArray.forEach(team => {
        console.log(team.id)
        var subsc = this.firebaseService.getPlayers("grenzlandcup", team.id).valueChanges().subscribe((playersArray) => {
          subsc.unsubscribe()
          
          playersArray.forEach(p => {
            var bought = 0

            var usub = this.firebaseService.getUsers().valueChanges().subscribe((users) => {
              usub.unsubscribe()
              let numberOfUsersToCheck = users.length
              var currentUser = 0
        
              users.forEach(user => {
                var anyUser: any = user

                var lsub = this.firebaseService.getUserFoundedLeagues("grenzlandcup", anyUser.uid).valueChanges().subscribe((leaguesArray) => {
                  lsub.unsubscribe()
                  
                  leaguesArray.forEach(liga => {
                    
                    var psub = this.firebaseService.getPlayersOfTeam("grenzlandcup", liga.name, anyUser.uid).valueChanges().subscribe((playersOfTeamArray) => {
                      psub.unsubscribe()

                      playersOfTeamArray.forEach(pteam => {
                        if (p.name.split(' ').join('') == pteam.player.split(' ').join('')) {
                          bought += 1
                          console.log(pteam.player + ', ' + bought + ', liga: ' + liga.name + ', spieler: ' + anyUser.displayName)
                        }
                      })
                      this.firebaseService.getPlayers("grenzlandcup", 'hvtdp').doc(p.playerId).ref.update({
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
    this.firebaseService.changePlayerPoints("grenzlandcup", this.players).then((res) => {
      this.players.forEach(player => {
        if (player.pointsCurrentRound != null || player.newMarketValue != null) {
            this.firebaseService.getPlayers("grenzlandcup", player.team).doc(player.playerId).ref.update({
              marketValue: player.newMarketValue ? +player.newMarketValue : +player.marketValue,
              points: player.pointsCurrentRound ? +player.points + +player.pointsCurrentRound : +player.points,
              pointsCurrentRound: player.pointsCurrentRound ? player.pointsCurrentRound : 0
            })
            
            player.marketValue = player.newMarketValue ? +player.newMarketValue : +player.marketValue
            player.points = +player.pointsCurrentRound ? +player.points + +player.pointsCurrentRound : +player.points
            player.pointsCurrentRound = null
            player.newMarketValue = null
          }
        })
      })
    
  }

  freezeDesc() {
    return this.freezed ? 'Unfreeze!' : 'Freeze!'
  }

  freeze() {
    this.freezed = !this.freezed
    this.firebaseService.freeze(this.freezed)
  }
}
