const Connection = require('./connection');

const PRIV = Symbol();


class Server {
  constructor() {
    this[PRIV] = {
      connections: {},
      subscriptions: {},
    }
  }

  connect(login) {
    if (!login)
      throw new Error("No login");

    const { connections, subscriptions } = this[PRIV];

    if (connections[login])
      throw new Error("Login occupied");

    connections[login] = new Connection();

    connections[login].on('subscribe.users-status', ({ users }) => {
      subscriptions[login] = users;
    });
    connections[login].on('disconnect', () => {
      delete connections[login];

      Object.keys(subscriptions)
        .forEach(client => {
          if (subscriptions[client].includes(login)) {
            connections[client].emit('user.status', {
              user: login,
              status: 'offline',
            });
          }
        });
    });

    Object.keys(subscriptions)
      .forEach(client => {
        if (subscriptions[client].includes(login)) {
          connections[client].emit('user.status', {
            user: login,
            status: 'online',
          });
        }
      });

    return connections[login];
  }
}

module.exports = Server;
