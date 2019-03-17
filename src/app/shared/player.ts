import { Observable } from "rxjs"
import { AngularFireStorage } from "angularfire2/storage"

export class Player {
    team: string
    player: string
    marketValue: number
    points: number
    pointsLastRound: number
    position: string
    playerId: string
    imageRef: string
    loadedImageRef: Observable<string | null>

    //admin area properties:
    pointsCurrentRound: number
    newMarketValue: number
    sold: number
    bought: number

    constructor(private storage: AngularFireStorage) {
    }
  
    init(json, team) {
      this.player = json.name
      this.playerId = json.playerId
      this.marketValue = json.marketValue
      this.points = json.points
      this.pointsLastRound = json.pointsLastRound
      this.position = json.position
      this.team = team
      this.sold = json.sold
      this.bought = json.bought
      this.imageRef = json.imageRef
    }

    loadImageRef() {
      this.loadedImageRef = this.storage.ref(this.imageRef).getDownloadURL()
    }
}
