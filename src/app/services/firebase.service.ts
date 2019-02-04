import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from './auth.service';
import {Md5} from 'ts-md5/dist/md5'
// import { auth } from 'firebase';

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

  getTeams(league) {
    return this.getLeague(league).collection('/teams/')
  }

  getTeam(league, team) {
    return this.getTeams(league).doc(team)
  }
  
  getPlayers(league, team) {
    return this.getTeam(league, team).collection('/players/')
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
    return this.getUserLeague(league).collection("foundedLeagues")
  }

  getUserFoundedLeague(league, foundedLeague) {
    return this.getUserFoundedLeagues(league).doc(foundedLeague)
  }

  addUserLeague(league, foundedLeague) {
    return this.getUserFoundedLeague(league, foundedLeague).set({
      name: foundedLeague
    })
  }
}

export class Player {
  name: string
  value: number
}
