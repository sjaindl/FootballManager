import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthStore } from '../../../auth/store/auth.store';
import { AuthService } from '../../../service/auth.service';

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
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  readonly storage = inject(Storage);

  editMode: Signal<boolean>;
  currentName = this.authStore.userName();
  photoRef: Promise<string> | undefined;

  constructor(private authService: AuthService) {
    this.editMode = computed(() => false);
  }

  ngOnInit() {
    const photoRef = this.authStore.imageRef();
    if (photoRef) {
      this.loadImageRef(photoRef);
    }
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
    var storageLocation = '/users/' + this.authStore.uid();
    console.log(storageLocation);
    let storageRef = ref(this.storage, storageLocation);
    uploadBytesResumable(storageRef, event.target.files[0]).then(() => {
      this.authService.updatePhotoRef(storageLocation);
      this.loadImageRef(storageLocation);
    });
  }

  loadImageRef(photoRef: string) {
    let photo = ref(this.storage, photoRef);
    this.photoRef = getDownloadURL(photo);
  }

  hasPhotoRef(): boolean {
    const photoRef = this.authStore.user()?.photoRef;
    if (photoRef) {
      return photoRef.length > 0;
    }
    return false;
  }
}
