import { BaseDataEigenschap } from "./BaseDataEigenschap";
export class BaseDataProductEigenschap {
  constructor(init?: Partial<BaseDataProductEigenschap>) {
    Object.assign(this, init);
  }

  id: number;
  productVersieId: number;
  eigenschapId: number;
  waarde: string;
  check: boolean;

  eigenschap: BaseDataEigenschap;
}
