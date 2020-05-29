import { BaseDataMachineOnderdeel } from "./BaseDataMachineOnderdeel";
export class BaseDataMaakInstelling {
  constructor(init?: Partial<BaseDataMaakInstelling>) {
    Object.assign(this, init);
  }

  id: number;
  naam: string;
  omschrijving: string;
  dataType: string;

  machineOnderdeelId: number;
  machineOnderdeel: BaseDataMachineOnderdeel;
}
