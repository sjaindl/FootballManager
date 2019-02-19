import { Injectable } from '@angular/core'
import { AngularFirestore } from 'angularfire2/firestore'
import { AuthService } from './auth.service'
import {Md5} from 'ts-md5/dist/md5'

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  positions = ['goal', 'defense1', 'defense2', 'midfield1', 'midfield2', 'attack1', 'attack2']

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
    return this.getUserFoundedLeague(league, foundedLeague).set({
      name: foundedLeague
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

}

export class Player {
  name: string
  value: number
}
