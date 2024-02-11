import { Component, OnInit } from '@angular/core'
import { Title, Meta } from '@angular/platform-browser'
import { FirebaseService } from '../services/firebase.service'
import { Chef } from '../shared/chefs'
import { Storage } from '@angular/fire/storage';
import { collectionData } from '@angular/fire/firestore';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent implements OnInit {

  chefs: Chef[] = []
  constructor(public firebaseService: FirebaseService, 
    private titleService: Title, 
    private metaTagService: Meta,
    private storage: Storage) { }

  ngOnInit() {
    this.titleService.setTitle("Fußball Manager: Über uns")
    this.metaTagService.updateTag({
      name: 'description', content: "Informationen rund über den Fußball Manager"
    })

    let data = collectionData(this.firebaseService.getChefs())
    data.forEach(chefArray => {
      chefArray.forEach(element => {
        let chef = new Chef(this.storage)
        chef.init(element)
        chef.loadImageRef()
        this.chefs.push(chef)
      })
      this.chefs = this.chefs.sort((a, b) => {
        if (a.order < b.order) {
          return -1
        } 
        else if (a.order > b.order) {
          return 1
        } else {
          return 0
        }
      })
    })
  }
}
