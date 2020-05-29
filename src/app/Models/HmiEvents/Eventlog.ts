import { Eventdefinitie } from "./Eventdefinitie";
export class Eventlog {
  constructor(init?: Partial<Eventlog>) {
    Object.assign(this, init);
  }
  logId: number;

  eventId: number;
  event: Eventdefinitie;

  onTime: Date;
  offTime: Date;
}
