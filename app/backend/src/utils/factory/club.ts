import { ClubService } from '../../service';
import { ClubController } from '../../controller/controllers';

export default (): ClubController => {
  const clubService = new ClubService();

  return new ClubController(clubService);
};
