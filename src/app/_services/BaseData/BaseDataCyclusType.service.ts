import { BaseDataCyclusType } from "./../../Models/BaseData/BaseDataCyclusType";
import { UserService } from "./../user.service";
import { DiGiInstellingenService } from "./../DiGiInstellingen.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class BaseDataCyclusTypeService {
  constructor(
    private http: HttpClient,
    private digiSetup: DiGiInstellingenService,
    private userService: UserService
  ) {}
  // CREATE
  async Create(obj: BaseDataCyclusType) {
    obj.id = 0; // Init ID (wordt toegekend door DB

    const result = this.http
      .request("Post", this.digiSetup.BaseDataApiPath + "/api/CyclusType", {
        body: obj
      })
      .toPromise();
    return result;
  }

  // READ
  async GetFromMachineOnderdeel(machineOnderdeelID: number) {
    // Haal alle Role Tags
    const result = this.http
      .get<BaseDataCyclusType[]>(
        this.digiSetup.BaseDataApiPath + "/api/CyclusType",
        {
          params: {
            strMachineOnderdeelID: machineOnderdeelID.toString()
          }
        }
      )

      .toPromise();
    return result;
  }

  // UPDATE
  async Update(obj: BaseDataCyclusType) {
    const result = this.http
      .request("Put", this.digiSetup.BaseDataApiPath + "/api/CyclusType", {
        body: obj
      })
      .toPromise();
    return result;
  }

  // DELETE
  async Delete(obj: BaseDataCyclusType) {
    const result = this.http
      .request("delete", this.digiSetup.BaseDataApiPath + "/api/CyclusType", {
        body: obj
      })
      .toPromise();
    return result;
  }
}
