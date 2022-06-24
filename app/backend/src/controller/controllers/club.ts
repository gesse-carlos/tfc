import { ClubService } from '../../service';

export default class ClubController {
  constructor(
    private clubService: ClubService,
  ) {}

  async getAll() {
    return this.clubService.getAll();
  }

  async getById(id: string) {
    return this.clubService.getById(id);
  }
}
