export class ClientNodes {
  constructor(init?: Partial<ClientNodes>) {
    Object.assign(this, init);
  }

  client: string;
  methode: string;
  opctags: string[] = [];
}
