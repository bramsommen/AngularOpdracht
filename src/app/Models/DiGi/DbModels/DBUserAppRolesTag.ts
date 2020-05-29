import { DBUser } from "./DBUser";
import { DBRoleTag } from "./DBRoleTag";
import { DBApp } from "./DBApp";
export class DBUserAppRolesTag {
  id: number;
  usersId: number;
  appsId: number;
  rolesTagsId: number;

  user: DBUser;
  app: DBApp;
  RoleTag: DBRoleTag;
}
