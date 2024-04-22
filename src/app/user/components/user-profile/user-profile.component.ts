import { CommonModule } from '@angular/common';
import { Component, computed, inject, Signal } from '@angular/core';
import { ref, Storage, uploadBytesResumable } from '@angular/fire/storage';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthStore } from '../../../auth/store/auth.store';
import { AuthService } from '../../../service/auth.service';
import {
  ImageComponent,
  S11Image,
} from '../../../shared/image/image.component';

@Component({
  selector: 's11-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    ImageComponent,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent {
  readonly authStore = inject(AuthStore);
  readonly storage = inject(Storage);

  editMode: Signal<boolean>;
  currentName = this.authStore.userName();

  image: Signal<S11Image>;

  constructor(private authService: AuthService) {
    this.editMode = computed(() => false);
    this.image = computed(() => ({
      ref: this.authStore.imageRef(),
      url: this.authStore.imageUrl(),
      alt: this.authStore.userName(),
    }));
  }

  setEditMode() {
    this.editMode = computed(() => {
      return true;
    });
  }

  resetEditMode() {
    this.editMode = computed(() => {
      return false;
    });

    if (this.currentName) {
      this.authService.updateName(this.currentName);
    }
  }

  setUserName(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    this.currentName = element.value;
  }

  upload(event: any) {
    this.authStore.updatePhotoRef('players/no_photo.jpg');
    var storageLocation = '/users/' + this.authStore.uid();
    console.log(storageLocation);
    let storageRef = ref(this.storage, storageLocation);
    uploadBytesResumable(storageRef, event.target.files[0]).then(() => {
      this.authService.updatePhotoRef(storageLocation);
      this.authStore.updatePhotoRef(storageLocation);
    });
  }

  hasPhotoRef(): boolean {
    const photoRef = this.authStore.user()?.photoRef;
    if (photoRef) {
      return photoRef.length > 0;
    }
    return false;
  }
}
