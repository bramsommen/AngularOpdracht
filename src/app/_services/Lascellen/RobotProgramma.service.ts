import { RobotProgramma } from "./../../Models/Lascellen/RobotProgramma";
import { UserService } from "./../user.service";
import { DiGiInstellingenService } from "./../DiGiInstellingen.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class RobotProgrammaService {
  constructor(
    private http: HttpClient,
    private digiSetup: DiGiInstellingenService,
    private userService: UserService
  ) {}

  // CREATE
  async Create(obj: RobotProgramma) {
    obj.id = 0; // Init ID (wordt toegekend door DB)

    const result = this.http
      .request(
        "Post",
        this.digiSetup.LascellenApiPath + "/api/RobotProgramma",
        {
          body: obj,
        }
      )
      .toPromise();
    return result;
  }

  // READ
  async GetFromID(id: number) {
    const result = this.http
      .get<RobotProgramma>(
        this.digiSetup.LascellenApiPath + "/api/RobotProgramma/GetFromID",
        {
          params: {
            strID: id.toString(),
          },
        }
      )

      .toPromise();
    return result;
  }

  async GetFromRoseServerReferentie(roseServerReferentie: string) {
    const result = this.http
      .get<RobotProgramma>(
        this.digiSetup.LascellenApiPath +
          "/api/RobotProgramma/GetFromRoseServerReferentie",
        {
          params: {
            _roseServerReferentie: roseServerReferentie,
          },
        }
      )

      .toPromise();
    return result;
  }

  async GetFromMachine(machine: string) {
    const result = this.http
      .get<RobotProgramma[]>(
        this.digiSetup.LascellenApiPath + "/api/RobotProgramma/GetFromMachine",
        {
          params: {
            _machine: machine,
          },
        }
      )

      .toPromise();
    return result;
  }

  async GetFromMachineOnderdeel(machineOnderdeel: string) {
    const result = this.http
      .get<RobotProgramma[]>(
        this.digiSetup.LascellenApiPath +
          "/api/RobotProgramma/GetFromMachineOnderdeel",
        {
          params: {
            _machineOnderdeel: machineOnderdeel,
          },
        }
      )

      .toPromise();
    return result;
  }

  async GetFromMachineArtikelCode(machine: string, artikelCode: string) {
    const result = this.http
      .get<RobotProgramma[]>(
        this.digiSetup.LascellenApiPath +
          "/api/RobotProgramma/GetFromMachineArtikelCode",
        {
          params: {
            _machine: machine,
            _artikelCode: artikelCode,
          },
        }
      )

      .toPromise();
    return result;
  }

  async GetFromMachineArtikelCodeActive(machine: string, artikelCode: string) {
    const result = this.http
      .get<RobotProgramma[]>(
        this.digiSetup.LascellenApiPath +
          "/api/RobotProgramma/GetFromMachineArtikelCodeActive",
        {
          params: {
            _machine: machine,
            _artikelCode: artikelCode,
          },
        }
      )

      .toPromise();
    return result;
  }

  // UPDATE
  async Update(obj: RobotProgramma) {
    const result = this.http
      .request("Put", this.digiSetup.LascellenApiPath + "/api/RobotProgramma", {
        body: obj,
      })
      .toPromise();
    return result;
  }

  // DELETE
  async Delete(obj: RobotProgramma) {
    // Remove Overkill
    obj.robotProgrammaMachineOnderdeelProduct = null;

    const result = this.http
      .request(
        "delete",
        this.digiSetup.LascellenApiPath + "/api/RobotProgramma",
        {
          body: obj,
        }
      )
      .toPromise();
    return result;
  }
}
