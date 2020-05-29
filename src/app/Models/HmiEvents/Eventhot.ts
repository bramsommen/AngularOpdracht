import { Eventdefinitie } from "./Eventdefinitie";
export class Eventhot {
  constructor(init?: Partial<Eventhot>) {
    Object.assign(this, init);
  }
  hotId: number;

  eventId: number;
  event: Eventdefinitie;

  status: number;
  onTime: Date;
}
