import { BaseDataGlobalProduct } from "./BaseDataGlobalProduct";
export class BaseDataGlobalProductEigenschap {
  constructor(init?: Partial<BaseDataGlobalProductEigenschap>) {
    Object.assign(this, init);
  }

  id: number;

  artikelCode: string;

  sort: number;

  naam: string;

  omschrijving: string;

  dataType: string;

  waarde: string;

  globalProduct: BaseDataGlobalProduct;
}
