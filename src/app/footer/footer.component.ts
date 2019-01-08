import { Component, OnInit } from '@angular/core';
// import { StatisticsService } from '../services/statistics.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  sessions: String = null

  // constructor(private statisticsService: StatisticsService) { }

  ngOnInit() {
    // this.statisticsService.getVisitorCount().subscribe(sessions => {
    //   this.sessions = sessions
    // })
  }
}
