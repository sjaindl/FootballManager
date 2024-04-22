import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Storage, getDownloadURL, ref } from '@angular/fire/storage';
import { Observable, from, of, switchMap } from 'rxjs';

export interface S11Image {
  ref: string | undefined;
  url: string | undefined;
  alt?: string;
}

@Component({
  selector: 's11-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss',
})
export class ImageComponent {
  image = input<S11Image>();
  imageUrl$: Observable<string | undefined>;

  constructor(private storage: Storage) {
    this.imageUrl$ = toObservable(this.image).pipe(
      switchMap(image => {
        const imageRef = image?.ref;
        if (imageRef && imageRef !== '') {
          const storageRef = ref(this.storage, imageRef);
          return from(getDownloadURL(storageRef));
        }

        return of(undefined);
      })
    );
  }
}
