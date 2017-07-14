/**
 * Box:
 * - push: document
 * - send: document
 */

import * as Debug from 'debug';
import * as the from 'lodash';
import Document from './Document';
import { Maybe } from './Interfaces';

type SendMethod = { (document: Document): Maybe<Error> };

const log = Debug(`Emmett:Box`);

export default class Box
{
  /** The function used when sending documents out of this box. */
  public readonly send: SendMethod;

  static isBox(x: any): x is Box { return x instanceof Box; }

  constructor(sendMethod: SendMethod)
  {
    this.send = sendMethod;
  }

  /** My list of documents. */
  public pool: Document[] = [];

  /** I add a new document to my pool. */
  public push(document: Document): void
  {
    log(`#push> Document=%o`, document);
    this.pool.push(document);
  }

  public read(documentId: number): Maybe<Document>
  {
    const document = this.pool[documentId];
    document.seen = true;
    return document;
  }
}