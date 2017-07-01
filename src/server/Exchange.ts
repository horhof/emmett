import * as the from 'lodash';
import Box from './Box';
import Document from './Document';
import * as I from './Interfaces';

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
    console.log(`#register> Address=%s Box=%j`, address, box);

    if (this.boxes[address])
      return console.error(`Address already taken. Address=%s`, address);

    this.boxes[address] = box;
  }

  /** I copy any outboxed documents awaiting delivery to their recipients. */
  public transfer(): void
  {
    console.log(`#transfer>`);

    the(this.boxes)
      .filter((box: Box) => box.needDelivery())
      .tap(x => { console.log(`#transfer> These are the outboxes for delivery. Mailboxes=%j`, x) })
      .forEach((box, sender) => the(box.outbox)
        .tap(x => { console.log(`#transfer> This is onebox. Outbox=%j`, x) })
        .forEach(document => this.deliver(String(sender), document)));
  }

  /** I deliver this document from this sender to its recipients. */
  private deliver(sender: string, outgoingDoc: Document): void
  {
    console.log(`#deliver> Sender=%s Doc=%j`, sender, outgoingDoc);

    const recipients = <I.BoxMap>the(this.boxes)
      .pick(outgoingDoc.to)
      .value();

    if (!recipients)
      return console.error(`No address by that name. To=%s`, outgoingDoc.to);

    the(recipients)
      .forEach((recipient: Box, address: string) => {
        const incomingDoc = the(outgoingDoc).clone();
        incomingDoc.from = sender;
        recipient.accept(incomingDoc);
      });
  }
}