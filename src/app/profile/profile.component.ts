import { Component, OnInit } from '@angular/core'
import { FirebaseService } from '../services/firebase.service'
import { AuthService } from '../services/auth.service'
import { ref, Storage, uploadBytes, getDownloadURL } from '@angular/fire/storage'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Observable } from 'rxjs'
import { docData } from '@angular/fire/firestore'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  email: string
  displayName: string
  photoUrl: string
  photoRef: Promise<string>
  editMode: boolean

  constructor(public firebaseService: FirebaseService, public authService: AuthService, private storage: Storage, private snackBar: MatSnackBar) { }

  storageRef = ref(this.storage);

  ngOnInit() {
    docData(this.firebaseService.getCurrentUser()).subscribe((doc) => {
      this.displayName = doc['displayName']
      this.email = doc['email']
      
      var url = doc['photoURL']
      
      var photoRef = doc['photoRef']
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
    let photo = ref(this.storage, photoRef)
    
    this.photoRef = getDownloadURL(photo)
  }
  
  upload(event) {
    var storageLocation = '/users/' + this.authService.userId()
    console.log(storageLocation)
    let storageRef = ref(this.storage, storageLocation)
    uploadBytes(storageRef, event.target.files[0]).then(() => {
      this.firebaseService.changeUserProfilePicture(storageLocation)
      this.loadImageRef(storageLocation)
    })
  }
}
