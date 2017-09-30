const Client = require('./client');
const Connection = require('./connection');

describe('Client', () => {
  it('getConnection', () => {
    new Client('Vasya')
      .getLogin()
      .should.equal('Vasya');
  });
});
