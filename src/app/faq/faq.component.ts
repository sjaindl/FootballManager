import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
export class FaqComponent {
  private firebaseService = inject(FirebaseService);

  faqs$: Observable<Faq[]>;
  constructor() {
    let index = 0;

    this.faqs$ = this.firebaseService.getFaqs().pipe(
      map(doc => {
        return doc.map(faq => {
          return {
            index: index++,
            question: faq['question'] ?? '',
            answer: faq['answer'] ?? '',
          };
        });
      }),
      tap(console.info)
    );
  }
}
