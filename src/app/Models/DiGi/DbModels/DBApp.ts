import { DBAppModules } from "./DbAppModules";
export class DBApp {
  id: number;
  naam: string;
  omschrijving: string;
  poolnaam: string;
  machine: string;
  type: string;

  AppModules: DBAppModules[] = [];

  constructor(init?: Partial<DBApp>) {
    Object.assign(this, init);
  }
}
