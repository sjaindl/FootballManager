import { AngularFireStorage } from "angularfire2/storage"
import { Observable } from "rxjs"

export class Chef {
    firstName: String
    lastName: String
    function: String
    imagePath: String

    imageRef: string
    loadedImageRef: Observable<string | null>

    constructor(private storage: AngularFireStorage) {
    }
    
    init(object) {
        this.firstName = object.firstName
        this.lastName = object.lastName
        this.function = object.function
        this.imagePath = object.imagePath
        this.imageRef = object.imageRef
    }

    loadImageRef() {
        console.log(this.imageRef)
        this.loadedImageRef = this.storage.ref(this.imageRef).getDownloadURL()
      }
}
