import { BaseDataCyclusMaakInstelling } from "./../../Models/BaseData/BaseDataCyclusMaakInstelling";
import { HttpClient } from "@angular/common/http";
import { UserService } from "./../user.service";
import { DiGiInstellingenService } from "./../DiGiInstellingen.service";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class BaseDataCyclusMaakInstellingenService {
  constructor(
    private http: HttpClient,
    private digiSetup: DiGiInstellingenService,
    private userService: UserService
  ) {}

  // CREATE
  async Create(obj: BaseDataCyclusMaakInstelling) {
    obj.id = 0; // Init ID (wordt toegekend door DB

    const result = this.http
      .request(
        "Post",
        this.digiSetup.BaseDataApiPath + "/api/CyclusMaakInstelingen",
        {
          body: obj
        }
      )
      .toPromise();
    return result;
  }

  // READ
  async GetFrom(cyclusID: number) {
    // Haal alle Role Tags
    const result = this.http
      .get<BaseDataCyclusMaakInstelling[]>(
        this.digiSetup.BaseDataApiPath + "/api/CyclusMaakInstelingen",
        {
          params: {
            strcyclusID: cyclusID.toString()
          }
        }
      )

      .toPromise();
    return result;
  }

  // UPDATE
  async Update(obj: BaseDataCyclusMaakInstelling) {
    const result = this.http
      .request(
        "Put",
        this.digiSetup.BaseDataApiPath + "/api/CyclusMaakInstelingen",
        {
          body: obj
        }
      )
      .toPromise();
    return result;
  }

  // SWAP STAP
  async SwapStap(strCyclusStap1: number, strCyclusStap2: number) {
    const result = this.http
      .request(
        "Put",
        this.digiSetup.BaseDataApiPath + "/api/CyclusMaakInstelingen/SwapStap",
        {
          params: {
            strCyclusStap1: strCyclusStap1.toString(),
            strCyclusStap2: strCyclusStap2.toString()
          }
        }
      )
      .toPromise();
    return result;
  }

  // SWAP STAP
  async Attach(cyclusMaakInStellingID: number) {
    const result = this.http
      .request(
        "Put",
        this.digiSetup.BaseDataApiPath + "/api/CyclusMaakInstelingen/Attach",
        {
          params: {
            strCyclusMaakInStellingID: cyclusMaakInStellingID.toString()
          }
        }
      )
      .toPromise();
    return result;
  }

  // DELETE
  async Delete(obj: BaseDataCyclusMaakInstelling) {
    const result = this.http
      .request(
        "delete",
        this.digiSetup.BaseDataApiPath + "/api/CyclusMaakInstelingen",
        {
          body: obj
        }
      )
      .toPromise();
    return result;
  }
}
