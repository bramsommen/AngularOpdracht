import { BaseDataProductVersieCylus } from "./BaseDataProductVersieCylus";
import { BaseDataProductEigenschap } from "./BaseDataProductEigenschap";

export class BaseDataProductVersie {
  constructor(init?: Partial<BaseDataProductVersie>) {
    Object.assign(this, init);
  }

  id: number;
  productId: number;
  foto: string;
  cad3d: string;
  cad2d: string;
  pdf: string;
  naam: string;
  versie: number;
  status: number;

  productVersieCyclus: BaseDataProductVersieCylus[] = [];
  productEigenschap: BaseDataProductEigenschap[] = [];
}
