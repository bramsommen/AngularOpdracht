import { DBApp } from "./DBApp";
import { DBModule } from "./DBModule";
export class DBAppModules {
  id: number;

  appsId: number;
  app: DBApp;

  moduleId: number;
  module: DBModule;

  parentModuleId: number;
  parentModule: DBModule;

  sortNumber: number;
}
