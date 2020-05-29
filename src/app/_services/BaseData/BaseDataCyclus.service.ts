import { BaseDataCyclus } from "./../../Models/BaseData/BaseDataCyclus";
import { UserService } from "./../user.service";
import { DiGiInstellingenService } from "./../DiGiInstellingen.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class BaseDataCyclusService {
  constructor(
    private http: HttpClient,
    private digiSetup: DiGiInstellingenService,
    private userService: UserService
  ) {}

  // CREATE
  async Create(obj: BaseDataCyclus) {
    obj.id = 0; // Init ID (wordt toegekend door DB

    const result = this.http
      .request("Post", this.digiSetup.BaseDataApiPath + "/api/Cyclus", {
        body: obj
      })
      .toPromise();
    return result;
  }

  async Clone(obj: BaseDataCyclus) {
    const result = this.http
      .request("Post", this.digiSetup.BaseDataApiPath + "/api/Cyclus/Clone", {
        body: obj
      })
      .toPromise();
    return result;
  }

  // READ
  async GetFromMachineOnderdeel(machineOnderdeelID: number) {
    // Haal alle Role Tags
    const result = this.http
      .get<BaseDataCyclus[]>(this.digiSetup.BaseDataApiPath + "/api/Cyclus", {
        params: {
          strMachineOnderdeelID: machineOnderdeelID.toString()
        }
      })

      .toPromise();
    return result;
  }

  async GetFromCyclusType(cyclusTypeID: number) {
    // Haal alle Role Tags
    const result = this.http
      .get<BaseDataCyclus[]>(
        this.digiSetup.BaseDataApiPath + "/api/Cyclus/GetFromCyclusType",
        {
          params: {
            strCyclusTypeID: cyclusTypeID.toString()
          }
        }
      )

      .toPromise();
    return result;
  }

  // UPDATE
  async Update(obj: BaseDataCyclus) {
    const result = this.http
      .request("Put", this.digiSetup.BaseDataApiPath + "/api/Cyclus", {
        body: obj
      })
      .toPromise();
    return result;
  }

  // DELETE
  async Delete(obj: BaseDataCyclus) {
    const result = this.http
      .request("delete", this.digiSetup.BaseDataApiPath + "/api/Cyclus", {
        body: obj
      })
      .toPromise();
    return result;
  }
}
