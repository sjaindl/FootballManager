import { Observable } from "rxjs"
import { Storage, getDownloadURL, ref } from "@angular/fire/storage"

export class Player {
    team: string
    player: string
    marketValue: number
    points: number
    pointsLastRound: number
    position: string
    playerId: string
    imageRef: string
    loadedImageRef: Promise<string>

    //admin area properties:
    pointsCurrentRound: number
    newMarketValue: number
    sold: number
    bought: number

    constructor() {
    }
  
    init(json, team) {
      this.player = json['name']
      this.playerId = json['playerId']
      this.marketValue = json['marketValue']
      this.points = json['points']
      this.pointsLastRound = json['pointsLastRound']
      this.position = json['position']
      this.team = team
      this.sold = json['sold']
      this.bought = json['bought']
      this.imageRef = json['imageRef']
    }

    loadImageRef(storage: Storage) {
      let storageRef = ref(storage, this.imageRef)
      this.loadedImageRef = getDownloadURL(storageRef)
    }
}
