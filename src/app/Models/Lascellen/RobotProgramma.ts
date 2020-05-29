import { RobotProgrammaMachineOnderdeelProduct } from "./RobotProgrammaMachineOnderdeelProduct";
export class RobotProgramma {
  constructor(init?: Partial<RobotProgramma>) {
    Object.assign(this, init);
  }

  id: number;
  machine: string;
  roseServerReferentie: string;
  naam: string;
  omschrijving: string;

  type: number;
  status: number;

  robotProgrammaMachineOnderdeelProduct: RobotProgrammaMachineOnderdeelProduct[] = [];
}
