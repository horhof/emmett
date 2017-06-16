import Mailbox from './Mailbox';

/**
 * The Exchange indexes all the Boxes.
 */
export default class Exchange
{
  /** A mapping of unique addresses to Mailboxes. */
  public boxes: { [address: string]: Mailbox }[];

  /** Publically-listed mailboxes. */
  public public: Mailbox[];

  public create(name: string): Mailbox
  {
    this.boxes[name] = new Mailbox();
    return this.boxes[name];
  }
}