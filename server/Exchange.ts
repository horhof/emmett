/**
 * Exchange:
 * - name
 * - boxes
 * - register: address
 * - lookup address: address
 * - lookup addresses: [address]
 */

import * as Debug from 'debug';
import * as the from 'lodash';
import Box from './Box';
import Document from './Document';
import { Maybe } from './Interfaces';

interface BoxMap {
  [address: string]: Box
};

const log = Debug(`Emmett:Exchange`);
const error = Debug(`Emmett:Exchange`);

export default class Exchange
{
  /** The exchange's identifier. Box addresses will be box-address@exchange-name. */
  public name: string;

  public boxes: BoxMap = {};

  constructor(name: string)
  {
    this.name = name;
  }

  /**
   * I create a new box at the address if it's free.
   * 
   * @return Error if the address is taken.
   */
  public register(address: string): Maybe<Error>
  {
    if (this.lookupAddress(address))
      return new Error(`Address '${address}' has already been registered.`);

    log(`#register> Address '%s' is available.`, address);

    const send = (document: Document) => this.accept(address, document);
    this.boxes[address] = new Box(send);
    log(`#register> Box registered.`);
  }

  /** I return the box for the address if it's registered. */
  public lookupAddress(address: string): Maybe<Box>
  {
    return this.boxes[address];
  }

  /**
   * I return a box map for any addresses which were valid.
   * 
   * When no addresses are valid, an empty map is returned.
   * 
   * @param addresses E.g. `["edward", "wallace"]`.
   */
  public lookupAddresses(addresses: string[]): BoxMap
  {
    log(`#validateAddresses> List=%o`, addresses);
    return <BoxMap>the(this.boxes).pick(addresses).value();
  }

  /**
   * I send the document to its recipients (if they exist) from the sender.
   * 
   * This method is wired internally to each of the boxes that are created so
   * that they will always send with the addresses that the exchange gave them.
   * 
   * @return Error if recipient list is empty or invalid.
   */
  private accept(sender: string, document: Document): Maybe<Error>
  {
    document.from = sender;
    log(`#accept> Document=%O`, document);

    if (!document.to)
      return new Error(`No recipients listed.`);

    const recipients = this.lookupAddresses(document.to);

    if (the.keys(recipients).length < 1)
      return new Error(`No valid recipients.`);

    log(`#accept> The recipient list is valid=%O`, recipients);

    the(recipients)
      .forEach((recipient: Box, address: string) => {
        const copy = the(document).clone();
        copy.from = sender;
        copy.to = [address];
        copy.time = new Date();
        recipient.push(copy);
      });
  }
}