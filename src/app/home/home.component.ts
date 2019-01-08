import { Component, OnInit, HostListener, ViewChild, ChangeDetectorRef } from '@angular/core';
// import { DeviceDetectorService } from '../../../node_modules/ngx-device-detector';
// import { baseUrlImages } from '../shared/baseurls';
// import { MysqlService } from '../services/mysql.service';
import { Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser'
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  imageBaseUrl: String
  public items: Observable<any[]>
  isMobile = null

  //private deviceService: DeviceDetectorService, private mysqlService: MysqlService, 
  constructor(db: AngularFirestore, public router: Router, private cdr: ChangeDetectorRef, private titleService: Title, private metaTagService: Meta) { 
    // this.mysqlService.getNews().subscribe(news => {
    //   this.items = news
    // })
    this.items = db.collection('/test').valueChanges();
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
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
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
    this.router.navigate(['/news', item.newsId]);
  }
}
