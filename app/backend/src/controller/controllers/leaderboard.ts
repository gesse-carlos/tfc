import { LeaderboardService } from '../../service';

export default class LeaderboardController {
  private _leaderBoardService: LeaderboardService;

  constructor() {
    this._leaderBoardService = new LeaderboardService();
  }

  async getHomeRank() {
    return this._leaderBoardService.getHomeRank();
  }

  async getAwayRank() {
    return this._leaderBoardService.getAwayRank();
  }

  async getTeamCapRank() {
    return this._leaderBoardService.getTeamCapRank();
  }
}
