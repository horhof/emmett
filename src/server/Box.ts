import * as the from 'lodash';
import Document from './Document';

type MaybeError = Error | void;

export default class Box
{
  public pool: Document[] = [];

  public accept(document: Document): MaybeError
  {
    document.delivered = true;
    this.pool.push(document);
  }

  public enqueue(document: Document): MaybeError
  {
    this.pool.push(document);
  }

  public get output(): Document[]
  {
    return the(this.pool)
      .filter((document: Document) => !document.delivered)
      .value();
  }

  public needDelivery(): boolean
  {
    return the(this.output)
      .thru(the.negate(the.isEmpty))
      .value();
  }
}