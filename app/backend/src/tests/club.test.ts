import * as chai from "chai";
import { Response } from 'superagent';
import { app } from '../app';
import { clubs } from './assets/club';
import chaiHttp = require('chai-http');

chai.use(chaiHttp);

const { expect } = chai;

describe('Testing Club endpoints', () => {
  let chaiHttpResponse: Response;

  describe('GET /clubs', () => {
    it('API returns an list of all clubs', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/clubs');

      const { status, body } = chaiHttpResponse;

      expect(status).to.be.equal(200);
      expect(body).to.be.deep.equal(clubs)
    });
  });

  describe('GET /clubs/:id', () => {
    it('API returns a single club based on ID', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/clubs/1');

      const { status, body } = chaiHttpResponse;

      expect(status).to.be.equal(200);
      expect(body).to.be.deep.equal(clubs[0]);
    });

    it('API returns an 404 http error code when the club does not exist', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/clubs/17');

      const { status, body } = chaiHttpResponse;

      expect(status).to.be.equal(404);
      expect(body.message).to.be.equal('Club not found');
    });
  });
});
