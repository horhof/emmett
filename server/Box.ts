/**
 * Box:
 * - push: document
 * - send: document
 * - read: document ID
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

  /** I return the document with this ID. */
  public read(documentId: number): Maybe<Document>
  {
    const document: Document | void = this.pool[documentId];
    if (!document)
      return log(`#read> Document ID %d not found.`, documentId);

    log(`#read> Document=%o`, document);
    document.seen = true;
    return document;
  }
}