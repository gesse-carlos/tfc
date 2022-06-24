import * as chai from "chai";
import { Response } from "superagent";
import { app } from "../app";
import chaiHttp = require("chai-http");

chai.use(chaiHttp);

const { expect } = chai;

describe("Testing Login functionality", () => {
  let chaiHttpResponse: Response;
  let _token: string;

  it("Login is successful, returns 200, user json and token", async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post("/login")
      .send({ email: "admin@admin.com", password: "secret_admin" });

    const { user, token } = chaiHttpResponse.body;

    _token = token;

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(token).not.to.be.undefined;
    expect(user.email).to.be.equal("admin@admin.com");
  });

  describe("Testing email when", () => {
    it("doesn't exist", async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post("/login")
        .send({ email: "notadmin@admin.com", password: "secret_admin" });

      const { message } = chaiHttpResponse.body;

      expect(chaiHttpResponse.status).equal(401);
      expect(message).to.be.equal("Incorrect email or password");
    });

    it("is not provided", async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post("/login")
        .send({ password: "secret_admin" });

      const { message } = chaiHttpResponse.body;

      expect(chaiHttpResponse.status).equal(401);
      expect(message).to.be.equal("All fields must be filled");
    });

    it("is not a string", async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post("/login")
        .send({ email: 12345, password: "secret_admin" });

      const { message } = chaiHttpResponse.body;

      expect(chaiHttpResponse.status).equal(422);
      expect(message).to.be.equal("Email must be a string");
    });

    it("is an empty string", async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post("/login")
        .send({ email: "", password: "secret_admin" });

      const { message } = chaiHttpResponse.body;

      expect(chaiHttpResponse.status).equal(401);
      expect(message).to.be.equal("All fields must be filled");
    });
  });

  describe("Testing password when", () => {
    it("doesn't exist", async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post("/login")
        .send({ email: "admin@admin.com", password: "iambatman" });

      const { message } = chaiHttpResponse.body;

      expect(chaiHttpResponse.status).equal(401);
      expect(message).to.be.equal("Incorrect email or password");
    });

    it("is not provided", async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post("/login")
        .send({ email: "admin@admin.com" });

      const { message } = chaiHttpResponse.body;

      expect(chaiHttpResponse.status).equal(401);
      expect(message).to.be.equal("All fields must be filled");
    });

    it("is not a string", async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post("/login")
        .send({ email: "admin@admin.com", password: 12345 });

      const { message } = chaiHttpResponse.body;

      expect(chaiHttpResponse.status).equal(422);
      expect(message).to.be.equal("Password must be a string");
    });

    it("is an empty string", async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post("/login")
        .send({ email: "admin@admin.com", password: "" });

      const { message } = chaiHttpResponse.body;

      expect(chaiHttpResponse.status).equal(401);
      expect(message).to.be.equal("All fields must be filled");
    });
  });

  describe("Testing token when", () => {
    it("is valid", async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get("/login/validate")
        .set("authorization", _token);

      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.text).to.be.equal("admin");
    });

    it("is invalid", async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get("/login/validate")
        .set("authorization", "inv@lidt0k&n");

      const { message } = chaiHttpResponse.body;

      expect(chaiHttpResponse.status).to.be.equal(401);
      expect(message).to.be.equal("Invalid token");
    });

    it("is not provided", async () => {
      chaiHttpResponse = await chai.request(app).get("/login/validate");

      const { message } = chaiHttpResponse.body;

      expect(chaiHttpResponse.status).to.be.equal(401);
      expect(message).to.be.equal("Token not found");
    });
  });
});
