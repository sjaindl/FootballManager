import { Component, OnInit } from '@angular/core'
import { Title, Meta } from '@angular/platform-browser'
import { FirebaseService } from '../services/firebase.service'
import { Chef } from '../shared/chefs'

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent implements OnInit {

  chefs: Chef[] = []
  constructor(public firebaseService: FirebaseService, 
    private titleService: Title, private metaTagService: Meta) { }

  ngOnInit() {
    this.titleService.setTitle("Fußball Manager: Über uns")
    this.metaTagService.updateTag({
      name: 'description', content: "Informationen rund über den Fußball Manager"
    })

    this.firebaseService.getChefs().valueChanges().subscribe((chefArray) => {
      chefArray.forEach(element => {
        let chef = new Chef()
        chef.init(element)
        this.chefs.push(chef)
      })
    })
  }
}
