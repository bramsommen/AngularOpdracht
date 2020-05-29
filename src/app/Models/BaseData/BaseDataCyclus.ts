import { BaseDataMachineOnderdeel } from "./BaseDataMachineOnderdeel";
import { BaseDataCyclusMaakInstelling } from "./BaseDataCyclusMaakInstelling";
import { BaseDataCyclusType } from "./BaseDataCyclusType";
export class BaseDataCyclus {
  constructor(init?: Partial<BaseDataCyclus>) {
    Object.assign(this, init);
  }

  id: number;
  naam: string;

  cyclusTypeId: number;
  cyclusType: BaseDataCyclusType;

  machineOnderdeelId: number;
  machineOnderdeel: BaseDataMachineOnderdeel;

  cyclusMaakInstelling: BaseDataCyclusMaakInstelling[] = [];
}
