import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  teams: any[]
  players: Player[] = []
  playersOfTeam: Player[] = []
  originalLineup: Lineup[][] = []
  lineup: Lineup[][] = []
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

  displayedColumns: string[] = ['position', 'team', 'player', 'marketValue']
  dataSource: Player[]
  teamPositionSortOrder = new Map<string, number>()

  constructor(public firebaseService: FirebaseService, public authService: AuthService, private snackBar: MatSnackBar) { 
    this.teamPositionSortOrder.set("goal", 1)
    this.teamPositionSortOrder.set("defense", 2)
    this.teamPositionSortOrder.set("midfield", 3)
    this.teamPositionSortOrder.set("attack", 4)
  }

  ngOnInit() {

    //todo formation init
    
    this.initLineupArray() 
    this.setFormation('4-4-2')

    // this.firebaseService.getFormation("grenzlandcup", this.authService.currentLeague.name).valueChanges().subscribe((formation) => {
    //   this.setFormation(formation.formation)
      
      this.firebaseService.getTeams("grenzlandcup").valueChanges().subscribe((teamsArray) => {
        this.teams = teamsArray
  
        teamsArray.forEach(team => {
          console.log(team.id)
          this.firebaseService.getPlayers("grenzlandcup", team.id).valueChanges().subscribe((playersArray) => {
  
            playersArray.forEach(p => {
              let player = new Player()
              player.init(p, team.id)
              this.players.push(player)
              // console.log(p)
            })
  
            this.firebaseService.getPlayersOfTeam("grenzlandcup", this.authService.currentLeague.name).valueChanges().subscribe((playersOfTeamArray) => {
              playersOfTeamArray.forEach(p => {
              let playerOfTeam = new Player()
              let player = this.getPlayerByName(p.player)
              playerOfTeam.init(player, team.id)
              playerOfTeam.player = player.player
              this.playersOfTeam.push(playerOfTeam)
              console.log('player of team: ' + playerOfTeam.player)
              this.dataSource = this.playersOfTeam.sort((a, b) => {
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
  
              this.firebaseService.getLineUp("grenzlandcup", this.authService.currentLeague.name).valueChanges().subscribe((LineupArray) => {
                LineupArray.forEach(p => {
                  let linedUpPlayer = new Lineup()
                  let player = this.getPlayerByName(p.player)
                  linedUpPlayer.player = player.player
                  linedUpPlayer.position = p.position
                  linedUpPlayer.index = p.index
                  this.lineup[linedUpPlayer.position][linedUpPlayer.index] = player.player.split(' ').join('') 
                  this.originalLineup[linedUpPlayer.position][linedUpPlayer.index] = player.player.split(' ').join('') 
                  // console.log('linedup: ' + linedUpPlayer.player + ', with pos: ' + linedUpPlayer.position + ' and index: ' + linedUpPlayer.index)
                })
              })
  
            })
          })
        })
      })
    // })


    
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

    this.originalLineup = []
    this.originalLineup['goal'] = []
    this.originalLineup['defense1'] = []
    this.originalLineup['defense2'] = []
    this.originalLineup['midfield1'] = []
    this.originalLineup['midfield2'] = []
    this.originalLineup['attack1'] = []
    this.originalLineup['attack2'] = []
  }

  save() {
    var valid = true
    this.firebaseService.positions.forEach(position => {
      this.lineup[position].forEach(player => {
        var equalCount = 0
        this.lineup[position].forEach(player2 => {
          console.log('check: ' + player + ', ' + player2)
          if (player == player2) {
            equalCount++ 
          }
        })
        if (equalCount > 1) {
          valid = false
        }
      })
    })

    if (!valid) {
      this.openSnackBar('Spieler dürfen nicht öfter als einmal aufgestellt werden.', 'Nicht gespeichert.')
    } else {
      this.firebaseService.setLineup("grenzlandcup", this.authService.currentLeague.name, this.lineup, this.originalLineup)
    }
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
    this.originalLineup["goal"].push(new Lineup())
    
    for (let index = 0; index < gridColumnsDefenseFirstLine; index++) {
      this.lineup["defense1"].push(new Lineup())
      this.originalLineup["defense1"].push(new Lineup())
    }
    for (let index = 0; index < gridColumnsDefenseSecondLine; index++) {
      this.lineup["defense2"].push(new Lineup())
      this.originalLineup["defense2"].push(new Lineup())
    }
    for (let index = 0; index < gridColumnsMidfieldFirstLine; index++) {
      this.lineup["midfield1"].push(new Lineup())
      this.originalLineup["midfield1"].push(new Lineup())
    }
    for (let index = 0; index < gridColumnsMidfieldSecondLine; index++) {
      this.lineup["midfield2"].push(new Lineup())
      this.originalLineup["midfield2"].push(new Lineup())
    }
    for (let index = 0; index < gridColumnsAttackFirstLine; index++) {
      this.lineup["attack1"].push(new Lineup())
      this.originalLineup["attack1"].push(new Lineup())
    }
    for (let index = 0; index < gridColumnsAttackSecondLine; index++) {
      this.lineup["attack2"].push(new Lineup())
      this.originalLineup["attack2"].push(new Lineup())
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
    
    this.lineup[linedUpPlayer.position][index] = p.player.split(' ').join('') 
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    })
  }
}

export class PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
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
