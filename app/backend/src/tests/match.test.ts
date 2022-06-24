import * as chai from "chai";
import { Response } from "superagent";
import { app } from "../app";
import {
  allMatches,
  onlyFinished,
  onlyInProgress,
  validMatches,
} from "./assets/match";
import chaiHttp = require("chai-http");

chai.use(chaiHttp);

const { expect } = chai;

describe("Testing Match endpoints", () => {
  let chaiHttpResponse: Response;
  let _token: string;

  before(async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post("/login")
      .send({ email: "admin@admin.com", password: "secret_admin" });
    _token = chaiHttpResponse.body.token;
  });

  describe("GET /matches", () => {
    it("API returns all matches when the request has no filters", async () => {
      chaiHttpResponse = await chai.request(app).get("/matches");

      const { status, body } = chaiHttpResponse;

      expect(status).to.be.equal(200);
      expect(body.length).to.be.equal(48); // allMatches.length = 48
      expect(body).to.deep.include.members(allMatches);
    });

    it("API returns all matches in progress with inProgress filter", async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get("/matches")
        .query({ inProgress: true });

      const { status, body } = chaiHttpResponse;

      expect(status).to.be.equal(200);
      expect(body.length).to.be.equal(8); // onlyInProgress.length = 8
      expect(body).to.deep.include.members(onlyInProgress);
    });

    it("API returns all finished matches without inProgress filter", async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get("/matches")
        .query({ inProgress: false });

      const { status, body } = chaiHttpResponse;

      expect(status).to.be.equal(200);
      expect(body.length).to.be.equal(40); // onlyFinished.length = 40
      expect(body).to.deep.include.members(onlyFinished);
    });
  });

  describe("GET /matches/:id", () => {
    it("API returns an match based on request id", async () => {
      chaiHttpResponse = await chai.request(app).get("/matches/1");

      const { status, body } = chaiHttpResponse;

      expect(status).to.be.equal(200);
      expect(body).to.be.deep.equal(allMatches[0]);
    });

    it("API returns http status code 400 when the match does not exist", async () => {
      chaiHttpResponse = await chai.request(app).get("/matches/51");

      const { status, body } = chaiHttpResponse;

      expect(status).to.be.equal(404);
      expect(body.message).to.be.equal("Match not found");
    });
  });

  describe("POST /matches", () => {
    let matchId: number;
    it("API saves the created match", async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post("/matches")
        .set("authorization", _token)
        .send({
          id: 13,
          home_team: "Grêmio",
          home_team_goals: "2",
          away_team: "Cruzeiro",
          away_team_goals: "1",
          in_progress: 0,
        });

      const { status, body } = chaiHttpResponse;

      expect(status).to.be.equal(201);
      expect(body).to.haveOwnProperty("id");
      matchId = body.id;
      expect(body).to.be.deep.equal(validMatches);
    });

    it("API returns the match", async () => {
      chaiHttpResponse = await chai.request(app).get(`/matches/${matchId}`);

      const { status, body } = chaiHttpResponse;

      expect(status).to.be.equal(200);
      expect(body).to.be.deep.equal(validMatches);
    });

    describe("Create a new match fails because", () => {
      it("token is invalid", async () => {
        chaiHttpResponse = await chai
          .request(app)
          .post("/matches")
          .set("authorization", "wrongtoken");

        const { message } = chaiHttpResponse.body;

        expect(chaiHttpResponse.status).to.be.equal(401);
        expect(message).to.be.equal("Invalid token");
      });

      it("token is not provided", async () => {
        chaiHttpResponse = await chai.request(app).post("/matches");

        const { message } = chaiHttpResponse.body;

        expect(chaiHttpResponse.status).to.be.equal(401);
        expect(message).to.be.equal("Token not found");
      });

      it("home team is not provided", async () => {
        chaiHttpResponse = await chai
          .request(app)
          .post("/matches")
          .set("authorization", _token)
          .send({
            awayTeam: 4,
            homeTeamGoals: 2,
            awayTeamGoals: 0,
            inProgress: true
          });

        const { message } = chaiHttpResponse.body;

        expect(chaiHttpResponse.status).to.be.equal(400);
        expect(message).to.be.equal("Home Team must be provided");
      });

      it("home team is a string", async () => {
        chaiHttpResponse = await chai
          .request(app)
          .post("/matches")
          .set("authorization", _token)
          .send({
            homeTeam: 'vasco',
            awayTeam: 2,
            homeTeamGoals: 2,
            awayTeamGoals: 2,
            inProgress: true
          });

        const { message } = chaiHttpResponse.body;

        expect(chaiHttpResponse.status).to.be.equal(422);
        expect(message).to.be.equal("Home Team must be a positive integer");
      });

      it("home team id is negative", async () => {
        chaiHttpResponse = await chai
          .request(app)
          .post("/matches")
          .set("authorization", _token)
          .send({
            homeTeam: -1,
            awayTeam: 2,
            homeTeamGoals: 1,
            awayTeamGoals: 0,
            inProgress: true
          });

        const { message } = chaiHttpResponse.body;

        expect(chaiHttpResponse.status).to.be.equal(422);
        expect(message).to.be.equal("Home Team must be a positive integer");
      });

      it("away team is not provided", async () => {
        chaiHttpResponse = await chai
          .request(app)
          .post("/matches")
          .set("authorization", _token)
          .send({
            homeTeam: 1,
            homeTeamGoals: 1,
            awayTeamGoals: 0,
            inProgress: true
          });

        const { message } = chaiHttpResponse.body;

        expect(chaiHttpResponse.status).to.be.equal(400);
        expect(message).to.be.equal("Away Team must be provided");
      });

      it("away team is a string", async () => {
        chaiHttpResponse = await chai
          .request(app)
          .post("/matches")
          .set("authorization", _token)
          .send({
            homeTeam: 1,
            awayTeam: 'vasco',
            homeTeamGoals: 2,
            awayTeamGoals: 2,
            inProgress: true
          });

        const { message } = chaiHttpResponse.body;

        expect(chaiHttpResponse.status).to.be.equal(422);
        expect(message).to.be.equal("Away Team must be a positive integer");
      });

      it("away team id is negative", async () => {
        chaiHttpResponse = await chai
          .request(app)
          .post("/matches")
          .set("authorization", _token)
          .send({
            homeTeam: 2,
            awayTeam: -1,
            homeTeamGoals: 1,
            awayTeamGoals: 0,
            inProgress: true
          });

        const { message } = chaiHttpResponse.body;

        expect(chaiHttpResponse.status).to.be.equal(422);
        expect(message).to.be.equal("Away Team must be a positive integer");
      });

      it("home team goals is not provided", async () => {
        chaiHttpResponse = await chai
          .request(app)
          .post("/matches")
          .set("authorization", _token)
          .send({
            homeTeam: 1,
            awayTeam: 2,
            awayTeamGoals: 1,
            inProgress: true
          });

        const { message } = chaiHttpResponse.body;

        expect(chaiHttpResponse.status).to.be.equal(400);
        expect(message).to.be.equal("Home Team Goals must be provided");
      });

      it("home team goals is a string", async () => {
        chaiHttpResponse = await chai
          .request(app)
          .post("/matches")
          .set("authorization", _token)
          .send({
            homeTeam: 1,
            awayTeam: 2,
            homeTeamGoals: '1',
            awayTeamGoals: 2,
            inProgress: true
          });

        const { message } = chaiHttpResponse.body;

        expect(chaiHttpResponse.status).to.be.equal(422);
        expect(message).to.be.equal("Home Team Goals must be an integer");
      });

      it("home team goals is negative", async () => {
        chaiHttpResponse = await chai
          .request(app)
          .post("/matches")
          .set("authorization", _token)
          .send({
            homeTeam: 1,
            awayTeam: 2,
            homeTeamGoals: -1,
            awayTeamGoals: 1,
            inProgress: true
          });

        const { message } = chaiHttpResponse.body;

        expect(chaiHttpResponse.status).to.be.equal(422);
        expect(message).to.be.equal("Home Team Goals can not be negative");
      });

      it("away team goals is not provided", async () => {
        chaiHttpResponse = await chai
          .request(app)
          .post("/matches")
          .set("authorization", _token)
          .send({
            homeTeam: 1,
            awayTeam: 2,
            homeTeamGoals: 1,
            inProgress: true
          });

        const { message } = chaiHttpResponse.body;

        expect(chaiHttpResponse.status).to.be.equal(400);
        expect(message).to.be.equal("Away Team Goals must be provided");
      });

      it("away team goals is a string", async () => {
        chaiHttpResponse = await chai
          .request(app)
          .post("/matches")
          .set("authorization", _token)
          .send({
            homeTeam: 1,
            awayTeam: 2,
            homeTeamGoals: 1,
            awayTeamGoals: '2',
            inProgress: true
          });

        const { message } = chaiHttpResponse.body;

        expect(chaiHttpResponse.status).to.be.equal(422);
        expect(message).to.be.equal("Away Team Goals must be an integer");
      });

      it("away team goals is negative", async () => {
        chaiHttpResponse = await chai
          .request(app)
          .post("/matches")
          .set("authorization", _token)
          .send({
            homeTeam: 1,
            awayTeam: 2,
            homeTeamGoals: 1,
            awayTeamGoals: -1,
            inProgress: true
          });

        const { message } = chaiHttpResponse.body;

        expect(chaiHttpResponse.status).to.be.equal(422);
        expect(message).to.be.equal("Away Team Goals can not be negative");
      });

      it("in progress is not provided", async () => {
        chaiHttpResponse = await chai
          .request(app)
          .post("/matches")
          .set("authorization", _token)
          .send({
            homeTeam: 1,
            awayTeam: 2,
            homeTeamGoals: 0,
            awayTeamGoals: 0,
          });

        const { message } = chaiHttpResponse.body;

        expect(chaiHttpResponse.status).to.be.equal(400);
        expect(message).to.be.equal("In Progress must be provided as true");
      });

      it("in progress is a string", async () => {
        chaiHttpResponse = await chai
          .request(app)
          .post("/matches")
          .set("authorization", _token)
          .send({
            homeTeam: 1,
            awayTeam: 2,
            homeTeamGoals: 0,
            awayTeamGoals: 0,
            inProgress: 'vasco'
          });

        const { message } = chaiHttpResponse.body;

        expect(chaiHttpResponse.status).to.be.equal(422);
        expect(message).to.be.equal("In Progress must be provided as true");
      });

      it("in progress is false", async () => {
        chaiHttpResponse = await chai
          .request(app)
          .post("/matches")
          .set("authorization", _token)
          .send({
            homeTeam: 1,
            awayTeam: 2,
            homeTeamGoals: 0,
            awayTeamGoals: 0,
            inProgress: false
          });

        const { message } = chaiHttpResponse.body;

        expect(chaiHttpResponse.status).to.be.equal(422);
        expect(message).to.be.equal("In Progress must be provided as true");
      });

      it("the teams are the same team", async () => {
        chaiHttpResponse = await chai
          .request(app)
          .post("/matches")
          .set("authorization", _token)
          .send({
            homeTeam: 1,
            awayTeam: 1,
            homeTeamGoals: 3,
            awayTeamGoals: 3,
            inProgress: true
          });

        const { message } = chaiHttpResponse.body;

        expect(chaiHttpResponse.status).to.be.equal(409);
        expect(message).to.be.equal(
          "It is not possible to create a match with two equal teams"
        );
      });

      it("the team does not exist", async () => {
        chaiHttpResponse = await chai
          .request(app)
          .post("/matches")
          .set("authorization", _token)
          .send({
            homeTeam: 17,
            awayTeam: 16,
            homeTeamGoals: 1,
            awayTeamGoals: 1,
            inProgress: true
          });

        const { message } = chaiHttpResponse.body;

        expect(chaiHttpResponse.status).to.be.equal(401);
        expect(message).to.be.equal("There is no team with such id!");
      });
    });
  });

  describe('PATCH /matches/:id/finish', () => {
    it('API returns finish game', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .patch('/matches/40/finish');

        const { status, body } = chaiHttpResponse;

        expect(status).to.be.equal(200);
        expect(body.message).to.be.equal('Finished match');
    });

    it('API updates progress status', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/matches/40');

      const { status, body } = chaiHttpResponse;

      expect(status).to.be.equal(200);
      expect(body.inProgress).to.be.equal(false);
    });
  });

  describe('Update match fails because', () => {
    it('match is already over', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .patch('/matches/1/finish');

        const { status, body } = chaiHttpResponse;

        expect(status).to.be.equal(422);
        expect(body.message).to.be.equal('Match already over or does not exist');
    });

    it('match does not exist', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .patch('/matches/49/finish');

        const { status, body } = chaiHttpResponse;

        expect(status).to.be.equal(422);
        expect(body.message).to.be.equal('Match already over or does not exist');
    });
  });

  describe('PATCH /matches/:id', () => {
    it('API returns an updated score message', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .patch('/matches/42')
        .send({ homeTeamGoals: 1, awayTeamGoals: 2});

        const { status, body } = chaiHttpResponse;

        expect(status).to.be.equal(200);
        expect(body.message).to.be.equal('Match score updated');
    });

    it('API returns the updated match', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/matches/48');

      const { status, body } = chaiHttpResponse;

      expect(status).to.be.equal(200);
      expect(body.homeTeamGoals).to.be.equal(1);
      expect(body.awayTeamGoals).to.be.equal(2);
    });
  });

  describe('Update match fails because', () => {
    it('match is already over', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .patch('/matches/40')
        .send({ homeTeamGoals: 5, awayTeamGoals: 1});

        const { status, body } = chaiHttpResponse;

        expect(status).to.be.equal(422);
        expect(body.message).to.be.equal('Match already over or does not exist');
    });

    it('match does not exist', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .patch('/matches/49')
        .send({ homeTeamGoals: 1, awayTeamGoals: 0});

        const { status, body } = chaiHttpResponse;

        expect(status).to.be.equal(422);
        expect(body.message).to.be.equal('Match already over or does not exist');
    });
  });
});
