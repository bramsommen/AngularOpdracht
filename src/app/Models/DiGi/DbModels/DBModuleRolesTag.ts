import { DBRoleTag } from "./DBRoleTag";
import { DiGiModule } from "../DiGiModule";

export class DBModuleRolesTag {
  id: number;
  modulesId: number;
  roleTagsId: number;

  module: DiGiModule;
  roleTag: DBRoleTag;
}
