import { BaseDataGlobalProduct } from "./BaseDataGlobalProduct";
import { BaseDataMachineOnderdeel } from "./BaseDataMachineOnderdeel";
import { BaseDataProductVersie } from "./BaseDataProductVersie";
export class BaseDataProduct {
  constructor(init?: Partial<BaseDataProduct>) {
    Object.assign(this, init);
  }

  id: number;

  artikelCode: string;
  globalProduct: BaseDataGlobalProduct;

  omschrijving: string;

  machineOnderdeelId: number;
  machineOnderdeel: BaseDataMachineOnderdeel;

  productVersie: BaseDataProductVersie[] = [];

  // Only Angular Prop
  productieVersieAanwezig: boolean; // Er is één versie met status "in productie";
}
