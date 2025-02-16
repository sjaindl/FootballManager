import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ref, Storage, uploadBytesResumable } from '@angular/fire/storage';
import { MatIconModule } from '@angular/material/icon';
import { SnackbarService } from '../../../service/snackbar.service';
import {
  ImageComponent,
  S11Image,
} from '../../../shared/image/image.component';
import { News } from '../../../shared/news';
import { NewsStore } from '../../store/news.store';

@Component({
  selector: 's11-news',
  standalone: true,
  imports: [MatIconModule, ImageComponent],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
})
export class NewsComponent {
  readonly storage = inject(Storage);
  readonly newsStore = inject(NewsStore);
  snackBarService = inject(SnackbarService);

  generalNews: WritableSignal<string | undefined> = signal(undefined);
  matchdayNews: WritableSignal<string | undefined> = signal(undefined);
  matchdayPhotoRef: WritableSignal<string | undefined> = signal(undefined);
  image: WritableSignal<S11Image | undefined> = signal(undefined);

  constructor() {
    const news = this.newsStore.news();
    this.generalNews.set(news?.generalNews);
    this.matchdayNews.set(news?.matchdayNews);
    this.matchdayPhotoRef.set(news?.matchdayPhotoRef);

    const s11Image = {
      ref: news?.matchdayPhotoRef,
      url: undefined,
      alt: undefined,
    };

    this.image.set(s11Image);
  }

  setGeneralNews(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    this.generalNews.set(element.value);
  }

  setMatchdayNews(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    this.matchdayNews.set(element.value);
  }

  saveNews() {
    const news: News = {
      generalNews: this.generalNews() ?? '',
      matchdayNews: this.matchdayNews() ?? '',
      matchdayPhotoRef: this.matchdayPhotoRef() ?? '',
    };

    this.newsStore.setNews(news);
    this.snackBarService.open('News gespeichert');
  }

  upload(event: any) {
    var storageLocation = '/news/matchday';
    console.log(storageLocation);
    let storageRef = ref(this.storage, storageLocation);

    uploadBytesResumable(storageRef, event.target.files[0]).then(() => {
      this.matchdayPhotoRef.set(storageLocation);

      const s11Image = {
        ref: storageLocation,
        url: undefined,
        alt: undefined,
      };

      this.image.set(s11Image);
    });
  }
}
