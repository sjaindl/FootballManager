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
  displayedColumns: string[] = ['position', /* 'team', */ 'player', 'marketValue', 'points', 'pointsCurrentRound', 'newMarketValue']
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
              let player = new Player()
              player.init(p, team.id)
              player.playerId = p.playerId
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

            this.changeDetectorRefs.detectChanges()
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

  save() {
    this.firebaseService.changePlayerPoints("grenzlandcup", this.players)

    this.players.forEach(player => {
      if (player.pointsCurrentRound != null || player.newMarketValue != null) {
          player.marketValue = player.newMarketValue ? +player.newMarketValue : +player.marketValue
          player.points = player.pointsCurrentRound ? +player.points + +player.pointsCurrentRound : +player.points
          player.pointsCurrentRound = null
          player.newMarketValue = null
        }
      })

    this.changeDetectorRefs.detectChanges()
  }

  freezeDesc() {
    return this.freezed ? 'Unfreeze!' : 'Freeze!'
  }

  freeze() {
    this.freezed = !this.freezed
    this.firebaseService.freeze(this.freezed)
  }
}
