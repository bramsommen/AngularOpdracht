import { BaseDataGlobalProduct } from "./../../Models/BaseData/BaseDataGlobalProduct";
import { UserService } from "./../user.service";
import { DiGiInstellingenService } from "./../DiGiInstellingen.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class BaseDataGlobalProductService {
  constructor(
    private http: HttpClient,
    private digiSetup: DiGiInstellingenService,
    private userService: UserService
  ) {}
  // CREATE
  async Create(obj: BaseDataGlobalProduct) {
    const result = this.http
      .request("Post", this.digiSetup.BaseDataApiPath + "/api/GlobalProduct", {
        body: obj,
      })
      .toPromise();
    return result;
  }

  // Copy
  async CopyFrom(obj: BaseDataGlobalProduct, newArtikelCode: string) {
    const result = this.http
      .request(
        "Post",
        this.digiSetup.BaseDataApiPath + "/api/GlobalProduct/CopyFrom",
        {
          body: obj,
          params: {
            _artikelCode: newArtikelCode,
          },
        }
      )

      .toPromise();
    return result;
  }

  // READ
  async GetFromArtikelCode(artikelCode: string) {
    // Haal alle Role Tags
    const result = this.http
      .get<BaseDataGlobalProduct>(
        this.digiSetup.BaseDataApiPath +
          "/api/GlobalProduct/GetFromArtikelCode",
        {
          params: {
            _artikelCode: artikelCode,
          },
        }
      )

      .toPromise();
    return result;
  }

  async GetAll() {
    const result = this.http
      .get<BaseDataGlobalProduct[]>(
        this.digiSetup.BaseDataApiPath + "/api/GlobalProduct/GetAll",
        {
          params: {},
        }
      )

      .toPromise();
    return result;
  }

  // UPDATE
  async Update(obj: BaseDataGlobalProduct) {
    const result = this.http
      .request("Put", this.digiSetup.BaseDataApiPath + "/api/GlobalProduct", {
        body: obj,
      })
      .toPromise();
    return result;
  }

  // DELETE
  async Delete(obj: BaseDataGlobalProduct) {
    // Remove Overkill
    obj.eigenschappen = null;

    const result = this.http
      .request(
        "delete",
        this.digiSetup.BaseDataApiPath + "/api/GlobalProduct",
        {
          body: obj,
        }
      )
      .toPromise();
    return result;
  }
}
