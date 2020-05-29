export class BaseDataMachineOnderdeel {
  constructor(init?: Partial<BaseDataMachineOnderdeel>) {
    Object.assign(this, init);
  }

  id: number;
  machine: string;
  naam: string;
  omschrijving: string;
}
