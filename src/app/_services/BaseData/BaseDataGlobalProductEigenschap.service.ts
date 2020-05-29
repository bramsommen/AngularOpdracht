import { BaseDataGlobalProductEigenschap } from "./../../Models/BaseData/BaseDataGlobalProductEigenschap";
import { UserService } from "./../user.service";
import { DiGiInstellingenService } from "./../DiGiInstellingen.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class BaseDataGlobalProductEigenschapService {
  constructor(
    private http: HttpClient,
    private digiSetup: DiGiInstellingenService,
    private userService: UserService
  ) {}

  // CREATE
  async Create(obj: BaseDataGlobalProductEigenschap) {
    obj.id = 0; // Init ID (wordt toegekend door DB)

    const result = this.http
      .request(
        "Post",
        this.digiSetup.BaseDataApiPath + "/api/GlobalProductEigenschap",
        {
          body: obj,
        }
      )
      .toPromise();
    return result;
  }

  async AddEigenschapFromMachineonderdeel(
    artikelCode: string,
    machineondeerliD: number
  ) {
    const result = this.http
      .request(
        "Post",
        this.digiSetup.BaseDataApiPath +
          "/api/GlobalProductEigenschap/AddEigenschapFromMachineonderdeel",
        {
          params: {
            _artikelCode: artikelCode,
            strMachineonderdeeliD: machineondeerliD.toString(),
          },
        }
      )
      .toPromise();
    return result;
  }

  // READ
  async GetFromID(id: number) {
    // Haal alle Role Tags
    const result = this.http
      .get<BaseDataGlobalProductEigenschap>(
        this.digiSetup.BaseDataApiPath +
          "/api/GlobalProductEigenschap/GetFromID",
        {
          params: {
            strId: id.toString(),
          },
        }
      )

      .toPromise();
    return result;
  }

  async GetFromArtikelCode(artikelCode: string) {
    const result = this.http
      .get<BaseDataGlobalProductEigenschap[]>(
        this.digiSetup.BaseDataApiPath +
          "/api/GlobalProductEigenschap/GetFromArtikelCode",
        {
          params: {
            _artikelCode: artikelCode,
          },
        }
      )

      .toPromise();
    return result;
  }

  // UPDATE
  async Update(obj: BaseDataGlobalProductEigenschap) {
    const result = this.http
      .request(
        "Put",
        this.digiSetup.BaseDataApiPath + "/api/GlobalProductEigenschap",
        {
          body: obj,
        }
      )
      .toPromise();
    return result;
  }

  // DELETE
  async Delete(obj: BaseDataGlobalProductEigenschap) {
    // Remove Overkill
    obj.globalProduct = null;

    const result = this.http
      .request(
        "delete",
        this.digiSetup.BaseDataApiPath + "/api/GlobalProductEigenschap",
        {
          body: obj,
        }
      )
      .toPromise();
    return result;
  }
}
