import { Injectable } from '@angular/core'
import { Firestore, addDoc, deleteDoc, docData, getDoc, getDocs, limit, orderBy, query, where } from '@angular/fire/firestore'
import { collection, doc, setDoc, onSnapshot, updateDoc } from '@angular/fire/firestore'
import { AuthService } from './auth.service'
import { Md5 } from 'ts-md5/dist/md5'

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  positions = ['Tormann', 'Verteidigung1', 'Verteidigung2', 'Mittelfeld1', 'Mittelfeld2', 'Angriff1', 'Angriff2']
  initialBalance = 1_200_000
  
  constructor(private db: Firestore, private auth: AuthService) { }

  //FAQ
  getFaq() {

    return collection(this.db, '/faq/')
  }

  //Leagues
  getLeagues() {
    return collection(this.db, '/leagues/');
  }

  getLeague(league) {
    return doc(this.getLeagues(), league)
  }

  getLeagueNews(league) {
    return collection(this.getLeague(league), 'news')
  }

  setLeagueNews(league, news) {
    let newsDoc = doc(this.getLeagueNews(league), 'newsLine')
    return updateDoc(newsDoc, {
      newsLine: news
    })
  }

  getTeam(league, team) {
    let teams = this.getTeams(league)
    return doc(teams, team)
  }

  getPlayer(league, team, player) {
    return doc(this.getPlayers(league, team), player)
  }

  //MVP's - TODO: when there is more than one team, all teams need to be queried!
  getMvpsOfTeamByPoints(league, team) {
    let players = this.getPlayers(league, team)
    return query(players, orderBy("desc"), limit(5));
  }

  getMvpsOfTeamByMarketValue(league, team) {
    let players = this.getPlayers(league, team)
    return query(players, orderBy("marketValue", "desc"), limit(5));
  }

  getTopElevenPlayersOfLastRound(league, team) {
    let players = this.getPlayers(league, team)
    return query(players, orderBy("pointsLastRound", "desc"), limit(11));
  }
  
  //Founded leagues
  getFoundedLeagues(league) {
    return collection(this.getLeague(league), '/foundedLeagues/')
  }

  getFoundedLeague(league, foundedLeague) {
    return doc(this.getFoundedLeagues(league), foundedLeague)
  }

  addFoundedLeague(league, foundedLeague, password) {
    let newLeague = this.getFoundedLeague(league, foundedLeague)
    return setDoc(newLeague, {
      name: foundedLeague,
      hashedPassword: Md5.hashStr(password)
    })
  }

  //Teams
  getTeams(league) {
    let leagueDoc = this.getLeague(league)
    return collection(leagueDoc, '/teams/')
  }

  //Players
  getPlayers(league, team) {
    let teamDoc = this.getTeam(league, team)
    return collection(teamDoc, '/players/')
  }

  playerSold(league, player) {
    let players = this.getPlayers(league, player.team)
    let playerDoc = doc(players, player.playerId)
    updateDoc(playerDoc, {
      sold: player.sold + 1
    })
  }

  playerBought(league, player) {
    let players = this.getPlayers(league, player.team)
    let playerDoc = doc(players, player.playerId)
    updateDoc(playerDoc, {
      bought: player.bought + 1
    })
  }

  changePlayerPoints(league, players) {
    return new Promise((resolve) => {
      getDocs(this.getUsers()).then((usersSnapshot) => {
        let numUsers = usersSnapshot.docs.length
        let curUser = 0
        usersSnapshot.forEach((user) => {
          let userData = user.data()
          let uid = userData['uid']
          curUser++

          getDocs(this.getUserFoundedLeagues(league, uid)).then((foundedLeaguesSnapshot) => {
            foundedLeaguesSnapshot.docs.forEach(foundedLeague => {

            let leagueName = foundedLeague.data['name']
            var userPoints = 0

            getDocs(this.getLineUp(league, leagueName, uid)).then((lineupSnapshot) => {
              players.forEach(player => {
                if (player.pointsCurrentRound != null) {
                  lineupSnapshot.docs.forEach(linedUp => {
                    
                    let player = linedUp.data()['player']
                    
                    if (player == player.player.split(' ').join('')) {
                      userPoints += +player.pointsCurrentRound
                    }
                  })
                }
              })
              
              let points = foundedLeague.data['points']

              var currentUserPoints = 0
              if (points != null) {
                currentUserPoints += points
              }
              
              updateDoc(this.getUserFoundedLeague(league, leagueName, uid), {
                points: currentUserPoints + userPoints,
                pointsLastRound: userPoints
              }).then(() => {
                if (curUser == numUsers) {
                  resolve(numUsers)
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
    return collection(this.db, '/users/')
  }

  getUser(uid) {
    let userCollection = collection(this.db, '/users/')
    return doc(userCollection, uid)
  }

  getCurrentUser() {
    return doc(this.getUsers(), this.auth.userId())
  }

  changeUserName(name) {
    let userDoc = this.getCurrentUser()
    updateDoc(userDoc, {
      displayName: name
    })
  }

  changeUserProfilePicture(photoRef) {
    var userSubsc = onSnapshot(this.getCurrentUser(), { includeMetadataChanges: true }, (user) => {
      let userDoc = doc(this.getUsers(), this.auth.userId()) // let userDoc = doc(this.getUsers(), user.id)
      updateDoc(userDoc, {
        photoRef: photoRef
      })
    })

    userSubsc()
  }
  
  //User Leagues
  getUserLeagues(uid = null) {
    if (uid == null) {
      return collection(this.db, this.getCurrentUser().path, "/userLeagues/")
    } else {
      return collection(this.db, this.getUser(uid).path, "/userLeagues/")
    }
  }

  getUserLeague(league, uid = null) {
    let userCollection = this.getUserLeagues(uid)
    return doc(userCollection, league)
  }

  getUserFoundedLeagues(league, uid = null) {
    let userLeague = this.getUserLeague(league, uid)
    return collection(userLeague, "foundedLeagues")
  }

  getUserFoundedLeague(league, foundedLeague, uid = null) {
    let userLeagues = this.getUserFoundedLeagues(league, uid)
    return doc(userLeagues, foundedLeague)
  }

  addUserLeague(league, foundedLeague) {
    //Create league
    return setDoc(this.getUserFoundedLeague(league, foundedLeague), {
      name: foundedLeague,
      balance: this.initialBalance,
      points: 0,
      formation: '4-4-2'
    })
  }

  changeBalance(league, foundedLeague, change) {
    let leagueDoc = this.getUserFoundedLeague(league, foundedLeague) //.withConverter(this.userFoundedLeagueConverter)

    getDoc(leagueDoc).then( snapshot => {
      let data = snapshot.data()
      let currentBalance = data["balance"]

      return updateDoc(leagueDoc, {
          balance: currentBalance + change
      })
    })
  }

  // Firestore data converter
  userFoundedLeagueConverter = {
    toFirestore: (foundedLeague) => {
        return {
            balance: foundedLeague.balance,
            formation: foundedLeague.formation,
            name: foundedLeague.name,
            points: foundedLeague.points,
            pointsLastRound: foundedLeague.pointsLastRound
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new UserFoundedLeague(data.balance, data.formation, data.name, data.points, data.pointsLastRound);
    }
  };

  //Chefs
  getChefs() {
    return collection(this.db, 'chefs')
  }

  //Lineup
  getLineUp(league, foundedLeague, user = null) {
    return collection(this.getUserFoundedLeague(league, foundedLeague, user), 'lineup')
  }

  clearLineup(league, foundedLeague, originalLineup) {
    // this.getLineUp(league, foundedLeague).valueChanges().subscribe((lineup) => {
    this.positions.forEach(position => {
      originalLineup[position].forEach(player => {
        console.log('del:' + player)
        let lineup = doc(this.getLineUp(league, foundedLeague), player)
        deleteDoc(lineup)
      })
    })
  }

  setLineup(league, foundedLeague, lineup, originalLineup) {
    this.clearLineup(league, foundedLeague, originalLineup)
    
    this.positions.forEach(position => {
      lineup[position].forEach(player => {
        let lineupCol = this.getLineUp(league, foundedLeague)
        let playerDoc = doc(lineupCol, player)
        
        setDoc(playerDoc, {
          index: lineup[position].indexOf(player),
          player: player,
          position: position
        })
      })
    })
  }
  
  //Formation
  setFormation(league, foundedLeague, formation) {
    updateDoc(this.getUserFoundedLeague(league, foundedLeague), {
      formation: formation
    })
  }

  //Players of team
  getPlayersOfTeam(league, foundedLeague, uid = null) {
    return collection(this.getUserFoundedLeague(league, foundedLeague, uid), 'teamPlayers')
  }

  addPlayerOfTeam(league, foundedLeague, player) { 
    let players = this.getPlayersOfTeam(league, foundedLeague)
    addDoc(players, {
      player: player
    })
  }

  removePlayerOfTeam(league, foundedLeague, player) {
    let players = this.getPlayersOfTeam(league, foundedLeague)
    const q = query(players, where("player", "==", player.player));
    getDocs(q).then( snapshot => {
      snapshot.docs.forEach(element => {
        console.log('delete ' + element.id)
        deleteDoc(doc(players, element.id)).then(() => {
          let lineup = this.getLineUp(league, foundedLeague)
          let lineupDoc = doc(lineup, player.player.split(' ').join(''))
          deleteDoc(lineupDoc).catch(error =>  {
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
    let statsCollection = collection(this.db, 'stats')
    return setDoc(doc(statsCollection, 'stats'), {
      visitorCount: count
    })
  }
  
  getVisitorCount() {
    let statsCollection = collection(this.db, 'stats')
    return doc(statsCollection, 'stats')
  }

  //Freeze
  freeze(freeze) {
    let freezeCollection = collection(this.db, 'freeze')
    return setDoc(doc(freezeCollection, 'freeze'), {
      freeze: freeze
    })
  }

  isFreezed() {
    let freezeCollection = collection(this.db, 'freeze')
    return doc(freezeCollection, 'freeze')
  }
}

export class Player {
  name: string
  value: number
}

class UserFoundedLeague {
  balance: number
  formation: string
  name: string
  points: number
  pointsLastRound: number

  constructor (balance, formation, name, points, pointsLastRound) {
      this.balance = balance;
      this.formation = formation;
      this.name = name;
      this.points = points;
      this.pointsLastRound = pointsLastRound;
  }
  toString() {
      return this.balance + this.formation + this.name + ', ' + this.points + ', ' + this.pointsLastRound;
  }
}