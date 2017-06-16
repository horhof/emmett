import Mail from './Mail';
import User from './User';

export default class Box
{
  /** Whether or not the Box is restricted just to the owner. */

  public private: boolean;
  /** The User authorized to make changes to this Box. */
  public owner: User;

  public password: string;

  /** List of Mails in this box. */
  public list: Mail[];
}
