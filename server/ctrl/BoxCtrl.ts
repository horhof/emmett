import * as the from 'lodash';
import * as Debug from 'debug';
import * as restify from 'restify';

const log = Debug(`Emmett:Ctrl:Box`);

import Box from '../Box';
import Document from '../Document';
import Exchange from '../Exchange';

export default class BoxCtrl
{
  private exchange: Exchange;

  constructor(server: restify.Server, exchange: Exchange)
  {
    this.exchange = exchange;

    server.get('/boxes/:address', this.readBox.bind(this));
    server.get('/boxes/:address/documents', this.listDocuments.bind(this));
    server.post('/boxes/:address/documents', this.createDocument.bind(this));
    server.get('/boxes/:address/documents/:id', this.readDocument.bind(this));
  }

  private readBox(req: restify.Request, res: restify.Response): void
  {
    const address = the(req).get('params.address', '');
    log(`GET /boxes/%s`, address);

    const box = this.exchange.lookupAddress(address);

    if (!box)
      return this.handleNonExistantAddress(address, res);

    res.json(box);
  }

  private listDocuments(req: restify.Request, res: restify.Response): void
  {
    const address = the(req).get('params.address', '');
    log(`GET /boxes/%s/documents`, address);

    const box = this.exchange.lookupAddress(address);

    if (!box)
      return this.handleNonExistantAddress(address, res);

    const documents = the(box.pool)
      .map((document, id) => the(document)
        .pick(['id', 'time', 'from', 'seen'])
        .assign({id}));

    res.json(documents);
  }

  private createDocument(req: restify.Request, res: restify.Response): void
  {
    // Get sender's address from the URI.
    const sender: string = the(req).get('params.address', '');
    log(`POST /boxes/%s/documents`, sender);
    
    // Get control of the sender's mailbox.
    const box = this.exchange.lookupAddress(sender);

    if (!box)
      return this.handleNonExistantAddress(sender, res);

    log(`Sender box is valid.`);

    // Create the document from the request body.
    const body: any = the(req).get('body');
    const document = new Document(body);

    if (!document.valid)
      return res.json(400, {message: `Document was invalid.`, document});

    log(`Document is valid.`);

    // Send the document from the sender's mailbox.
    const error = box.send(document);

    if (error)
      return res.json(400, {message: `Failed to send document.`, error});

    log(`Document sent.`);

    const recipients = the(document.to).map(x => `'${x}'`).join(', ');
    return res.json({message: `Sent message to ${recipients}.`});
  }

  private readDocument(req: restify.Request, res: restify.Response): void
  {
    // Get the owner's box address and the document ID.
    const owner: string = the(req).get('params.address', '');
    const documentId = Number(the(req).get('params.id'));
    log(`GET /boxes/%s/documents/%d`, owner, documentId);

    // See if that box exists.
    const box = this.exchange.lookupAddress(owner);

    if (!box)
      return this.handleNonExistantAddress(owner, res);

    // See if that document exists in the box.
    const document = box.read(documentId);

    if (!document)
      return res.json(400, {message: `Non-existent document.`, documentId})

    res.send(document);
  }

  private handleNonExistantAddress(address: string, res: restify.Response): void
  {
    res.json(400, {
      message: `No box with that address.`,
      address,
      exchange: this.exchange
    });
  }
}