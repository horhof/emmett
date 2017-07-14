/**
 * Document:
 * - from
 * - to
 * - body
 * - timestamp
 */

import Box from './Box';

/**
 * I am a block of text information sent from a box into a box.
 */
export default class Document
{
  /** The address of the box I was sent from. */
  public from: string;

  /** The addresses of the boxes I was sent to. */
  public to: string[] = [];

  /** The text content of the document. */
  public readonly body: string;

  /** The time that the exchange delivered this copy of a document. */
  public timestamp: Date;

  public readonly valid: boolean = true;

  constructor(raw: { [index: string]: any } = {})
  {
    this.to = raw['to'];
    this.from = raw['from'];
    this.body = raw['body'];
  }
}