import User from './User';

export default class Mail
{
  public from: User;

  public to: User[];

  /** The time the Mail should be sent. */
  public timestamp: Date;

  public subject: string;

  public body: string;

  public sent: Date | null;

  public read: boolean;
}
