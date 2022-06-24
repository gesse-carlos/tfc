export interface IPayload {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface ICredential {
  email: string;
  password: string;
}

export interface IUser {
  id: number;
  username: string;
  role: string;
  email: string;
  password: string;
}

export interface IUserRepository {
  getByEmail(email: string): Promise<IUser | null>;
}

export interface ILoginResponse {
  code: number;
  data:
  | {
    message: string;
    user?: undefined;
    token?: undefined;
  }
  | {
    user: {
      id: number;
      email: string;
      role: string;
      username: string;
    };
    token: string;
    message?: undefined;
  };
}

export interface ILoginService {
  login(credential: ICredential): Promise<ILoginResponse>;
}

export interface ILoginController extends ILoginService {
  validate(token: IPayload): { code: number; data: string };
}

export interface IClub {
  id: number;
  clubName: string;
}

export interface IClubStats {
  name: string,
  totalPoints: number,
  totalGames: number,
  totalVictories: number,
  totalDraws: number,
  totalLosses: number,
  goalsFavor: number,
  goalsOwn: number,
  goalsBalance: number,
  efficiency: number,
}

export interface IMatch {
  id: number;
  homeTeam: number;
  homeTeamGoals: number;
  awayTeam: number;
  awayTeamGoals: number;
  inProgress: boolean;
  homeClub: {
    clubName: string;
  };
  awayClub: {
    clubName: string;
  };
}

export interface INewMatch {
  homeTeam: number;
  awayTeam: number;
  homeTeamGoals: number;
  awayTeamGoals: number;
  inProgress: true;
}

export interface IMatchResponse extends INewMatch {
  id: number;
}

export interface IScore {
  homeTeamGoals: number;
  awayTeamGoals: number;
}

export interface IMatchScore {
  goalsFavor: number;
  goalsOwn: number;
}

export interface IClubCap {
  clubName: string;
  matches: IMatchScore[];
}

export interface IClubRepository {
  getAll(): Promise<IClub[]>;
  getById(id: string): Promise<IClub | undefined>;
}

export interface IMatchRepository {
  getAll(): Promise<IMatch[]>;
  getAllInProgress(): Promise<IMatch[]>;
  getAllFinished(): Promise<IMatch[]>;
  getById(id: string): Promise<IMatch>;
  addMatch(data: INewMatch): Promise<IMatchResponse>;
  finishMatch(id: string): Promise<number>;
  updateMatchScore(id: string, newScore: IScore): Promise<number>;
}

export interface IClubService {
  getAll(): Promise<{
    code: number;
    data: IClub[];
  }>;
  getById(id: string): Promise<
  | {
    code: number;
    data: IClub;
  }
  | {
    code: number;
    data: {
      message: string;
    };
  }
  >;
}

export interface IMatchService {
  getAll(inProgress: boolean | undefined): Promise<{
    code: number;
    data: IMatch[];
  }>;

  getById(id: string): Promise<
  | {
    code: number;
    data: IMatch;
  }
  | {
    code: number;
    data: {
      message: string;
    };
  }
  >;

  addMatch(data: INewMatch): Promise<
  | {
    code: number;
    data: {
      message: string;
    };
  }
  | {
    code: number;
    data: IMatchResponse;
  }
  >;

  finishMatch(id: string): Promise<{
    code: number;
    data: {
      message: string;
    };
  }>;

  updateMatchScore(
    id: string,
    newScore: IScore
  ): Promise<{
    code: number;
    data: {
      message: string;
    };
  }>;
}
