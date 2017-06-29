import Mail from './Mail';
import User from './User';

type MaybeError = Error | void;

/**
 * Mailboxes store messages both incoming and outgoing. The exchange eventually
 * picks up and delivers the outgoing mails.
 * 
 * The reading and writing of data are controlled via keys. Incoming messages
 * are always accepted for writing but can be read only with a read key.
 * 
 * Outgoing messages can be read with the read key as well, but are accepted for
 * writing only with a write key.
 */
export default class Mailbox
{
  private inbox: Mail[];

  private outbox: Mail[];

  constructor()
  {
    this.inbox = [];
    this.outbox = [];
  }

  /** Accept an incoming mail from another mailbox. */
  public accept(mail: Mail): MaybeError
  {
    this.inbox.push(mail);
  }

  /** Accept a mail for delivery if the key matches. */
  public enqueue(mail: Mail): MaybeError
  {
    this.outbox.push(mail);
  }
}