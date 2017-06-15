export default class Mail
{
  public sender: User;

  public recipients: User[];

  public subject: string;

  public body: string;

  public sent: Date | null;
}
