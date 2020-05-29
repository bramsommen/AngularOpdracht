import { RobotProgrammaMachineOnderdeelProduct } from "./../../Models/Lascellen/RobotProgrammaMachineOnderdeelProduct";
import { UserService } from "./../user.service";
import { DiGiInstellingenService } from "./../DiGiInstellingen.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class RobotProgrammaMachineOnderdeelProductService {
  constructor(
    private http: HttpClient,
    private digiSetup: DiGiInstellingenService,
    private userService: UserService
  ) {}

  // CREATE
  async Create(obj: RobotProgrammaMachineOnderdeelProduct) {
    obj.id = 0; // Init ID (wordt toegekend door DB)

    const result = this.http
      .request(
        "Post",
        this.digiSetup.LascellenApiPath +
          "/api/RobotProgrammaMachineOnderdeelProduct",
        {
          body: obj,
        }
      )
      .toPromise();
    return result;
  }

  // READ
  async GetFromMachineOnderdeel(machineOnderdeel: string) {
    const result = this.http
      .get<RobotProgrammaMachineOnderdeelProduct[]>(
        this.digiSetup.LascellenApiPath +
          "/api/RobotProgrammaMachineOnderdeelProduct/GetFromMachineOnderdeel",
        {
          params: {
            _machineOnderdeel: machineOnderdeel,
          },
        }
      )

      .toPromise();
    return result;
  }

  async GetFromArtikelCode(artikelCode: string) {
    const result = this.http
      .get<RobotProgrammaMachineOnderdeelProduct[]>(
        this.digiSetup.LascellenApiPath +
          "/api/RobotProgrammaMachineOnderdeelProduct/GetFromArtikelCode",
        {
          params: {
            _artikelCode: artikelCode,
          },
        }
      )

      .toPromise();
    return result;
  }

  async GetArtikelCodesFromMachine(machine: string) {
    const result = this.http
      .get<string[]>(
        this.digiSetup.LascellenApiPath +
          "/api/RobotProgrammaMachineOnderdeelProduct/GetArtikelCodesFromMachine",
        {
          params: {
            _machine: machine,
          },
        }
      )

      .toPromise();
    return result;
  }

  // UPDATE
  async Update(obj: RobotProgrammaMachineOnderdeelProduct) {
    const result = this.http
      .request(
        "Put",
        this.digiSetup.LascellenApiPath +
          "/api/RobotProgrammaMachineOnderdeelProduct",
        {
          body: obj,
        }
      )
      .toPromise();
    return result;
  }

  // DELETE
  async Delete(obj: RobotProgrammaMachineOnderdeelProduct) {
    const result = this.http
      .request(
        "delete",
        this.digiSetup.LascellenApiPath +
          "/api/RobotProgrammaMachineOnderdeelProduct",
        {
          body: obj,
        }
      )
      .toPromise();
    return result;
  }
}
