import { Component, OnInit } from '@angular/core'
import { FirebaseService } from '../services/firebase.service'
import { collectionData } from '@angular/fire/firestore'

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  faqs: any[]

  constructor(public firebaseService: FirebaseService) { }

  ngOnInit() {
    collectionData(this.firebaseService.getFaq()).subscribe((faqArray) => {
      this.faqs = faqArray
    })
  }
}
