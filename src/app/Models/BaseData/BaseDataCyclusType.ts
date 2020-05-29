import { BaseDataMachineOnderdeel } from "./BaseDataMachineOnderdeel";
export class BaseDataCyclusType {
  constructor(init?: Partial<BaseDataCyclusType>) {
    Object.assign(this, init);
  }

  id: number;
  naam: string;

  machineOnderdeelId: number;
  machineOnderdeel: BaseDataMachineOnderdeel;
}
