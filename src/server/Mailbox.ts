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

  /** The mailbox can be read only by providing this key, if present. */
  private readKey: string | void;

  private outbox: Mail[];

  /** The outbox can be written to only by providing this key. */
  private writeKey: string;

  constructor(keys: string[])
  {
    const [readKey, writeKey] = keys;
    this.readKey = readKey;
    this.writeKey = writeKey;

    this.inbox = [];
    this.outbox = [];
  }

  /** Accept an incoming mail from another mailbox. */
  public accept(mail: Mail): MaybeError
  {
    this.inbox.push(mail);
  }

  /** Accept a mail for delivery if the key matches. */
  public enqueue(writeKey: string, mail: Mail): MaybeError
  {
    if (writeKey !== this.writeKey)
      return new Error(`Write key did not match.`);

    this.outbox.push()
  }
}