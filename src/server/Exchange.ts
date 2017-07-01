import * as the from 'lodash';

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
    the(this.mailboxes)
      .filter((mailbox: Mailbox) => mailbox.needDelivery())
      .tap(x => {
        console.log(`#transfer> These are the outboxes for delivery. Mailboxes=%j`, x);
      })
      .forEach(mailbox => the(mailbox.outbox)
        .tap(x => {
          console.log(`#transfer> This is onebox. Outbox=%j`, x);
        })
        .forEach(mail => this.deliver(mail)));
  }

  /** Deliver this mail to its recipient addresses on this exchange. */
  public deliver(outgoing: Mail): void
  {
    console.log(`#deliver> Mail=%j`, outgoing);
    const recipients = the(this.mailboxes).pick(outgoing.to).value();

    if (!recipients)
      console.error(`No address by that name. Mail.To=%s`, outgoing.to);

    const incoming = the.clone(outgoing);
    the(recipients)
      .forEach((recipient: Mailbox, address: string) => {
        recipient.inbox.push(incoming);
      });
    outgoing.delivered = true;
  }
}