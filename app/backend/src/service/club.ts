import { ClubRepository } from '../utils/repository';

export default class ClubsService {
  private _clubRepository: ClubRepository;

  constructor() {
    this._clubRepository = new ClubRepository();
  }

  async getAll() {
    const clubs = await this._clubRepository.getAll();

    return { code: 200, data: clubs };
  }

  async getById(id: string) {
    const club = await this._clubRepository.getById(id);

    return club
      ? { code: 200, data: club }
      : { code: 404, data: { message: 'Club not found' } };
  }
}
