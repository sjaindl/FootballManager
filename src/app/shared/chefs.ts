export class Chef {
    firstName: String
    lastName: String
    function: String
    imagePath: String

    init(object) {
        this.firstName = object.firstName
        this.lastName = object.lastName
        this.function = object.function
        this.imagePath = object.imagePath
    }
}
