import Box from './Box';
import Document from './Document';

export interface BoxMap {
  [address: string]: Box
};

export interface DocMap {
  [address: string]: Document
};