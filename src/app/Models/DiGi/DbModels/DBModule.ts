export class DBModule {
  // PROPERTIES
  id: number;

  naam: string;
  omschrijving: string;

  angularComponent: string;
  dedicatedPc: string;

  constructor(init?: Partial<DBModule>) {
    Object.assign(this, init);
  }
}
