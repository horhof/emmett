import * as lo from 'lodash';

import Mail from './Mail';
import Mailbox from './Mailbox';

export default class Exchange
{
  public mailboxes: { [address: string]: Mailbox } = {};

  /** Register a mailbox under the given address. */
  public register(address: string, mailbox: Mailbox): void
  {
    console.log(`#register> Address=%s Mailbox=%j`, address, mailbox);
    if (this.mailboxes[address])
      return;

    this.mailboxes[address] = mailbox;
  }

  /** Move any outboxed mail to its destination. */
  public transfer(): void
  {
    console.log(`#transfer>`);
    lo(this.mailboxes)
      .filter((mailbox: Mailbox) => mailbox.needDelivery())
      .tap(x => {
        console.log(`#transfer> These are the outboxes for delivery. Mailboxes=%j`, x);
      })
      .forEach(mailbox => lo(mailbox.outbox)
        .tap(x => {
          console.log(`#transfer> This is onebox. Outbox=%j`, x);
        })
        .forEach(mail => this.deliver(mail)));
  }

  /** Deliver this mail to this address on the exchange. */
  public deliver(outgoing: Mail): void
  {
    console.log(`#deliver> Mail=%j`, outgoing);
    const recipient = this.mailboxes[outgoing.to];

    if (!recipient)
      console.error(`No address by that name. Mail.To=%s`, outgoing.to);

    const incoming = lo.clone(outgoing);
    recipient.inbox.push(incoming);
    outgoing.delivered = true;
  }
}