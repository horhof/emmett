import * as the from 'lodash';

import Document from './Document';
import Box from './Box';

interface BoxMap {
  [address: string]: Box
};

export default class Exchange
{
  public boxes: BoxMap = {};

  /** Register this box with the exchange under this address, if available. */
  public register(address: string, box: Box): void
  {
    console.log(`#register> Address=%s Box=%j`, address, box);

    if (this.boxes[address])
      return;

    this.boxes[address] = box;
  }

  /** Move any outboxed documents in this exchange to its recipients. */
  public transfer(): void
  {
    console.log(`#transfer>`);

    the(this.boxes)
      .filter((box: Box) => box.needDelivery())
      .tap(x => { console.log(`#transfer> These are the outboxes for delivery. Mailboxes=%j`, x) })
      .forEach((box, sender) => the(box.output)
        .tap(x => { console.log(`#transfer> This is onebox. Outbox=%j`, x) })
        .forEach(document => this.deliver(String(sender), document)));
  }

  /** Deliver this document from this sender to its recipient. */
  public deliver(sender: string, outgoingDoc: Document): void
  {
    console.log(`#deliver> Mail=%j`, outgoingDoc);

    const recipients = <BoxMap>the(this.boxes)
      .pick(outgoingDoc.to)
      .value();

    if (!recipients)
      console.error(`No address by that name. To=%s`, outgoingDoc.to);

    the(recipients)
      .forEach((recipient: Box, address: string) => {
        const incomingDoc = the(outgoingDoc).clone();
        incomingDoc.from = sender;
        recipient.accept(incomingDoc);
      });

    outgoingDoc.delivered = true;
  }
}