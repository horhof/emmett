import Mailbox from "./Mailbox";
import User from './User';

export default class Mail
{
  public from: Mailbox;

  public to: Mailbox[];

  /** If an incoming message is just to be viewed, it's accessed via an address. */
  public address: string;

  /** The time the Mail should be sent. */
  public timestamp: Date;

  public subject: string;

  public body: string;

  public sent: Date | null;

  public read: boolean;

  /** Whether this Mail is in its final Mailbox or is up for delivery. */
  public delivered: boolean;
}
