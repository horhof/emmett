import Mailbox from "./Mailbox";

export default class Mail
{
  public from: Mailbox;

  public to: string;

  /** The time the Mail should be sent. */
  public timestamp: Date;

  public body: string;

  public sent: Date | null;

  public read: boolean = false;

  /** Whether this Mail is in its final Mailbox or is up for delivery. */
  public delivered: boolean = false;
}