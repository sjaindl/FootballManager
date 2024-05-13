import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, Signal, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Storage, getDownloadURL, ref } from '@angular/fire/storage';
import { from, of, switchMap } from 'rxjs';

export interface S11Image {
  ref: string | undefined;
  url: string | undefined;
  alt?: string;
}

@Component({
  selector: 's11-image',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss',
})
export class ImageComponent {
  image = input<S11Image>();
  width = input<number>(100);
  height = input<number>(75);

  imageRef$: Signal<string | undefined>;

  constructor(private storage: Storage) {
    this.imageRef$ = toSignal(
      toObservable(this.image).pipe(
        switchMap(image => {
          const imageRef = image?.ref;
          if (imageRef && imageRef !== '') {
            const storageRef = ref(this.storage, imageRef);
            return from(getDownloadURL(storageRef));
          }

          return of(undefined);
        })
      )
    );
  }
}
