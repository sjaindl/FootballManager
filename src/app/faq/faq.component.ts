import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
} from '@angular/material/expansion';
import { Observable, map, tap } from 'rxjs';
import { FirebaseService } from '../service/firebase.service';
import { Faq } from '../shared/faq';

@Component({
  selector: 's11-faq',
  standalone: true,
  imports: [CommonModule, MatExpansionPanel, MatExpansionPanelHeader],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
})
export class FaqComponent implements OnInit {
  faqs: Faq[] = [];
  faqs$: Observable<Faq[]>;

  constructor(private firebaseService: FirebaseService) {
    this.faqs$ = this.firebaseService.getFaq().pipe(
      map(doc => {
        return doc.map(faq => {
          const question = faq['question'] ?? '';
          return {
            index: 1,
            question: faq['question'] ?? '',
            answer: faq['answer'] ?? '',
          };
        });
      }),
      tap(console.warn)
    );
  }

  ngOnInit() {
    var index = 0;

    this.firebaseService.getFaq().pipe(map(() => {}));
    // .get()
    // .forEach(() => {
    //   // faqArray.forEach(doc => {
    //   //   var question = doc.get('question');
    //   //   var answer = doc.get('answer');
    //   //   var faq: Faq = {
    //   //     index: index,
    //   //     question: question,
    //   //     answer: answer,
    //   //   };
    //   //   index++;
    //   //   this.faqs.push(faq);
    //   // });
    // });
  }
}
