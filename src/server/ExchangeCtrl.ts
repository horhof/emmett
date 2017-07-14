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

    server.get('/boxes', this.listBoxes.bind(this));
    server.post('/boxes/:address', this.createBox.bind(this));
  }

  private listBoxes(req: restify.Request, res: restify.Response): void
  {
    log(`GET /boxes`);

    const addresses = the(this.exchange.boxes)
      .map((box: Box, address: string) => ({address, size: box.pool.length}));

    res.json(addresses);
  }

  private createBox(req: restify.Request, res: restify.Response): void
  {
    const address = the(req).get('params.address', '');
    log(`POST /boxes/%s`, address);

    if (!address)
      return res.json(400, `No address given.`);

    const error = this.exchange.register(address);

    if (error)
      return res.json(400, {
        message: `Couldn't register address.`,
        error: error.message
      });

    res.json({message: `Created box at address ${address}.`});
  }
}