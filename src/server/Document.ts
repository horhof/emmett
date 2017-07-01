import Box from './Box';

export default class Document
{
  public from: string;

  public to: string[] = [];

  public timestamp: Date;

  public body: string;

  public delivered: boolean = false;
}