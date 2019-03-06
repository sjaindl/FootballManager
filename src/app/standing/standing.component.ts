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

    this.fetchStandings()
  }

  fetchStandings() {


    var subsc = this.firebaseService.getStanding("grenzlandcup", this.authService.currentLeague.name).valueChanges().subscribe((standingsArray) => {
      subsc.unsubscribe()
      var numberOfUsers = standingsArray.length
      var currentUser = 0

      this.firebaseService.getUsers().valueChanges().subscribe((users) => {
        users.forEach(user => {
          var anyUser: any = user

          this.firebaseService.getUserFoundedLeague("grenzlandcup",this.authService.currentLeague.name, anyUser.uid).get().subscribe((leagueDoc) => {
            var name = anyUser.displayName
            let standing = new Standing()
            standing.uid = anyUser.uid
            standing.userName = name
            standing.points = leagueDoc.get('points') != null ? leagueDoc.get('points') : 0

            this.standings.push(standing)

            currentUser++
            if (currentUser == numberOfUsers) {
              this.setDataSource()
            }
          })
        })
      })
    })
  }

  setDataSource() {
    this.dataSource = this.standings.sort((a, b) => {
      if (a.points < b.points) {
        return -1
      } 
      else if (a.points > b.points) {
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