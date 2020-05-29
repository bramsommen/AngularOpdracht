import { DiGiRoleTag } from "./DiGiRoleTag";
import { DiGiModule } from "./DiGiModule";

export class App {
  // PROPERTIES
  id: number;
  naam: string;
  omschrijving: string;
  poolnaam: string;
  machine: string;
  type: string;

  modules: DiGiModule[] = [];
  roleTags: DiGiRoleTag[] = [];
}
