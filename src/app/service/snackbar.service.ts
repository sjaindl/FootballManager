import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  readonly snackBar = inject(MatSnackBar);

  open(message: string) {
    this.snackBar.open(message, '', {
      duration: 2000,
    });
  }
}
