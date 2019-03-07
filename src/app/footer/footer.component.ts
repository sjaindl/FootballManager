import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
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
    this.firebaseService.getVisitorCount().subscribe((doc) => {
      var visitorCount = doc.get('visitorCount')
      this.sessions = visitorCount
      if (visitorCount != null) {
        this.firebaseService.setVisitorCount(visitorCount + 1)
      }
    })
  }
}
