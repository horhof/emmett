import Box from "./Box";

export default class Document
{
  public from: string;

  public to: string[] = [];

  public timestamp: Date;

  public body: string;

  /** Whether this document is in its final box or is up for delivery. */
  public delivered: boolean = false;
}