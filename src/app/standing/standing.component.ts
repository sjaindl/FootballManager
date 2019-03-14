import { Component, OnInit } from '@angular/core'
import { FirebaseService } from '../services/firebase.service'
import { AuthService } from '../services/auth.service'
import { Title, Meta } from '@angular/platform-browser'

@Component({
  selector: 'app-standing',
  templateUrl: './standing.component.html',
  styleUrls: ['./standing.component.css']
})
export class StandingComponent implements OnInit {

  standings: Standing[] = []
  dataSource: Standing[]
  displayedColumns: string[] = ['userName', 'points']

  constructor(public firebaseService: FirebaseService, public authService: AuthService, private titleService: Title, 
    private metaTagService: Meta) { }

  ngOnInit() {
    this.titleService.setTitle("Fußball Manager: Tabelle")
    this.metaTagService.updateTag({
      name: 'description', content: "Spiele auf fussballmanager.at mit deinen Lieblingsspielern aus dem Grenzlandcup in eigenen Ligen gegen deine Freunde. Checke hier in der Tabelle deine Platzierung!"
    })

    this.fetchStandings().then((res) => {
      console.log('Standings fetched:' + res )
      this.setDataSource()
    }).catch((err) => {
      console.log('err: ' + err)
    })

  }

  fetchStandings() {
    return new Promise((resolve) => {
      
      this.firebaseService.getUsers().valueChanges().subscribe((users) => {
        let numberOfUsersToCheck = users.length
        var currentUser = 0

        if (numberOfUsersToCheck == 0) {
          resolve(0)
        }

        users.forEach(user => {
          var anyUser: any = user

          var leagueSusc = this.firebaseService.getUserFoundedLeagues("grenzlandcup", anyUser.uid).valueChanges().subscribe((leaguesArray) => {
            leagueSusc.unsubscribe()
  
            leaguesArray.forEach(element => {
              if (element.name == this.authService.currentLeague.name) {
                var name = anyUser.displayName
                let standing = new Standing()
                standing.uid = anyUser.uid
                standing.userName = name
                standing.points = element.points != null ? element.points : 0

                this.standings.push(standing)
              }
            })

            currentUser += 1
            if (currentUser == numberOfUsersToCheck) {
              resolve(this.standings.length)
            }
          })

        })
      })
    })
  }

  setDataSource() {
    this.dataSource = this.standings.sort((a, b) => {
      if (b.points < a.points) {
        return -1
      } 
      else if (b.points > a.points) {
        return 1
      }
      else {
        if (a.userName < b.userName) {
          return -1
        } 
        else if (a.userName > b.userName) {
          return 1
        } else {
          return 0
        }
      }
    })
  }


}

export class Standing {
  uid: string
  userName: string
  points: number
}