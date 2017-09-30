const Server = require('./server');
const Connection = require('./connection');
const {spy} = require('sinon');

describe('Server', () => {
  it('Connection successful', () => {
    new Server()
      .connect('login')
      .should.be.instanceOf(Connection);
  });
  it('Connection fail no login', () => {
    try {
      new Server().connect()
    } catch (e) {
      return e.message.should.equal('No login')
    }
    throw new Error('Exception expected')
  });
  it('Connection fail Login occupied', () => {
    try {
      const server = new Server();

      server.connect('login');
      server.connect('login')
    } catch (e) {
      return e.message.should.equal('Login occupied')
    }
    throw new Error('Exception expected')
  });

  it('subscribe.users-connect user.status', () => {
    // given
    const server = new Server();
    const cb = spy();
    const subscribe_msg = {
      users: ['client B'],
    };

    const connection = server.connect('client A');
    connection.on('user.status', cb);

    // when
    connection.emit('subscribe.users-status', subscribe_msg);
    server.connect('client B').emit('disconnect');
    server.connect('client C');

    // then
    cb.firstCall
      .calledWith({
      user: 'client B',
      status: 'online',
    }).should.equal(true, 'should get user online message');
    cb.secondCall
      .calledWith({
        user: 'client B',
        status: 'offline',
      }).should.equal(true, 'should get user online message');
    cb.calledTwice.should.equal(true, 'should be called twice only');
  });
  it('subscribe.users-connect user.status when reconnect', () => {
    // given
    const server = new Server();
    const cb = spy();
    const subscribe_msg = {
      users: ['client B'],
    };

    const connection = server.connect('client A');
    connection.on('user.status', cb);

    // when
    connection.emit('subscribe.users-status', subscribe_msg);
    server.connect('client B').emit('disconnect');
    server.connect('client C');
    server.connect('client B');

    // then
    cb.firstCall
      .calledWith({
        user: 'client B',
        status: 'online',
      }).should.equal(true, 'should get user online message');
    cb.secondCall
      .calledWith({
        user: 'client B',
        status: 'offline',
      }).should.equal(true, 'should get user online message');
    cb.thirdCall
      .calledWith({
        user: 'client B',
        status: 'online',
      }).should.equal(true, 'should get user online message');
    cb.callCount.should.equal(3, 'should be called 3 only');
  });
});
