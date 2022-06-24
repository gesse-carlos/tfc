import { MatchService } from '../../service';
import { INewMatch, IScore } from '../../utils/interfaces';

export default class MatchController {
  private _matchService: MatchService;

  constructor() {
    this._matchService = new MatchService();
  }

  async getAll(inProgress: boolean | undefined = undefined) {
    return this._matchService.getAll(inProgress);
  }

  async getById(id: string) {
    return this._matchService.getById(id);
  }

  async addMatch(data: INewMatch) {
    const { awayTeam, awayTeamGoals, homeTeam, homeTeamGoals } = data;
    return this._matchService.addMatch({
      homeTeam,
      awayTeam,
      homeTeamGoals: +homeTeamGoals,
      awayTeamGoals: +awayTeamGoals,
      inProgress: true,
    });
  }

  async finishMatch(id: string) {
    return this._matchService.finishMatch(id);
  }

  async updateMatchScore(id: string, newScore: IScore) {
    return this._matchService.updateMatchScore(id, newScore);
  }
}
