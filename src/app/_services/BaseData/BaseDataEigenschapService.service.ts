import { BaseDataEigenschap } from "./../../Models/BaseData/BaseDataEigenschap";
import { UserService } from "./../user.service";
import { HttpClient } from "@angular/common/http";
import { DiGiInstellingenService } from "./../DiGiInstellingen.service";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class BaseDataEigenschapServiceService {
  constructor(
    private http: HttpClient,
    private digiSetup: DiGiInstellingenService,
    private userService: UserService
  ) {}

  // CREATE
  async Create(obj: BaseDataEigenschap) {
    obj.id = 0; // Init ID (wordt toegekend door DB
    obj.machineOnderdeel = null;
    const result = this.http
      .request("Post", this.digiSetup.BaseDataApiPath + "/api/Eigenschap", {
        body: obj
      })
      .toPromise();
    return result;
  }

  // READ
  async GetFromMachineOnderdeel(machineOnderdeelID: number) {
    // Haal alle Role Tags
    const result = this.http
      .get<BaseDataEigenschap[]>(
        this.digiSetup.BaseDataApiPath + "/api/Eigenschap",
        {
          params: {
            strMachineOnderdeelID: machineOnderdeelID.toString()
          }
        }
      )

      .toPromise();
    return result;
  }

  async GetFromMachineOnderdeelType(
    machineOnderdeelID: number,
    dataType: string
  ) {
    // Haal alle Role Tags
    const result = this.http
      .get<BaseDataEigenschap[]>(
        this.digiSetup.BaseDataApiPath + "/api/Eigenschap/GetFromPoolNaamType",
        {
          params: {
            strMachineOnderdeelID: machineOnderdeelID.toString(),
            strdataType: dataType
          }
        }
      )

      .toPromise();
    return result;
  }

  // UPDATE
  async Update(obj: BaseDataEigenschap) {
    const result = this.http
      .request("Put", this.digiSetup.BaseDataApiPath + "/api/Eigenschap", {
        body: obj
      })
      .toPromise();
    return result;
  }

  // DELETE
  async Delete(obj: BaseDataEigenschap) {
    const result = this.http
      .request("delete", this.digiSetup.BaseDataApiPath + "/api/Eigenschap", {
        body: obj
      })
      .toPromise();
    return result;
  }
}
