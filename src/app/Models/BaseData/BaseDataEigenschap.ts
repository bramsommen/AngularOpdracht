import { BaseDataMachineOnderdeel } from "./BaseDataMachineOnderdeel";
import { BaseDataCyclusMaakInstelling } from "./BaseDataCyclusMaakInstelling";
export class BaseDataEigenschap {
  constructor(init?: Partial<BaseDataEigenschap>) {
    Object.assign(this, init);
  }

  id: number;
  sort: number;
  naam: string;
  omschrijving: string;
  dataType: string;
  globalEigenschap: string;

  machineOnderdeelId: number;
  machineOnderdeel: BaseDataMachineOnderdeel;
}
