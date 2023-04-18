import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { docData, getDoc } from '@angular/fire/firestore';
// import { StatisticsService } from '../services/statistics.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  sessions: String = null

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {
      getDoc(this.firebaseService.getVisitorCount()).then((value) => {
        if(value.exists) {
          let data = value.data()

          let visitorCount = data['visitorCount']
          this.sessions = visitorCount
          if (visitorCount != null) {
            this.firebaseService.setVisitorCount(visitorCount + 1)
          }
        }
      })
  }
}
