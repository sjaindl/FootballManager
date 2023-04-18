import { getDownloadURL, ref, Storage } from '@angular/fire/storage'
import { Observable } from "rxjs"

export class Chef {
    firstName: String
    lastName: String
    function: String
    imagePath: String
    imageRef: string
    loadedImageRef: Promise<string>

    storageRef = ref(this.storage)

    constructor(private storage: Storage) {
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
        let storageRef = ref(this.storage, this.imageRef)
        this.loadedImageRef = getDownloadURL(storageRef)
    }
}
