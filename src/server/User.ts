export default class User
{
  /** For logging in. */
  public name: string;

  /** For logging in. */
  public password: string;

  /** A list of secret keys for each mailbox on the exchange. */
  public keys: { [mailbox: string]: string };
}