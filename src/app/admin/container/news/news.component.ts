import { Component, inject, signal, WritableSignal } from '@angular/core';
import { News } from '../../../shared/news';
import { NewsStore } from '../../store/news.store';

@Component({
  selector: 's11-news',
  standalone: true,
  imports: [],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
})
export class NewsComponent {
  readonly newsStore = inject(NewsStore);

  news: WritableSignal<News | undefined> = signal(undefined);

  constructor() {
    this.news.set(this.newsStore.news());
  }

  setNews(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    this.news.set({ text: element.value } as News);
  }

  saveNews(): void {
    const news = this.news();
    if (!news) {
      return;
    }
    this.newsStore.setNews(news);
  }
}
