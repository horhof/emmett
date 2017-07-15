import * as Debug from 'debug';
import * as restify from 'restify';
const corsMiddleware = require('restify-cors-middleware');

import BoxCtrl from './BoxCtrl';
import ExchangeCtrl from './ExchangeCtrl';

const log = Debug(`Emmett:Server`);

const cors = corsMiddleware({
  preflightMaxAge: 5,
  origins: ['*']
});

const server = restify.createServer({name: 'Emmett'});
server.use(restify.plugins.bodyParser());
server.use(cors.preflight);
server.use(cors.actual);
server.listen(4096, '0.0.0.0', () => log(`Server started.`));

const exchangeCtrl = new ExchangeCtrl(server);
const boxCtrl = new BoxCtrl(server, exchangeCtrl.exchange);

// Main.
exchangeCtrl.exchange.register('wallace');
exchangeCtrl.exchange.register('edward');