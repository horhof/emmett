const log = console.debug.bind(console);

export class Client
{
  public boxes: any[];

  public user: string;

  public to: string;

  public documents: any[];

  public document: any;

  public body: string = '';

  public response: string = '';

  private rest: Restangular.IService;

  static $inject = ['Restangular'];

  constructor(Restangular: Restangular.IService)
  {
    this.rest = Restangular;
    this.getBoxes();
  }

  public setUser(address: string): void
  {
    this.user = address;
    this.getDocuments();
  }

  public getBoxes(): void
  {
    log(`#getBoxes>`);
    this.boxes = this.rest.all('boxes').getList().$object;
  }

  public getDocuments(): void
  {
    log(`#getDocuments>`);
    this.documents = this.rest
      .one('boxes', this.user)
      .all('documents')
      .getList().$object;
  }

  public getDocument(id: number): void
  {
    log(`#getDocument> ID=${id}`);
    this.document = this.rest
      .one('boxes', this.user)
      .one('documents', id)
      .get().$object;
    this.body = this.document.body;
  }

  public send(): void
  {
    log(`#send> User=${this.user} Body=${this.body}`);
    this.rest.one('boxes', this.user)
      .all('documents')
      .post({
        to: this.to.split(','),
        body: this.body
      })
      .then(res => this.response = res.message);
  }
}