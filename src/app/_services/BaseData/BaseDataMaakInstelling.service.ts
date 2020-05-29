import { HttpClient } from "@angular/common/http";
import { DiGiInstellingenService } from "./../DiGiInstellingen.service";
import { UserService } from "./../user.service";
import { BaseDataMaakInstelling } from "./../../Models/BaseData/BaseDataMaakInstelling";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class MaakInstellingService {
  constructor(
    private http: HttpClient,
    private digiSetup: DiGiInstellingenService,
    private userService: UserService
  ) {}

  // CREATE
  async Create(obj: BaseDataMaakInstelling) {
    obj.id = 0; // Init ID (wordt toegekend door DB

    const result = this.http
      .request("Post", this.digiSetup.BaseDataApiPath + "/api/MaakInstelling", {
        body: obj
      })
      .toPromise();
    return result;
  }

  // READ
  async GetFromMachineOnderdeel(machineOnderdeelID: number) {
    // Haal alle Role Tags
    const result = this.http
      .get<BaseDataMaakInstelling[]>(
        this.digiSetup.BaseDataApiPath + "/api/MaakInstelling",
        {
          params: {
            strmachineOnderdeelID: machineOnderdeelID.toString()
          }
        }
      )

      .toPromise();
    return result;
  }

  // UPDATE
  async Update(obj: BaseDataMaakInstelling) {
    const result = this.http
      .request("Put", this.digiSetup.BaseDataApiPath + "/api/MaakInstelling", {
        body: obj
      })
      .toPromise();
    return result;
  }

  // DELETE
  async Delete(obj: BaseDataMaakInstelling) {
    const result = this.http
      .request(
        "delete",
        this.digiSetup.BaseDataApiPath + "/api/MaakInstelling",
        {
          body: obj
        }
      )
      .toPromise();
    return result;
  }
}
