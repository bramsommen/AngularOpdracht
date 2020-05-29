import { BaseDataMachineOnderdeel } from "./../../Models/BaseData/BaseDataMachineOnderdeel";
import { UserService } from "./../user.service";
import { DiGiInstellingenService } from "./../DiGiInstellingen.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class BaseDataMachineOnderdeelService {
  constructor(
    private http: HttpClient,
    private digiSetup: DiGiInstellingenService,
    private userService: UserService
  ) {}

  // CREATE
  async Create(obj: BaseDataMachineOnderdeel) {
    obj.id = 0; // Init ID (wordt toegekend door DB
    obj.machine = this.userService.staticActiveApp.machine; // Set machine naam

    const result = this.http
      .request(
        "Post",
        this.digiSetup.BaseDataApiPath + "/api/MachineOnderdeel",
        {
          body: obj,
        }
      )
      .toPromise();
    return result;
  }

  // READ
  async GetFromMachine() {
    // Haal alle Role Tags
    const result = this.http
      .get<BaseDataMachineOnderdeel[]>(
        this.digiSetup.BaseDataApiPath + "/api/MachineOnderdeel",
        {
          params: {
            machine: this.userService.staticActiveApp.machine,
          },
        }
      )

      .toPromise();
    return result;
  }

  async GetAll() {
    // Haal alle Role Tags
    const result = this.http
      .get<BaseDataMachineOnderdeel[]>(
        this.digiSetup.BaseDataApiPath + "/api/MachineOnderdeel/GetAll"
      )

      .toPromise();
    return result;
  }

  // UPDATE
  async Update(obj: BaseDataMachineOnderdeel) {
    obj.machine = this.userService.staticActiveApp.machine; // Set Machine naam

    const result = this.http
      .request(
        "Put",
        this.digiSetup.BaseDataApiPath + "/api/MachineOnderdeel",
        {
          body: obj,
        }
      )
      .toPromise();
    return result;
  }

  // DELETE
  async Delete(obj: BaseDataMachineOnderdeel) {
    const result = this.http
      .request(
        "delete",
        this.digiSetup.BaseDataApiPath + "/api/MachineOnderdeel",
        {
          body: obj,
        }
      )
      .toPromise();
    return result;
  }
}
