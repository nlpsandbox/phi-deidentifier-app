export default class Config {
  constructor() {}

  getProperty(key) {
    return window._env_[key];
  }

  serverProtocol() {
    return this.getProperty('SERVER_PROTOCOL');
  }

  serverHost() {
    return this.getProperty('SERVER_HOST');
  }

  serverPort() {
    return this.getProperty('SERVER_PORT');
  }

  serverUrl() {
    const serverProtocol = this.serverProtocol();
    const serverHost = this.serverHost();
    const serverPort = this.serverPort();
    return `${serverProtocol}${serverHost}:${serverPort}`;
  }

  serverApiPath() {
    return this.getProperty('SERVER_API_PATH');
  }

  serverApiUrl() {
    const serverUrl = this.serverUrl();
    const serverApiPath = this.serverApiPath();
    return `${serverUrl}${serverApiPath}`;
  }

  version() {
    // Version of the web client
    return '1.1.0';
  }

  source() {
    // URL to source of web client
    return 'https://github.com/nlpsandbox/phi-deidentifier-app';
  }
}
