import { BaseDataProductVersie } from "./../../Models/BaseData/BaseDataProductVersie";
import { BaseDataProduct } from "./../../Models/BaseData/BaseDataProduct";
import { UserService } from "./../user.service";
import { DiGiInstellingenService } from "./../DiGiInstellingen.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class BaseDataProductVersieService {
  constructor(
    private http: HttpClient,
    private digiSetup: DiGiInstellingenService,
    private userService: UserService
  ) {}
  // CREATE
  async Create(obj: BaseDataProductVersie) {
    obj.id = 0; // Init ID (wordt toegekend door DB)

    const result = this.http
      .request(
        "Post",
        this.digiSetup.BaseDataApiPath + "/api/ProductieVersie",
        {
          body: obj
        }
      )
      .toPromise();
    return result;
  }

  async CreateFromTemplate(obj: BaseDataProduct) {
    const result = this.http
      .request(
        "Post",
        this.digiSetup.BaseDataApiPath +
          "/api/ProductieVersie/CreateFromTemplate",
        {
          body: obj
        }
      )
      .toPromise();
    return result;
  }

  async CreateNewFromOtherVersion(obj: BaseDataProductVersie) {
    const result = this.http
      .request(
        "Post",
        this.digiSetup.BaseDataApiPath +
          "/api/ProductieVersie/CreateNewFromOtherVersion",
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
      .get<BaseDataProductVersie>(
        this.digiSetup.BaseDataApiPath + "/api/ProductieVersie",
        {
          params: {
            strProductVersieID: productVersieID.toString()
          }
        }
      )

      .toPromise();
    return result;
  }

  async ValidateVersie(productVersieID: number) {
    // Haal alle Role Tags

    const result = this.http
      .request(
        "get",
        this.digiSetup.BaseDataApiPath + "/api/ProductieVersie/ValidateVersie",
        {
          responseType: "text",
          params: {
            strProductVersieID: productVersieID.toString()
          }
        }
      )

      .toPromise();
    return result;
  }

  // UPDATE
  async Update(obj: BaseDataProductVersie) {
    const result = this.http
      .request("Put", this.digiSetup.BaseDataApiPath + "/api/ProductieVersie", {
        body: obj
      })
      .toPromise();
    return result;
  }

  // DELETE
  async Delete(obj: BaseDataProductVersie) {
    const result = this.http
      .request(
        "delete",
        this.digiSetup.BaseDataApiPath + "/api/ProductieVersie",
        {
          body: obj
        }
      )
      .toPromise();
    return result;
  }
}
