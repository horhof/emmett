import * as the from 'lodash';
import Document from './Document';

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
export default class Box
{
  public input: Document[] = [];

  public output: Document[] = [];

  public pool: Document[] = [];

  /** Accept an incoming mail from another mailbox. */
  public accept(document: Document): MaybeError
  {
    this.input.push(document);
  }

  /** Accept a mail for delivery if the key matches. */
  public enqueue(document: Document): MaybeError
  {
    this.output.push(document);
  }

  public needDelivery(): boolean
  {
    return the(this.output)
      .chain()
      .filter((document: Document) => !document.delivered)
      .thru(the.negate(the.isEmpty))
      .value();
  }

  public haveUnread(): boolean
  {
    return this.input.length > 0;
  }
}