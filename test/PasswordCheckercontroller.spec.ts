import supertest from 'supertest';
import app from '../src/api/bootstrap/app';
import { StatusCodes } from 'http-status-codes';

const request = supertest.agent(app);

describe('password controller tests', () => {
  it('valid password returns no-content response', (done) => {
    request
      .post('/passwords')
      .send({ password: 'password1Q@' })
      .set('Accept', 'application/json')
      .expect(StatusCodes.NO_CONTENT)
      .end(function (error, response) {
        if (error) return done(error);
        return done();
      });
  });

  it('invalid password returns json object with error key', (done) => {
    request
      .post('/passwords')
      .send({ password: 'invalidpassword' })
      .set('Accept', 'application/json')
      .expect(StatusCodes.BAD_REQUEST)
      .then((response) => {
        if (response.text) {
          expect(JSON.parse(response.text).errors.length).toBeGreaterThan(0);
        }
        done();
      });
  });
});
