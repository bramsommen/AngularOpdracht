export class BaseDataHmiMgmtExchange {
  constructor(init?: Partial<BaseDataHmiMgmtExchange>) {
    Object.assign(this, init);
  }

  id: number;
  machine: string;
  naam: string;
  omschrijving: string;
  value: string;
}
