import { Component, OnInit } from '@angular/core'
import { FirebaseService } from '../services/firebase.service'

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  faqs: any[]

  constructor(public firebaseService: FirebaseService) { }

  ngOnInit() {
    this.firebaseService.getFaq().valueChanges().subscribe((faqArray) => {
      this.faqs = faqArray
    })
  }
}
