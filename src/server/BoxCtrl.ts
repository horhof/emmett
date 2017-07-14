import * as the from 'lodash';
import * as Debug from 'debug';
import * as restify from 'restify';

const log = Debug(`Emmett:Ctrl:Box`);

import * as Api from './Api';
import Box from './Box';
import Document from './Document';
import Exchange from './Exchange';

export default class BoxCtrl
{
  private exchange: Exchange;

  constructor(server: restify.Server, exchange: Exchange)
  {
    this.exchange = exchange;
    this.setupRoutes(server);
  }

  private setupRoutes(server: restify.Server): void
  {
    server.get('/boxes/:address', this.getBox.bind(this));
    server.post('/boxes/:address/documents', this.postDocument.bind(this));
  }

  private getBox(req: restify.Request, res: restify.Response): void
  {
    const address = the(req).get('params.address', '');
    log(`GET /boxes/%s`, address);

    const box = this.exchange.boxes[address];

    if (!box)
      return res.json(400, `Nothing at that address.`);

    res.json(box);
  }

  private postDocument(req: restify.Request, res: restify.Response): void
  {
    // Get sender's address from the URI.
    const sender = the(req).get('params.address', '');
    log(`POST /boxes/%s/documents`, sender);

    // Create the document from the request body.
    const body = the(req).get('body');
    const document = new Document(body);
    log(`Created Document=%O`, document)

    if (!document.valid)
      return res.json(400, {
        message: `Document was invalid.`,
        document
      });
    
  //const recipients = this.exchange.validateAddresses(document.to);
//
  //if (the.keys(recipients).length <= 0)
  //  return res.json(400, {
  //    message: `Invalid recipient list.`,
  //    recipients
  //  });

    const box = this.exchange.lookup(sender);

    if (!box)
      return res.json(400, { message: `No box with that address.` });

    const err = box.send(document);
    log(`Err=%O`, err);

    if (err)
      return res.json(400, { message: err.message });

    return res.json(`Sent message to ${sender}.`);
  }
}