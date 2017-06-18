import Mailbox from './Mailbox';
import User from './User';

/** The exchange indexes mailboxes and delivers mails between them. */
export default class Exchange
{
  /** A mapping of unique addresses to Mailboxes. */
  public mailboxes: { [address: string]: Mailbox }[];

  /** Add a new mailbox under the given name.*/
  public add(name: string, mailbox: Mailbox): void
  {
    this.mailboxes[name] = mailbox;
  }

  public deliver(): void
  {
    // for each mailbox in this.mailboxes with something in its outbox, move the
    // message into destination inbox.
  }
}