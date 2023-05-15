/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.id = null;
    this.username = null;
    this.password = null;
    this.token = null;
    this.status = null;
    this.userRank = null;
    this.numberGames = null;
    this.totalPointsCurrentGame = null;
    this.totalPointsAllGames = null;
    this.currentPoints = null;
    this.totalBlitzPointsAllGames = null;
    this.blitzRank = null;
    this.totalRapidPointsAllGames = null;
    this.rapidRank = null;
    Object.assign(this, data);
  }
}
export default User;