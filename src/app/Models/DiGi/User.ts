export class User {
  naam: string;
  paswoord: string;
  paswoord2: string;

  constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }
}
