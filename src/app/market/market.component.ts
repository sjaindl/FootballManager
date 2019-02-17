import { Component, OnInit } from '@angular/core'
import { FirebaseService } from '../services/firebase.service'

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {

  teams: any[]
  players: Player[] = []

  constructor(public firebaseService: FirebaseService) { }

  ngOnInit() {
    this.firebaseService.getTeams("grenzlandcup").valueChanges().subscribe((teamsArray) => {
      this.teams = teamsArray

      teamsArray.forEach(team => {
        console.log(team.id)
        this.firebaseService.getPlayers("grenzlandcup", team.id).valueChanges().subscribe((playersArray) => {

          playersArray.forEach(p => {
            let player = new Player()
            player.init(p, team.id)
            this.players.push(player)
            console.log(p)
          })
        })
      })
    })
  }

}

export class Player {
  team: string
  player: string
  marketValue: number

  init(json, team) {
    this.player = json.name
    this.marketValue = json.marketValue
    this.team = team
  }
}
