/**
 * Box:
 * - push: document
 * - send: document
 */

import * as Debug from 'debug';
import * as the from 'lodash';
import Document from './Document';
import { Maybe, SendMethod } from './Interfaces';

const log = Debug(`Emmett:Box`);
const error = Debug(`Emmett:Box`);

export default class Box
{
  /** The function that should be used when sending documents out of this box. */
  public readonly send: SendMethod;

  static isBox(x: any): x is Box {
    return x instanceof Box;
  }

  constructor(sendMethod: SendMethod)
  {
    this.send = sendMethod;
  }

  public pool: Document[] = [];

  public push(document: Document): void
  {
    log(`#push> Document=%O`, document);
    this.pool.push(document);
  }
}