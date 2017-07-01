import Box from './Box';

/**
 * I am a block of text information sent from a box into a box. I can be the
 * child of another document and descent ultimately from a distant root
 * document.
 */
export default class Document
{
  /** The root-level document that I am a child of. */
  public root: Document | null;

  /** My immediate parent document. */
  public parent: Document | null;

  /** The address of the box I was sent from. */
  public from: string;

  /** The destination box(es) I was sent to. */
  public to: string[] = [];

  public body: string;

  public timestamp: Date;

  /** If I am waiting, undelivered output or have reached my destination. */
  public delivered: boolean = false;
}