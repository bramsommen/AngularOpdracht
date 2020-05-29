import { BaseDataGlobalProductEigenschap } from "./BaseDataGlobalProductEigenschap";
export class BaseDataGlobalProduct {
  constructor(init?: Partial<BaseDataGlobalProduct>) {
    Object.assign(this, init);
  }

  artikelCode: string;

  naam: string;

  omschrijving: string;

  eigenschappen: BaseDataGlobalProductEigenschap[] = [];
}
