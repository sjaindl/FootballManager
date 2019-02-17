import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  teams: any[]
  players: Player[] = []
  playersOfTeam: Player[] = []
  lineup: Lineup[][] = []
  def: string[] = ['StefanJaindl', 'HrvojeSincek']
  formation = '4-4-2'

  gridColumnsDefenseFirstLine = 2
  gridColumnsDefenseSecondLine = 2

  gridColumnsMidfieldFirstLine = 2
  gridColumnsMidfieldSecondLine = 2

  gridColumnsAttackFirstLine = 1
  gridColumnsAttackSecondLine = 1

  gridImageHeight = 50
  titleSizeEm = 2.0
  priceSizeEm = 1.5
  detailSizeEm = 1.0

  public selected2 = 'ChristianSchnitter'
  selected = 'StefanJaindl'

  constructor(public firebaseService: FirebaseService, public authService: AuthService) { }

  ngOnInit() {

    //todo formation init
    
    this.initLineupArray() 
    this.setFormation('4-4-2')

    this.firebaseService.getTeams("grenzlandcup").valueChanges().subscribe((teamsArray) => {
      this.teams = teamsArray

      teamsArray.forEach(team => { //TODO check.. nur 1 team oder? .. nö
        console.log(team.id)
        this.firebaseService.getPlayers("grenzlandcup", team.id).valueChanges().subscribe((playersArray) => {

          playersArray.forEach(p => {
            let player = new Player()
            player.init(p, team.id)
            this.players.push(player)
            console.log(p)
          })

          this.firebaseService.getPlayersOfTeam("grenzlandcup", this.authService.currentLeague.name).valueChanges().subscribe((playersOfTeamArray) => {
            playersOfTeamArray.forEach(p => {
            let playerOfTeam = new Player()
            let player = this.getPlayerByName(p.player)
            playerOfTeam.init(player, team.id)
            playerOfTeam.player = player.player
            this.playersOfTeam.push(playerOfTeam)
            console.log('player of team: ' + playerOfTeam)

            })

            this.firebaseService.getLineUp("grenzlandcup", this.authService.currentLeague.name).valueChanges().subscribe((LineupArray) => {
              LineupArray.forEach(p => {
                let linedUpPlayer = new Lineup()
                let player = this.getPlayerByName(p.player)
                linedUpPlayer.player = player.player
                linedUpPlayer.position = p.position
                linedUpPlayer.index = p.index
                // this.lineup[linedUpPlayer.position][p.index] = player.player
                this.lineup[linedUpPlayer.position][p.index] = player.player.split(' ').join('') 
                console.log('linedup: ' + linedUpPlayer.player + ', with pos: ' + linedUpPlayer.position + ' and index: ' + linedUpPlayer.index)
              })
            })

          })

          // this.buildLinedUpArray()

        })
      })
    })

    // this.lineup['goal'][0] = 'ChristianSchnitter'
    // // this.lineup['defense1'][0] = 'StefanJaindl'
    // this.lineup['defense1'][1] = 'HrvojeSincek'

    // let player = new Player()
    // player.player = "CR 7"
    // player.team = "HV TDP"
    // player.marketValue = 10000
    // this.players.push(player)

    // let player2 = new Player()
    // player2.player = "CR 2"
    // player2.team = "HV TDP"
    // player2.marketValue = 10000
    // this.players.push(player2)

    // let player3 = new Player()
    // player3.player = "CR 3"
    // player3.team = "HV TDP"
    // player3.marketValue = 10000
    // this.players.push(player3)

    // let player4 = new Player()
    // player4.player = "CR 4"
    // player4.team = "HV TDP"
    // player4.marketValue = 10000
    // this.players.push(player4)
  }

  curIndex: number
  curPos: string

  initLineupArray() {
    this.lineup = []
    this.lineup['goal'] = []
    this.lineup['defense1'] = []
    this.lineup['defense2'] = []
    this.lineup['midfield1'] = []
    this.lineup['midfield2'] = []
    this.lineup['attack1'] = []
    this.lineup['attack2'] = []
  }

  setCurLineUp(index, pos) {
    this.curIndex = index
    this.curPos = pos
  }

  get linedup() {
    if (this.curPos != null && this.curIndex != null) {
      console.log('*** linedup: **** ' + this.getLinedUpPlayer(this.curPos, this.curIndex) + ' @index/pos: ' + this.curIndex + '/' + this.curPos)
      return this.getLinedUpPlayer(this.curPos, this.curIndex)
    }
    return ''
  }

  // buildLinedUpArray() {
  //   this.lineup.forEach(element => {
      
  //   })
  // }
  save() {
    
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

  getLinedUpPlayer(position, index) {
    return this.lineup[position][index]
    // var linedup = ''
    // this.lineup.forEach(player => {
    //   if (player.position == position && player.index == index) {
    //     linedup = player.player.split(' ').join('')
    //     return
    //   }
    // })
    // return linedup
  }
  
  array(n: number): any[] {
    return Array(n);
  }

  setFormation(formation: string) {
    console.log(formation)
    this.formation = formation

    if (formation == '3-4-3') {
      this.setGridColumns(1, 2, 2, 2, 2, 1)
      this.initLineupSubArrays(1, 2, 2, 2, 2, 1)
    } else if (formation == '4-4-2') {
      this.setGridColumns(2, 2, 2, 2, 1, 1)
      this.initLineupSubArrays(2, 2, 2, 2, 1, 1)
    } else if (formation == '3-5-2') {
      this.setGridColumns(1, 2, 3, 2, 1, 1)
      this.initLineupSubArrays(1, 2, 3, 2, 1, 1)
    } else if (formation == '4-5-1') {
      this.setGridColumns(2, 2, 3, 2, 0, 1)
      this.initLineupSubArrays(2, 2, 3, 2, 0, 1)
    }

    this.initLineupArray()
  }

  setGridColumns(gridColumnsDefenseFirstLine, gridColumnsDefenseSecondLine, gridColumnsMidfieldFirstLine, 
    gridColumnsMidfieldSecondLine, gridColumnsAttackFirstLine, gridColumnsAttackSecondLine) {
    this.gridColumnsDefenseFirstLine = gridColumnsDefenseFirstLine
    this.gridColumnsDefenseSecondLine = gridColumnsDefenseSecondLine

    this.gridColumnsMidfieldFirstLine = gridColumnsMidfieldFirstLine
    this.gridColumnsMidfieldSecondLine = gridColumnsMidfieldSecondLine

    this.gridColumnsAttackFirstLine = gridColumnsAttackFirstLine
    this.gridColumnsAttackSecondLine = gridColumnsAttackSecondLine
  }

  initLineupSubArrays(gridColumnsDefenseFirstLine, gridColumnsDefenseSecondLine, gridColumnsMidfieldFirstLine, 
    gridColumnsMidfieldSecondLine, gridColumnsAttackFirstLine, gridColumnsAttackSecondLine) {
    this.lineup["goal"].push(new Lineup())
    
    for (let index = 0; index < gridColumnsDefenseFirstLine; index++) {
      this.lineup["defense1"].push(new Lineup())
    }
    for (let index = 0; index < gridColumnsDefenseSecondLine; index++) {
      this.lineup["defense2"].push(new Lineup())
    }
    for (let index = 0; index < gridColumnsMidfieldFirstLine; index++) {
      this.lineup["midfield1"].push(new Lineup())
    }
    for (let index = 0; index < gridColumnsMidfieldSecondLine; index++) {
      this.lineup["midfield2"].push(new Lineup())
    }
    for (let index = 0; index < gridColumnsAttackFirstLine; index++) {
      this.lineup["attack1"].push(new Lineup())
    }
    for (let index = 0; index < gridColumnsAttackSecondLine; index++) {
      this.lineup["attack2"].push(new Lineup())
    }
  }

  selectPlayer(player, index, pos) {

    console.log('select: ')
    console.log(player)
    console.log(index)
    console.log(pos)
    console.log('select end')

    //new player
    let linedUpPlayer = new Lineup()
    let p = this.getPlayerByName(player)
    linedUpPlayer.player = p.player
    linedUpPlayer.position = pos
    linedUpPlayer.index = index
    
    //old player
    var found = false

    // this.lineup.forEach(element => {
    //   //check whether there is already a lined up player at this pos
    //   if (element.index == index && element.position == pos) {
    //     found = true
    //     element.player = p.player
    //     // console.log("found " + element.player)
    //     return
    //   } else if (element.player == p.player) {
    //       delete(this.lineup[this.lineup.indexOf(element)])
    //   }
    // })

    // // console.log("found? " + found)
    // if (!found) {
    //   this.lineup.push(linedUpPlayer)
    // }

    // this.lineup.push(player)
  }
/*
  playerLinedUp(player: Player) {
    var linedUp = false
    this.lineup.forEach(element => {
      if (player.player == element.player) {
        // console.log('linedup: ' + player.player)
        linedUp = true
      }
    })
    return linedUp
  }
  */
}
export class Lineup {
  player: string
  position: string
  index: number
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
