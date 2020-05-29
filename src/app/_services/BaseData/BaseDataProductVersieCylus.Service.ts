import { BaseDataProductVersieCylus } from "../../Models/BaseData/BaseDataProductVersieCylus";
import { UserService } from "../user.service";
import { DiGiInstellingenService } from "../DiGiInstellingen.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class BaseDataProductVersieCylusService {
  constructor(
    private http: HttpClient,
    private digiSetup: DiGiInstellingenService,
    private userService: UserService
  ) {}
  // CREATE
  async Create(obj: BaseDataProductVersieCylus) {
    obj.id = 0; // Init ID (wordt toegekend door DB)

    const result = this.http
      .request(
        "Post",
        this.digiSetup.BaseDataApiPath + "/api/ProductVersieCyclus",
        {
          body: obj
        }
      )
      .toPromise();
    return result;
  }

  // READ
  async GetFrom(productVersieID: number) {
    // Haal alle Role Tags
    const result = this.http
      .get<BaseDataProductVersieCylus[]>(
        this.digiSetup.BaseDataApiPath + "/api/ProductVersieCyclus",
        {
          params: {
            strVersieID: productVersieID.toString()
          }
        }
      )

      .toPromise();
    return result;
  }

  // UPDATE
  async Update(obj: BaseDataProductVersieCylus) {
    const result = this.http
      .request(
        "Put",
        this.digiSetup.BaseDataApiPath + "/api/ProductVersieCyclus",
        {
          body: obj
        }
      )
      .toPromise();
    return result;
  }

  // DELETE
  async Delete(obj: BaseDataProductVersieCylus) {
    const result = this.http
      .request(
        "delete",
        this.digiSetup.BaseDataApiPath + "/api/ProductVersieCyclus",
        {
          body: obj
        }
      )
      .toPromise();
    return result;
  }
}
