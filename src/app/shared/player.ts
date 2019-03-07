export class Player {
    team: string
    player: string
    marketValue: number
    points: number
    position: string
    playerId: string

    //admin area properties:
    pointsCurrentRound: number
    newMarketValue: number
  
    init(json, team) {
      this.player = json.name
      this.marketValue = json.marketValue
      this.points = json.points
      this.position = json.position
      this.team = team
    }
}
