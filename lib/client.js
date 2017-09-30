class Client {
  constructor(name) {
    this.name = name;
  }

  getLogin() {
    return this.name;
  }

  setConnection(connection) {
    this.connection = connection;
    return this;
  }
}

module.exports = Client;
