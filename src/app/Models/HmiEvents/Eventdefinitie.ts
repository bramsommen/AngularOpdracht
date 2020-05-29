export class Eventdefinitie {
  constructor(init?: Partial<Eventdefinitie>) {
    Object.assign(this, init);
  }

  eventId: number;
  opcTag: string;
  plcAdress: string;
  appName: string;
  type: string;
  omschrijving: string;
  info: string;
  logging: boolean;
}
