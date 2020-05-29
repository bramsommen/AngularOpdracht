import { BaseDataEigenschap } from "./BaseDataEigenschap";
import { BaseDataProductEigenschap } from "./BaseDataProductEigenschap";
import { BaseDataMaakInstelling } from "./BaseDataMaakInstelling";

export class BaseDataCyclusMaakInstelling {
  constructor(init?: Partial<BaseDataCyclusMaakInstelling>) {
    Object.assign(this, init);
  }

  id: number;
  cyclusId: number;
  maakInstellingId: number;
  stap: number;
  childStapVolgorde: number;
  childStap: number;
  productEigenschapId: number | null;
  staticWaarde: string;
  check: boolean;

  waarde: string;

  maakInstelling: BaseDataMaakInstelling;

  productEigenschap: BaseDataEigenschap;
}
