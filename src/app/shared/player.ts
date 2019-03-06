export class Player {
    team: string
    player: string
    marketValue: number
    points: number
    pointsCurrentRound: number
    position: string
    playerId: string
  
    init(json, team) {
      this.player = json.name
      this.marketValue = json.marketValue
      this.points = json.points
      this.position = json.position
      this.team = team
    }
}
