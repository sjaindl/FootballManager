export class Player {
    team: string
    player: string
    marketValue: number
    points: number
    pointsLastRound: number
    position: string
    playerId: string

    //admin area properties:
    pointsCurrentRound: number
    newMarketValue: number
    sold: number
    bought: number
  
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
    }
}
