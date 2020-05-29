import { BaseDataHmiMgmtExchange } from "./../../Models/BaseData/BaseDataHmiMgmtExchange";
import { UserService } from "./../user.service";
import { DiGiInstellingenService } from "./../DiGiInstellingen.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class HmiMgmtExchangeService {
  constructor(
    private http: HttpClient,
    private digiSetup: DiGiInstellingenService,
    private userService: UserService
  ) {}

  // CREATE
  async Create(obj: BaseDataHmiMgmtExchange) {
    obj.id = 0; // Init ID (wordt toegekend door DB
    obj.machine = this.userService.staticActiveApp.machine;

    if (obj.value === null) {
      obj.value = "";
    }

    const result = this.http
      .request(
        "Post",
        this.digiSetup.BaseDataApiPath + "/api/HmiMgmtExchange",
        {
          body: obj,
        }
      )
      .toPromise();
    return result;
  }

  // READ
  async GetFromID(hmiMgmtExchangeID: number) {
    const result = this.http
      .get<BaseDataHmiMgmtExchange>(
        this.digiSetup.BaseDataApiPath + "/api/HmiMgmtExchange",
        {
          params: {
            strHmiMgmtExchangeID: hmiMgmtExchangeID.toString(),
          },
        }
      )

      .toPromise();
    return result;
  }

  async GetFromMachineNaam(_naam: string) {
    const result = this.http
      .get<BaseDataHmiMgmtExchange>(
        this.digiSetup.BaseDataApiPath +
          "/api/HmiMgmtExchange/GetFromMachineNaam",
        {
          params: {
            machine: this.userService.staticActiveApp.machine,
            naam: _naam,
          },
        }
      )

      .toPromise();
    return result;
  }

  async GetFromMachine() {
    const result = this.http
      .get<BaseDataHmiMgmtExchange[]>(
        this.digiSetup.BaseDataApiPath + "/api/HmiMgmtExchange/GetFromMachine",
        {
          params: {
            machine: this.userService.staticActiveApp.machine,
          },
        }
      )

      .toPromise();
    return result;
  }

  // UPDATE
  async Update(obj: BaseDataHmiMgmtExchange) {
    if (obj.value === null) {
      obj.value = "";
    }

    const result = this.http
      .request("Put", this.digiSetup.BaseDataApiPath + "/api/HmiMgmtExchange", {
        body: obj,
      })
      .toPromise();
    return result;
  }

  async UpdateValue(obj: BaseDataHmiMgmtExchange) {
    if (obj.value === null) {
      obj.value = "";
    }

    const result = this.http
      .request(
        "Put",
        this.digiSetup.BaseDataApiPath + "/api/HmiMgmtExchange/UpdateValue",
        {
          body: obj,
        }
      )
      .toPromise();
    return result;
  }

  // DELETE
  async Delete(obj: BaseDataHmiMgmtExchange) {
    const result = this.http
      .request(
        "delete",
        this.digiSetup.BaseDataApiPath + "/api/HmiMgmtExchange",
        {
          body: obj,
        }
      )
      .toPromise();
    return result;
  }
}
