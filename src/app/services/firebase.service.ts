import { Injectable } from '@angular/core'
import { AngularFirestore } from 'angularfire2/firestore'
import { AuthService } from './auth.service'
import {Md5} from 'ts-md5/dist/md5'

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  positions = ['goal', 'defense1', 'defense2', 'midfield1', 'midfield2', 'attack1', 'attack2']
  initialBalance = 200000

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
  getUserLeagues() {
    return this.getCurrentUser().collection('/userLeagues/')
  }

  getUserLeague(league) {
    return this.getUserLeagues().doc(league)
  }

  getUserFoundedLeagues(league) {
    return this.getUserLeague(league).collection('foundedLeagues')
  }

  getUserFoundedLeague(league, foundedLeague) {
    return this.getUserFoundedLeagues(league).doc(foundedLeague)
  }

  addUserLeague(league, foundedLeague) {
    //Add user ref to league
    this.getUserStanding(league, foundedLeague).set({
      uid: this.auth.userId,
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
      
      this.getUserFoundedLeague(league, foundedLeague).set({
        name: foundedLeague,
        balance: currentBalance + value
      })

    })
  }

  //Chefs
  getChefs() {
    return this.db.collection('chefs')
  }

  //Lineup
  getLineUp(league, foundedLeague) {
    return this.getUserFoundedLeague(league, foundedLeague).collection('lineup')
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
  getFormation(league, foundedLeague) {
    return this.getLineUp(league, foundedLeague).doc('formation')
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
}

export class Player {
  name: string
  value: number
}
