export class RobotProgrammaMachineOnderdeelProduct {
  constructor(init?: Partial<RobotProgrammaMachineOnderdeelProduct>) {
    Object.assign(this, init);
  }

  id: number;
  robotProgramaId: number;
  baseDataMachineOnderdeelId: number;
  baseDataMachineOnderdeelNaam: string;
  baseDataProductId: number;
  baseDataProductArtikelCode: string;

  basedataVersieStatus: number;
}
