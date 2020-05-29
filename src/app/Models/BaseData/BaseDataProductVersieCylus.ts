import { BaseDataCyclus } from "src/app/Models/BaseData/BaseDataCyclus";
import { BaseDataCyclusMaakInstelling } from "./BaseDataCyclusMaakInstelling";
export class BaseDataProductVersieCylus {
  constructor(init?: Partial<BaseDataProductVersieCylus>) {
    Object.assign(this, init);
  }

  id: number;
  productVersieId: number;

  cyclusId: number;
  cyclus: BaseDataCyclus;
}
