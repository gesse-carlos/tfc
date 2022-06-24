import { ClubModel, MatchModel } from '../../database/models';
import { IClub, IClubCap } from '../interfaces';

export default class ClubRepository {
  private _clubModel: typeof ClubModel;

  private _matchModel: typeof MatchModel;

  constructor() {
    this._clubModel = ClubModel;
    this._matchModel = MatchModel;
  }

  async getAll(): Promise<IClub[]> {
    return (await this._clubModel.findAll()).map((club) => club.get({ plain: true }));
  }

  async getById(id: string): Promise<IClub | undefined> {
    return (await this._clubModel.findByPk(id))?.get({ plain: true });
  }

  async getHomeRank(): Promise<IClubCap[]> {
    return (await this._clubModel.findAll({
      include: [{
        model: this._matchModel,
        as: 'homeMatch',
        attributes: [['home_team_goals', 'goalsFavor'], ['away_team_goals', 'goalsOwn']],
        where: { inProgress: false },
      }],
    }))
      .map((clubHistory) => {
        const plainHistory = clubHistory.get({ plain: true });
        plainHistory.matches = [...plainHistory.homeMatch];
        delete plainHistory.homeMatch;
        return plainHistory;
      });
  }

  async getAwayRank(): Promise<IClubCap[]> {
    return (await this._clubModel.findAll({
      include: [{
        model: this._matchModel,
        as: 'awayMatch',
        attributes: [['home_team_goals', 'goalsOwn'], ['away_team_goals', 'goalsFavor']],
        where: { inProgress: false },
      }],
    }))
      .map((clubHistory) => {
        const plainHistory = clubHistory.get({ plain: true });
        plainHistory.matches = [...plainHistory.awayMatch];
        return plainHistory;
      });
  }

  async getTeamCapRank(): Promise<IClubCap[]> {
    return (await this._clubModel.findAll({
      include: [{
        model: this._matchModel,
        as: 'homeMatch',
        attributes: [['home_team_goals', 'goalsFavor'], ['away_team_goals', 'goalsOwn']],
        where: { inProgress: false },
      }, {
        model: this._matchModel,
        as: 'awayMatch',
        attributes: [['home_team_goals', 'goalsOwn'], ['away_team_goals', 'goalsFavor']],
        where: { inProgress: false },
      }],
    }))
      .map((club) => {
        const clubHistory = club.get({ plain: true });
        clubHistory.matches = [...clubHistory.homeMatch, ...clubHistory.awayMatch];
        return clubHistory;
      });
  }
}
