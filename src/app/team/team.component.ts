import { Component, OnInit } from '@angular/core'
import { FirebaseService } from '../services/firebase.service'
import { AuthService } from '../services/auth.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Lineup } from '../shared/lineup';
import { Player } from '../shared/player';
import { Storage } from '@angular/fire/storage';
import { collectionData, docData, getDoc } from '@angular/fire/firestore';
import { Config } from '../shared/config';

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

  freezed: boolean = false

  displayedColumns: string[] = [/*'position',  'team', */ 'playerImage', 'player', 'marketValue', 'points']
  dataSourceGoalkeepers: Player[]
  dataSourceDefenders: Player[]
  dataSourceMidfielders: Player[]
  dataSourceAttackers: Player[]
  teamPositionSortOrder = new Map<string, number>()

  log = false

  constructor(public firebaseService: FirebaseService, public authService: AuthService, private storage: Storage, private snackBar: MatSnackBar) { 
    this.teamPositionSortOrder.set("Tormann", 1)
    this.teamPositionSortOrder.set("Verteidigung", 2)
    this.teamPositionSortOrder.set("Mittelfeld", 3)
    this.teamPositionSortOrder.set("Angriff", 4)
  }

  ngOnInit() {
    docData(this.firebaseService.isFreezed()).forEach((doc) => {
      var isFreezed = doc['freeze']
      if(this.log) {
        console.log("isFreezed: " + JSON.stringify(isFreezed))
      }
      
      this.freezed = isFreezed
    })
    
    this.initLineupArray() 
    //this.setFormation('4-4-2')

    let teamRef = this.firebaseService.getUserFoundedLeague(Config.curLeague, this.authService.currentLeague.name)

    getDoc(teamRef).then((teamsSnapshot) => {
      let doc = teamsSnapshot.data()
      var formation = doc['formation']
      this.formation = formation
      this.setFormation(formation)

      let teams = this.firebaseService.getTeams(Config.curLeague)

      if(this.log) {
        console.log("receive league data: " + JSON.stringify(doc))
        console.log("Got formation: " + JSON.stringify(formation))
        console.log("teams data: " + JSON.stringify(teams))
      }

      collectionData(teams).forEach((teamsArray) => {
        this.teams = teamsArray

        if(this.log) {
          console.log("receive teams data: " + JSON.stringify(teamsArray.length))
        }
  
        teamsArray.forEach(team => {
          if(this.log) {
            console.log(team.id)
          }

          collectionData(this.firebaseService.getPlayers(Config.curLeague, team.id)).forEach((playersArray) => {
            if(this.log) {
              console.log("receive players data: " + JSON.stringify(playersArray.length))
            }
  
            playersArray.forEach(p => {
              if(this.log) {
                console.log("init player: " + JSON.stringify(p))
              }
              let player = new Player()
              player.init(p, team.id)
              this.players.push(player)
            })
            
            collectionData(this.firebaseService.getPlayersOfTeam(Config.curLeague, this.authService.currentLeague.name)).forEach((playersOfTeamArray) => {
              if(this.log) {
                console.log("receive playersOfTeamArray data: " + JSON.stringify(playersOfTeamArray.length))
              }
              playersOfTeamArray.forEach(p => {
                let playerOfTeam = new Player()
                let player = this.getPlayerByName(p.player)
                playerOfTeam.init(player, team.id)
                playerOfTeam.player = player.player
                playerOfTeam.loadImageRef(this.storage)
                this.playersOfTeam.push(playerOfTeam)

                if(this.log) {
                  console.log('player of team: ' + playerOfTeam.player.length)
                }

                let sortedData = this.playersOfTeam.sort((a, b) => {
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

                this.dataSourceGoalkeepers = sortedData.filter((player) => {
                  return player.position == 'Tormann'
                })

                this.dataSourceDefenders = sortedData.filter((player) => {
                  return player.position == 'Verteidigung'
                })

                this.dataSourceMidfielders = sortedData.filter((player) => {
                  return player.position == 'Mittelfeld'
                })

                this.dataSourceAttackers = sortedData.filter((player) => {
                  return player.position == 'Angriff'
                })
              })
  
              collectionData(this.firebaseService.getLineUp(Config.curLeague, this.authService.currentLeague.name)).forEach((lineupArray) => {
                if(this.log) {
                  console.log("receive LineupArray data: " + JSON.stringify(lineupArray.length))
                }

                lineupArray.forEach(p => {
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
    })
  }

  curIndex: number
  curPos: string

  initLineupArray() {
    this.lineup = []
    this.lineup['Tormann'] = []
    this.lineup['Verteidigung1'] = []
    this.lineup['Verteidigung2'] = []
    this.lineup['Mittelfeld1'] = []
    this.lineup['Mittelfeld2'] = []
    this.lineup['Angriff1'] = []
    this.lineup['Angriff2'] = []

    this.originalLineup = []
    this.originalLineup['Tormann'] = []
    this.originalLineup['Verteidigung1'] = []
    this.originalLineup['Verteidigung2'] = []
    this.originalLineup['Mittelfeld1'] = []
    this.originalLineup['Mittelfeld2'] = []
    this.originalLineup['Angriff1'] = []
    this.originalLineup['Angriff2'] = []
  }

  save() {
    if (this.freezed) {
      this.openSnackBar('Aufstellung darf derzeit nicht geändert werden.', '')
      return
    }

    let playerArr = []
    this.firebaseService.positions.forEach(position => {
      this.lineup[position].forEach(player => {
        playerArr.push(player)
      })
    })

    let playerSet = new Set(playerArr)
    console.dir(playerArr)
    console.dir(playerSet)

    console.log("playerArr len " + playerArr.length + ", set len " + playerSet.size)
    
    if (playerArr.length != playerSet.size) {
      this.openSnackBar('Spieler dürfen nicht öfter als einmal aufgestellt werden.', 'Nicht gespeichert.')
    } else {
      this.firebaseService.setFormation(Config.curLeague, this.authService.currentLeague.name, this.formation)
      this.firebaseService.setLineup(Config.curLeague, this.authService.currentLeague.name, this.lineup, this.originalLineup)
      this.openSnackBar('Aufstellung gespeichert', '')
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
    this.formation = formation
    this.firebaseService.clearLineup(Config.curLeague, this.authService.currentLeague.name, this.originalLineup)

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
    this.lineup["Tormann"].push(new Lineup())
    this.originalLineup["Tormann"].push(new Lineup())
    
    for (let index = 0; index < gridColumnsDefenseFirstLine; index++) {
      this.lineup["Verteidigung1"].push(new Lineup())
      this.originalLineup["Verteidigung1"].push(new Lineup())
    }
    for (let index = 0; index < gridColumnsDefenseSecondLine; index++) {
      this.lineup["Verteidigung2"].push(new Lineup())
      this.originalLineup["Verteidigung2"].push(new Lineup())
    }
    for (let index = 0; index < gridColumnsMidfieldFirstLine; index++) {
      this.lineup["Mittelfeld1"].push(new Lineup())
      this.originalLineup["Mittelfeld1"].push(new Lineup())
    }
    for (let index = 0; index < gridColumnsMidfieldSecondLine; index++) {
      this.lineup["Mittelfeld2"].push(new Lineup())
      this.originalLineup["Mittelfeld2"].push(new Lineup())
    }
    for (let index = 0; index < gridColumnsAttackFirstLine; index++) {
      this.lineup["Angriff1"].push(new Lineup())
      this.originalLineup["Angriff1"].push(new Lineup())
    }
    for (let index = 0; index < gridColumnsAttackSecondLine; index++) {
      this.lineup["Angriff2"].push(new Lineup())
      this.originalLineup["Angriff2"].push(new Lineup())
    }
  }

  selectPlayer(player, index, pos) {
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
