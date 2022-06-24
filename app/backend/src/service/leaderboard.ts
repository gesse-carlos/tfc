import sortArray = require('sort-array');
import { ClubRepository } from '../utils/repository';
import { IClubCap, IClubStats, IMatchScore } from '../utils/interfaces';

export default class LeaderboardService {
  private _clubRepository: ClubRepository;

  constructor() {
    this._clubRepository = new ClubRepository();
  }

  private static countPoints(matches: IMatchScore[]) {
    return matches.reduce((points, match) => {
      if (match.goalsFavor > match.goalsOwn) return points + 3;
      if (match.goalsFavor === match.goalsOwn) return points + 1;
      return points;
    }, 0);
  }

  private static countVictories(matches: IMatchScore[]) {
    return matches.reduce((wons, match) => {
      if (match.goalsFavor > match.goalsOwn) return wons + 1;
      return wons;
    }, 0);
  }

  private static countDraws(matches: IMatchScore[]) {
    return matches.reduce((draws, match) => {
      if (match.goalsFavor === match.goalsOwn) return draws + 1;
      return draws;
    }, 0);
  }

  private static countLosses(matches: IMatchScore[]) {
    return matches.reduce((losses, match) => {
      if (match.goalsFavor < match.goalsOwn) return losses + 1;
      return losses;
    }, 0);
  }

  private static countGoalsFavor(matches: IMatchScore[]) {
    return matches.reduce((goalsFavor, match) => goalsFavor + match.goalsFavor, 0);
  }

  private static countGoalsOwn(matches: IMatchScore[]) {
    return matches.reduce((goalsOwn, match) => goalsOwn + match.goalsOwn, 0);
  }

  private static sortScore(clubStats: IClubStats[]) {
    const sortKeys = ['totalPoints', 'totalVictories', 'goalsBalance', 'goalsFavor', 'goalsOwn'];
    const sortOrder = ['desc', 'desc', 'desc', 'desc', 'desc'];
    return sortArray(clubStats, { by: sortKeys, order: sortOrder });
  }

  private static createLeaderboard(clubHistory: IClubCap[]) {
    const leaderboard = clubHistory.map(({ clubName, matches }) => {
      const clubStats = {
        name: clubName,
        totalPoints: this.countPoints(matches),
        totalGames: matches.length,
        totalVictories: this.countVictories(matches),
        totalDraws: this.countDraws(matches),
        totalLosses: this.countLosses(matches),
        goalsFavor: this.countGoalsFavor(matches),
        goalsOwn: this.countGoalsOwn(matches),
        goalsBalance: 0,
        efficiency: 0,
      };

      clubStats.goalsBalance = clubStats.goalsFavor - clubStats.goalsOwn;
      clubStats.efficiency = +(((clubStats.totalPoints / (matches.length * 3)) * 100).toFixed(2));

      return clubStats;
    });

    return this.sortScore(leaderboard);
  }

  async getHomeRank() {
    const homeRank = await this._clubRepository.getHomeRank();

    const leaderboard = LeaderboardService.createLeaderboard(homeRank);

    return { code: 200, data: leaderboard };
  }

  async getAwayRank() {
    const awayRank = await this._clubRepository.getAwayRank();

    const leaderboard = LeaderboardService.createLeaderboard(awayRank);

    return { code: 200, data: leaderboard };
  }

  async getTeamCapRank() {
    const capRank = await this._clubRepository.getTeamCapRank();

    const leaderboard = LeaderboardService.createLeaderboard(capRank);

    return { code: 200, data: leaderboard };
  }
}
