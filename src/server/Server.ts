import * as Debug from 'debug';
import * as restify from 'restify';

import BoxCtrl from './BoxCtrl';
import ExchangeCtrl from './ExchangeCtrl';

const log = Debug(`Emmett:Server`);

const server = restify.createServer({ name: 'Emmett' });
server.use(restify.plugins.bodyParser());
server.listen(4096, '0.0.0.0', () => log(`Server started.`));

const exchangeCtrl = new ExchangeCtrl(server);
const boxCtrl = new BoxCtrl(server, exchangeCtrl.exchange);

// Main.
exchangeCtrl.exchange.register('wallace');
exchangeCtrl.exchange.register('edward');