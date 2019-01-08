import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

   @ViewChild(MatSidenav)
    private sidenav: MatSidenav;

    ngAfterContentInit() {
        this.sidenav._animationStarted.subscribe(() => {
          this.setSideNavigationWidth();
        });
    }

   width = '0px'

   setSideNavigationWidth() {
    this.width = this.sidenav.opened ? '100%' : '0px';
   }

  constructor() { }

  ngOnInit() {
  }

}
