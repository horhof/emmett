import * as Debug from 'debug';
import * as restify from 'restify';

import BoxCtrl from './ctrl/BoxCtrl';
import ExchangeCtrl from './ctrl/ExchangeCtrl';

const log = Debug(`Emmett:Server`);

const server = restify.createServer({ name: 'Hieromail' });
server.use(restify.plugins.bodyParser());
server.listen(8080, '0.0.0.0', () => log(`Server started.`));

log(`Connecting static resources...`);
server.get(/\/*\.(html|js)/, restify.plugins.serveStatic({
  directory: 'client',
  default: 'index.html'
}));

const exchangeCtrl = new ExchangeCtrl(server);
const boxCtrl = new BoxCtrl(server, exchangeCtrl.exchange);

// Main.
exchangeCtrl.exchange.register('wallace');
exchangeCtrl.exchange.register('edward');