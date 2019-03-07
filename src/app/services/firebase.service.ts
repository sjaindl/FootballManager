import { Injectable } from '@angular/core'
import { AngularFirestore } from 'angularfire2/firestore'
import { AuthService } from './auth.service'
import {Md5} from 'ts-md5/dist/md5'

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  positions = ['Tormann', 'Verteidigung1', 'Verteidigung2', 'Mittelfeld1', 'Mittelfeld2', 'Angriff1', 'Angriff2']
  initialBalance = 4000000

  constructor(private db: AngularFirestore, private auth: AuthService) { }

  //FAQ
  getFaq() {
    return this.db.collection('/faq/').valueChanges()
  }

  //Leagues
  getLeagues() {
    return this.db.collection('/leagues/')
  }

  getLeague(league) {
    return this.getLeagues().doc(league)
  }

  getTeam(league, team) {
    return this.getTeams(league).doc(team)
  }

  getPlayer(league, team, player) {
    return this.getPlayers(league, team).doc(player)
  }
  
  //Founded leagues
  getFoundedLeagues(league) {
    return this.getLeague(league).collection('/foundedLeagues/')
  }

  getFoundedLeague(league, foundedLeague) {
    return this.getFoundedLeagues(league).doc(foundedLeague)
  }

  addFoundedLeague(league, foundedLeague, password) {
    return this.getFoundedLeague(league, foundedLeague).set({
      name: foundedLeague,
      hashedPassword: Md5.hashStr(password)
    })
  }

  //Standing
  getStanding(league, foundedLeague) {
    return this.getFoundedLeague(league, foundedLeague).collection('members')
  }

  getUserStanding(league, foundedLeague) {
    return this.getStanding(league, foundedLeague).doc(this.auth.userId())
  }

  //Teams
  getTeams(league) {
    return this.getLeague(league).collection('/teams/')
  }

  //Players
  getPlayers(league, team) {
    return this.getTeam(league, team).collection('/players/')
  }

  changePlayerPoints(league, players) {
    players.forEach(player => {
      if (player.pointsCurrentRound != null || player.newMarketValue != null) {
        this.getPlayers(league, player.team).doc(player.playerId).set({
          name: player.player,
          marketValue: player.newMarketValue ? +player.newMarketValue : +player.marketValue,
          position: player.position,
          playerId: player.playerId,
          points: player.pointsCurrentRound ? +player.points + +player.pointsCurrentRound : +player.points
        })
      }
    })

    var userSubsc = this.getUsers().valueChanges().subscribe((users) => {
      userSubsc.unsubscribe()

      users.forEach(user => {
        var anyUser: any = user
        var subsc = this.getUserFoundedLeagues(league, anyUser.uid).valueChanges().subscribe((foundedLeagues) => {
          subsc.unsubscribe()

          foundedLeagues.forEach(foundedLeague => {

            var userPoints = 0
            var subsc2 = this.getLineUp(league, foundedLeague.name, anyUser.uid).valueChanges().subscribe((linedUps) => {
              subsc2.unsubscribe()
              
              players.forEach(player => {
                if (player.pointsCurrentRound != null) {
                  linedUps.forEach(linedUp => {
                    if (linedUp.player == player.player.split(' ').join('')) {
                      userPoints += +player.pointsCurrentRound
                    }
                  })
                }
              })
              
              var currentUserPoints = 0
              if (foundedLeague.points != null) {
                currentUserPoints += foundedLeague.points
              }
              
              this.getUserFoundedLeague(league, foundedLeague.name, anyUser.uid).set({
                name: foundedLeague.name,
                balance: foundedLeague.balance,
                points: currentUserPoints + userPoints
              })
              
            })
          })
        })    
      })
      
    })
  }

  //Games: TODO

  //User
  getUsers() {
    return this.db.collection('/users/')
  }

  getUser(uid) {
    return this.db.collection('/users/').doc(uid)
  }

  getCurrentUser() {
    return this.getUsers().doc(this.auth.userId())
  }
  
  //User Leagues
  getUserLeagues(uid = null) {
    if (uid == null) {
      return this.getCurrentUser().collection('/userLeagues/')
    } else {
      return this.getUser(uid).collection('/userLeagues/')
    }
  }

  getUserLeague(league, uid = null) {
    return this.getUserLeagues(uid).doc(league)
  }

  getUserFoundedLeagues(league, uid = null) {
    return this.getUserLeague(league, uid).collection('foundedLeagues')
  }

  getUserFoundedLeague(league, foundedLeague, uid = null) {
    return this.getUserFoundedLeagues(league, uid).doc(foundedLeague)
  }

  addUserLeague(league, foundedLeague) {
    //Add user ref to league
    this.getUserStanding(league, foundedLeague).set({
      uid: this.auth.userId(),
      points: 0
    })
    
    //Create league
    return this.getUserFoundedLeague(league, foundedLeague).set({
      name: foundedLeague,
      balance: this.initialBalance
    })
  }

  changeBalance(league, foundedLeague, value) {
    this.getUserFoundedLeague(league, foundedLeague).get().subscribe((doc) => {
      var currentBalance = doc.get('balance')
      var currentFormation = doc.get('formation')
      
      this.getUserFoundedLeague(league, foundedLeague).set({
        name: foundedLeague,
        balance: currentBalance + value,
        formation: currentFormation
      })

    })
  }

  //Chefs
  getChefs() {
    return this.db.collection('chefs')
  }

  //Lineup
  getLineUp(league, foundedLeague, user = null) {
    return this.getUserFoundedLeague(league, foundedLeague, user).collection('lineup')
  }

  clearLineup(league, foundedLeague, originalLineup) {
    // this.getLineUp(league, foundedLeague).valueChanges().subscribe((lineup) => {
    this.positions.forEach(position => {
      originalLineup[position].forEach(player => {
        console.log('del:' + player)
        this.getLineUp(league, foundedLeague).doc(player).delete()
      })
    })
  }

  setLineup(league, foundedLeague, lineup, originalLineup) {
    this.clearLineup(league, foundedLeague, originalLineup)
    
    this.positions.forEach(position => {
      lineup[position].forEach(player => {
        console.log('add: ' + player)
        this.getLineUp(league, foundedLeague).doc(player).set({
          index: lineup[position].indexOf(player),
          player: player,
          position: position
        })
      })
    })
  }
  
  //Formation
  setFormation(league, foundedLeague, formation) {
    this.getUserFoundedLeague(league, foundedLeague).get().subscribe((doc) => {
      var currentBalance = doc.get('balance')
      
      this.getUserFoundedLeague(league, foundedLeague).set({
        name: foundedLeague,
        balance: currentBalance,
        formation: formation
      })

    })
  }

  //Players of team
  getPlayersOfTeam(league, foundedLeague) {
    return this.getUserFoundedLeague(league, foundedLeague).collection('teamPlayers')
  }

  addPlayerOfTeam(league, foundedLeague, player) {
    this.getPlayersOfTeam(league, foundedLeague).add({
      player: player
    })
  }

  removePlayerOfTeam(league, foundedLeague, player) {
    let players = this.getPlayersOfTeam(league, foundedLeague).ref
    players.where("player", "==", player.player).get().then( querySnapshot => {
      querySnapshot.docs.forEach(element => {
        console.log('delete ' + element.id)
        players.doc(element.id).delete().then(() => {
          this.getLineUp(league, foundedLeague).doc(player.player.split(' ').join('')).delete().catch(error =>  {
            console.log(error)
          }).then(() =>  {
            console.log("successfully removed from lineup")
          })
        }).catch(error =>  {
          console.log(error)
        })
      })
    })
  }

  //Visitor Count
  setVisitorCount(count) {
    return this.db.collection('stats').doc('stats').set({
      visitorCount: count
    })
  }
  
  getVisitorCount() {
    return this.db.collection('stats').doc('stats').get()
  }

  //Freeze
  freeze(freeze) {
    return this.db.collection('freeze').doc('freeze').set({
      freeze: freeze
    })
  }

  isFreezed() {
    return this.db.collection('freeze').doc('freeze').get()
  }
}

export class Player {
  name: string
  value: number
}
