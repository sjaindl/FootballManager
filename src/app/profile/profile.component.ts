import { Component, OnInit } from '@angular/core'
import { FirebaseService } from '../services/firebase.service'
import { AuthService } from '../services/auth.service'
import { AngularFireStorage } from 'angularfire2/storage'
import { MatSnackBar } from '@angular/material'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  email: string
  displayName: string
  photoUrl: string
  photoRef: Observable<string | null>
  editMode: boolean

  constructor(public firebaseService: FirebaseService, public authService: AuthService, private storage: AngularFireStorage, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.firebaseService.getCurrentUser().get().subscribe((doc) => {
      this.displayName = doc.get('displayName')
      this.email = doc.get('email')
      
      var url = doc.get('photoURL')
      var photoRef = doc.get('photoRef')
      if (photoRef != null) {
        this.loadImageRef(photoRef)
      } else if (url != null) {
        this.photoUrl = url
      } else {
        this.loadImageRef('players/no_photo.jpg')
      }

    })
  }
  
  setEditMode() {
    this.editMode = !this.editMode
  }

  changeName() {
    this.setEditMode()
    this.firebaseService.changeUserName(this.displayName)
  }

  loadImageRef(photoRef) {
    this.photoRef = this.storage.ref(photoRef).getDownloadURL()
  }

  upload(event) {
    var storageLocation = '/users/' + this.authService.userId()
    console.log(storageLocation)
    this.storage.upload(storageLocation, event.target.files[0]).then(() => {
      this.firebaseService.changeUserProfilePicture(storageLocation)
      this.loadImageRef(storageLocation)
    })

  }
}
