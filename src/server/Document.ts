import Box from "./Box";

export default class Document
{
  public from: string;

  public to: string[];

  /** The time the Mail should be sent. */
  public timestamp: Date;

  public body: string;

  public sent: Date | null;

  /** Whether this Mail is in its final Mailbox or is up for delivery. */
  public delivered: boolean = false;
}