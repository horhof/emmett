import * as the from 'lodash';
import Document from './Document';
import * as I from './Interfaces';

type MaybeError = Error | void;

/**
 * I contain a pool of documents. I can accept incoming documents to be saved
 * within the pool and outgoing documents to be transferred to the exchange. I
 * can expose my documents as a tree.
 */
export default class Box
{
  /** The list of my documents. */
  public pool: Document[] = [];

  /** A tree indexing my documents with addresses. */
  public map: I.DocMap = {};

  /** I take this incoming document into the box, optionally addressing it by this name. */
  public accept(document: Document, name?: string): MaybeError
  {
    this.pool.push(document);
    document.delivered = true;

    if (name)
      this.map[name] = document;
  }

  /** I accept this outgoing document for delivery from this box. */
  public enqueue(document: Document): MaybeError
  {
    this.pool.push(document);
  }

  /** I return the list of documents waiting for delivery. */
  public get outbox(): Document[]
  {
    return the(this.pool)
      .filter((document: Document) => !document.delivered)
      .value();
  }

  /** I return whether or not I have documents waiting for delivery. */
  public needDelivery(): boolean
  {
    return the(this.outbox)
      .thru(the.negate(the.isEmpty))
      .value();
  }
}