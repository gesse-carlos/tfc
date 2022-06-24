import * as chai from "chai";
import { Response } from 'superagent';
import chaiHttp = require('chai-http');
import { app } from '../app';
import { away, home, teamsCap } from './assets/leaderboard';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testing Leaderboard endpoints', () => {
  let chaiHttpResponse: Response;
  let _token: string;

  before(async () => {
    chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send({ email: 'admin@admin.com', password: 'secret_admin' });

    _token = chaiHttpResponse.body.token
  });

  describe('GET /leaderboard/home', () => {
    it('API returns a rank list of *all* clubs', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/leaderboard/home');

      const { status, body } = chaiHttpResponse;

      expect(status).to.be.equal(200);
      expect(body).to.be.deep.equal(home.homeResult1);
    });

    it('Returns the rank list after adding a new team match', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post('/matches')
        .set('authorization', _token)
        .send({
          homeTeam: 1,
          awayTeam: 2,
          homeTeamGoals: 1,
          awayTeamGoals: 0,
          inProgress: true
        });

      chaiHttpResponse = await chai
        .request(app)
        .patch(`/matches/${chaiHttpResponse.body.id}/finish`);

      chaiHttpResponse = await chai
        .request(app)
        .get('/leaderboard/home');

      const { status, body } = chaiHttpResponse;

      expect(status).to.be.equal(200);
      expect(body).to.be.deep.equal(home.homeResult2);
    });
  });

  describe('GET /leaderboard/away', () => {
    it('API returns a rank list of *all* clubs', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/leaderboard/away');

      const { status, body } = chaiHttpResponse;

      expect(status).to.be.equal(200);
      expect(body).to.be.deep.equal(away.awayResult1);
    });

    it('Returns the rank list after adding a new team match', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post('/matches')
        .set('authorization', _token)
        .send({
          homeTeam: 1,
          awayTeam: 2,
          homeTeamGoals: 1,
          awayTeamGoals: 0,
          inProgress: true
        });

      chaiHttpResponse = await chai
        .request(app)
        .patch(`/matches/${chaiHttpResponse.body.id}/finish`);

      chaiHttpResponse = await chai
        .request(app)
        .get('/leaderboard/away');

      const { status, body } = chaiHttpResponse;

      expect(status).to.be.equal(200);
      expect(body).to.be.deep.equal(away.awayResult2);
    });
  });

  describe('GET /leaderboard', () => {
    it('API returns a rank list of *all* clubs', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/leaderboard');

      const { status, body } = chaiHttpResponse;

      expect(status).to.be.equal(200);
      expect(body).to.be.deep.equal(teamsCap.week1);
    });

    it('Returns the rank list after adding a new team match', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post('/matches')
        .set('authorization', _token)
        .send({
          homeTeam: 1,
          awayTeam: 2,
          homeTeamGoals: 1,
          awayTeamGoals: 0,
          inProgress: true
        });

      chaiHttpResponse = await chai
        .request(app)
        .patch(`/matches/${chaiHttpResponse.body.id}/finish`);

      chaiHttpResponse = await chai
        .request(app)
        .get('/leaderboard');

      const { status, body } = chaiHttpResponse;

      expect(status).to.be.equal(200);
      expect(body).to.be.deep.equal(teamsCap.week2);
    });
  });
});
