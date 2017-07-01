import * as Debug from 'debug';
import * as the from 'lodash';
import Box from './Box';
import Document from './Document';
import * as I from './Interfaces';

const log = Debug(`Exchange`);
const error = Debug(`Exchange`);

/**
 * I have a list of boxes that are indexed under unique addresses. I take care
 * of delivering outgoing documents from one box to another.
 */
export default class Exchange
{
  public boxes: I.BoxMap = {};

  /** I register this box within the exchange under this address, if available. */
  public register(address: string, box: Box): void
  {
    log(`#register> Address=%s Box=%o`, address, box);

    if (this.boxes[address])
      return error(`Address already taken. Address=%s`, address);

    this.boxes[address] = box;
  }

  /** I copy any outboxed documents awaiting delivery to their recipients. */
  public transfer(): void
  {
    log(`#transfer>`);

    the(this.boxes)
      .pickBy((box: Box) => box.needDelivery())
      .tap((boxes: I.BoxMap) => {
        log(`#transfer> Boxes needing delivery. Boxes=%O`, the.keys(boxes));
      })
      .forEach((box: Box, sender: string) => the(box.outbox)
        .tap(docs => { log(`#transfer> Processing box for %s. Docs=%o`, sender, docs) })
        .forEach(document => this.deliver(sender, document)));
  }

  /** I deliver this document from this sender to its recipients. */
  private deliver(sender: string, outgoingDoc: Document): void
  {
    log(`#deliver> Sender=%s Doc=%o`, sender, outgoingDoc);

    const recipients = <I.BoxMap>the(this.boxes)
      .pick(outgoingDoc.to)
      .value();

    if (!recipients)
      return error(`No address by that name. To=%s`, outgoingDoc.to);

    the(recipients)
      .forEach((recipient: Box, address: string) => {
        const incomingDoc = the(outgoingDoc).clone();
        incomingDoc.from = sender;
        recipient.accept(incomingDoc);
      });
  }
}