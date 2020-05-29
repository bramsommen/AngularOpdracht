import { DiGiRoleTag } from "./DiGiRoleTag";

export class DiGiModule {
  // PROPERTIES
  id: number;

  naam: string;
  omschrijving: string;

  angularComponent: string;
  dedicatedPc: string;

  childModules: DiGiModule[];
  roleTags: DiGiRoleTag[];

  constructor(init?: Partial<DiGiModule>) {
    Object.assign(this, init);
  }
}
