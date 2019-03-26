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
    return this.db.collection('/faq/')
  }

  //Leagues
  getLeagues() {
    return this.db.collection('/leagues/')
  }

  getLeague(league) {
    return this.getLeagues().doc(league)
  }

  getLeagueNews(league) {
    return this.getLeague(league).collection('news')
  }

  getTeam(league, team) {
    return this.getTeams(league).doc(team)
  }

  getPlayer(league, team, player) {
    return this.getPlayers(league, team).doc(player)
  }

  //MVP's - TODO: when there is more than one team, all teams need to be queried!
  getMvpsOfTeamByPoints(league, team) {
    return this.getPlayers(league, team).ref.orderBy('points', 'desc').limit(5)
  }

  getMvpsOfTeamByMarketValue(league, team) {
    return this.getPlayers(league, team).ref.orderBy('marketValue', 'desc').limit(5)
  }

  getTopElevenPlayersOfLastRound(league, team) {
    return this.getPlayers(league, team).ref.orderBy('pointsLastRound', 'desc').limit(11)
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

  //Teams
  getTeams(league) {
    return this.getLeague(league).collection('/teams/')
  }

  //Players
  getPlayers(league, team) {
    return this.getTeam(league, team).collection('/players/')
  }

  playerSold(league, player) {
    this.getPlayers(league, player.team).doc(player.playerId).ref.update({
      sold: player.sold + 1
    })
  }

  playerBought(league, player) {
    this.getPlayers(league, player.team).doc(player.playerId).ref.update({
      bought: player.bought + 1
    })
  }

  changePlayerPoints(league, players) {
    return new Promise((resolve) => {
      var userSubsc = this.getUsers().valueChanges().subscribe((users) => {
        userSubsc.unsubscribe()

        if (users.length == 0) {
          resolve(0)
        }
        
        var lastUser: any = users[users.length - 1]
        var lastUserUid = lastUser.uid
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
                
                this.getUserFoundedLeague(league, foundedLeague.name, anyUser.uid).ref.update({
                  points: currentUserPoints + userPoints,
                  pointsLastRound: userPoints
                }).then(() => {
                  if (lastUserUid == anyUser.uid) {
                    resolve(users.length)
                  }
                })
              })
            })
          })    
        })
      })
    })
  }

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
    //Create league
    return this.getUserFoundedLeague(league, foundedLeague).set({
      name: foundedLeague,
      balance: this.initialBalance,
      points: 0,
      formation: '4-4-2'
    })
  }

  changeBalance(league, foundedLeague, value) {
    this.getUserFoundedLeague(league, foundedLeague).get().subscribe((doc) => {
      var currentBalance = doc.get('balance')
      doc.ref.update({
        balance: currentBalance + value
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
    this.getUserFoundedLeague(league, foundedLeague).ref.update({
      formation: formation
    })
  }

  //Players of team
  getPlayersOfTeam(league, foundedLeague, uid = null) {
    return this.getUserFoundedLeague(league, foundedLeague, uid).collection('teamPlayers')
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
