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
    this.currentPoints = null;
    Object.assign(this, data);
  }
}
export default User;