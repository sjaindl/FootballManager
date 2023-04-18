import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
// import { DeviceDetectorService } from '../../../node_modules/ngx-device-detector';
// import { baseUrlImages } from '../shared/baseurls';
import { Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser'
import { DocumentData, collectionData, docData, getDocs } from '@angular/fire/firestore';
import { AuthProvider } from 'ngx-auth-firebaseui';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../services/firebase.service';
import { League } from '../shared/League';
import { NewleagueDialogComponent } from '../newleague.dialog/newleague.dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Md5 } from 'ts-md5';

export interface Player {
  firstName: string
  lastName: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  imageBaseUrl: String
  public items: DocumentData[]
  isMobile = null
  providers = AuthProvider
  joinleaguename: string
  joinpasswordname: string
  username: string

  leagues: League[] = []
  
  newsLine: string
  mvpPlayersByPoints: MVP[] = []
  mvpPlayersByMarketValue: MVP[] = []
  topEleven: MVP[] = []
  
  //private deviceService: DeviceDetectorService
  constructor(public router: Router, private cdr: ChangeDetectorRef, private titleService: Title, 
    private metaTagService: Meta, private angularFireAuth: Auth, 
    public authService : AuthService, public firebaseService: FirebaseService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) { 
  }
  
  ngOnInit() {
    /*
    this.deviceInfo = this.deviceService.getDeviceInfo();

    device info holds the following properties:
    browser
    os
    device (mobile/table/desktop)
    userAgent
    os_version
    */
    // this.imageBaseUrl = baseUrlImages
    this.checkDevice()

    this.titleService.setTitle("Fußball Manager: Home")
    this.metaTagService.updateTag({
      name: 'description', content: "Spiele auf fussballmanager.at mit deinen Lieblingsspielern aus dem Grenzlandcup in eigenen Ligen gegen deine Freunde. Schlag noch heute am Transfermarkt zu und erstelle deine persönliche Aufstellung."
    })

    this.angularFireAuth.onAuthStateChanged((user) => {
      if (user) {
        this.openSnackBar('Anmeldung erfolgreich!', user.displayName)

        console.log("user signed in: " + user.displayName)

        collectionData(this.firebaseService.getUserFoundedLeagues("grenzlandcup")).subscribe((leaguesArray) => {
          this.leagues = []
          
          leaguesArray.forEach(element => {
            let league = new League()
            league.init(element)
            this.leagues.push(league)
          })
        })
        
      } else {
        console.log("user signed out")
      }
    })
  }

  selectLeague(league: League) {
    this.authService.currentLeague = league
    this.fetchLeagueDetail()
  }

  showNewLeagueDialog() {
    this.dialog.open(NewleagueDialogComponent, {
      width: '350px',
      data: {  }
    })
  }

  joinLeague() {
    console.log(this.joinleaguename)
    docData(this.firebaseService.getFoundedLeague("grenzlandcup", this.joinleaguename)).subscribe(league => {
      let anyLeague: any = league

      if (league == null) {
        this.openSnackBar('Liga existiert nicht. Wähle einen existierenden Liganamen', '')
      } else if (anyLeague.hashedPassword != Md5.hashStr(this.joinpasswordname)) {
        this.openSnackBar('Falsches Passwort.', '')
      } else {
          this.firebaseService.addUserLeague("grenzlandcup", this.joinleaguename).then( param => {

          console.log(param)
          let league = new League()
          league.name = this.joinleaguename
          this.authService.currentLeague = league
          this.fetchLeagueDetail()
        }).catch(error =>  {
          console.log(error)
          this.openSnackBar(error, '')
        })
      }
    })
  }

  fetchLeagueDetail() {
    // this.authService.currentLeague
    collectionData(this.firebaseService.getLeagueNews("grenzlandcup")).subscribe(news => {
      let anyNews: any = news
      this.newsLine = anyNews[0].newsLine
    })

    this.mvpPlayersByPoints = []
    this.mvpPlayersByMarketValue = []
    this.topEleven = []

    let mvpQuery = this.firebaseService.getMvpsOfTeamByPoints("grenzlandcup", "hvtdp")
    getDocs(mvpQuery).then( querySnapshot => {
      querySnapshot.docs.forEach(element => {
        console.log(element.data())
        let mvp = new MVP()
        mvp.name = element.data().name
        mvp.points = element.data().points
        this.mvpPlayersByPoints.push(mvp)
      })
    })

    let marketValueQuery = this.firebaseService.getMvpsOfTeamByMarketValue("grenzlandcup", "hvtdp")
    getDocs(marketValueQuery).then( querySnapshot => {
      querySnapshot.docs.forEach(element => {
        console.log(element.data())
        let mvp = new MVP()
        mvp.name = element.data().name
        mvp.marketValue = element.data().marketValue
        this.mvpPlayersByMarketValue.push(mvp)
      })
    })

    let topElevenQuery = this.firebaseService.getTopElevenPlayersOfLastRound("grenzlandcup", "hvtdp")
    getDocs(topElevenQuery).then( querySnapshot => {
      querySnapshot.docs.forEach(element => {
        console.log(element.data())
        let mvp = new MVP()
        mvp.name = element.data().name
        mvp.points = element.data().pointsLastRound
        this.topEleven.push(mvp)
      })
    })
  }

  ngAfterViewInit() {
    this.cdr.detectChanges()
  }

  checkDevice() {
    // this.isMobile = this.deviceService.isMobile()
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.checkDevice()
  }
  
  showImageDetails(item) {
    console.log('navigate to ' + '/news/' + item.newsId)
    this.router.navigate(['/news', item.newsId])
  }

  printUser(event) {
    console.log(event)
  }

  printError() {
    console.log("error")
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    })
  }
}

class MVP {
  name: string
  points: number
  marketValue: number
}
