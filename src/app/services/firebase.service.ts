import { Injectable } from '@angular/core'
import { AngularFirestore } from 'angularfire2/firestore'
import { AuthService } from './auth.service'
import {Md5} from 'ts-md5/dist/md5'

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

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
  
  //Players of team
  getPlayersOfTeam(league, foundedLeague) {
    return this.getUserFoundedLeague(league, foundedLeague).collection('teamPlayers')
  }

}

export class Player {
  name: string
  value: number
}
