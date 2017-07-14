import * as the from 'lodash';
import * as Debug from 'debug';
import * as restify from 'restify';

const log = Debug(`Emmett:Ctrl:Exchange`);

import Box from './Box';
import Exchange from './Exchange';

export default class ExchangeCtrl
{
  public exchange: Exchange;

  constructor(server: restify.Server)
  {
    this.exchange = new Exchange('local');
    this.setupRoutes(server);
  }

  private setupRoutes(server: restify.Server): void
  {
    server.get('/boxes', this.getBoxListing.bind(this));
    server.post('/boxes/:address', this.postBox.bind(this));
  }

  private getBoxListing(req: restify.Request, res: restify.Response): void
  {
    log(`GET /boxes`);

    const addresses = the(this.exchange.boxes)
      .map((box: Box, address: string) => ({address, size: box.pool.length}));

    res.json(addresses);
  }

  private postBox(req: restify.Request, res: restify.Response): void
  {
    const address = the(req).get('params.address', '');
    log(`POST /boxes/%s`, address);

    if (!address)
      return res.json(400, `No address given.`);

    this.exchange.register(address);
    res.json(`Created box at address ${address}.`);
  }
}