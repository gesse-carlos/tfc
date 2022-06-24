import { ClubModel, MatchModel } from '../../database/models';
import {
  IMatch,
  IMatchResponse,
  INewMatch,
  IScore,
} from '../interfaces';

export default class MatchesRepository {
  private _clubModel: typeof ClubModel;

  private _matchModel: typeof MatchModel;

  constructor() {
    this._clubModel = ClubModel;
    this._matchModel = MatchModel;
  }

  async getAllByProgress(inProgress: boolean): Promise<IMatch[]> {
    return (
      await this._matchModel.findAll({
        where: { inProgress },
        include: [
          { model: this._clubModel, as: 'homeClub', attributes: ['clubName'] },
          { model: this._clubModel, as: 'awayClub', attributes: ['clubName'] },
        ],
      })
    ).map((match) => match.get({ plain: true }));
  }

  async getAll(): Promise<IMatch[]> {
    return (
      await this._matchModel.findAll({
        include: [
          { model: this._clubModel, as: 'homeClub', attributes: ['clubName'] },
          { model: this._clubModel, as: 'awayClub', attributes: ['clubName'] },
        ],
      })
    ).map((match) => match.get({ plain: true }));
  }

  async getById(id: string): Promise<IMatch> {
    return (
      await this._matchModel.findByPk(id, {
        include: [
          { model: this._clubModel, as: 'homeClub', attributes: ['clubName'] },
          { model: this._clubModel, as: 'awayClub', attributes: ['clubName'] },
        ],
      })
    )?.get({ plain: true });
  }

  async addMatch(data: INewMatch): Promise<IMatchResponse> {
    return (await this._matchModel.create(data)).get({ plain: true });
  }

  async finishMatch(id: string): Promise<number> {
    const [status] = await this._matchModel.update(
      { inProgress: false },
      { where: { id } },
    );
    return status;
  }

  async updateMatchScore(id: string, newScore: IScore): Promise<number> {
    const [status] = await this._matchModel.update(newScore, {
      where: { id, inProgress: true },
    });
    return status;
  }
}
