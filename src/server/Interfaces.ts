import Box from './Box';
import Document from './Document';

export type Maybe<T> = T | void;

export type Either<T> = T | Error;

export type SendMethod = { (document: Document): Maybe<Error> };

export interface BoxMap {
  [address: string]: Box
};