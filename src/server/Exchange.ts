/**
 * Exchange:
 * - boxes
 * - register: address
 */

import * as Debug from 'debug';
import * as the from 'lodash';
import Box from './Box';
import Document from './Document';
import { BoxMap, Either, Maybe } from './Interfaces';

const log = Debug(`Emmett:Exchange`);
const error = Debug(`Emmett:Exchange`);

export default class Exchange
{
  public name: string;

  public boxes: BoxMap = {};

  constructor(name: string)
  {
    this.name = name;
  }

  /** I create a new box at the address if it's free and return the new box, else an error. */
  public register(address: string): Either<Box>
  {
    log(`#register> Address=%s`, address);

    if (this.boxes[address])
      return new Error(`Address already taken. Address=${address}`);

    const send = (document: Document) => this.accept(address, document);
    const box = new Box(send);

    this.boxes[address] = box;

    return box;
  }

  public lookup(address: string): Maybe<Box>
  {
    return this.boxes[address];
  }

  /** I return a map of the addresses which are valid. */
  public validateAddresses(addresses: string[]): BoxMap
  {
    log(`#validateAddresses> List=%o`, addresses);

    return <BoxMap>the(this.boxes)
      .tap(x => {
        log(`#validateAddresses> 1=%j`, x);
      })
      .pick(addresses)
      .tap(x => {
        log(`#validateAddresses> 2=%o`, x);
      })
      .value();
  }

  /** I send the document to its recipients (if they exist) from the sender. */
  private accept(sender: string, document: Document): Maybe<Error>
  {
    document.from = sender;
    log(`#accept> Document=%O`, document);

    if (!document.to)
      return new Error(`No recipients listed.`);

    const recipients = this.validateAddresses(document.to);

    if (the.keys(recipients).length < 1)
      return new Error(`No valid recipients.`);

    log(`#accept> The recipient list is valid=%O`, recipients);

    the(recipients)
      .forEach((recipient: Box, address: string) => {
        const copy = the(document).clone();
        copy.from = sender;
        copy.timestamp = new Date();
        recipient.push(copy);
      });
  }
}