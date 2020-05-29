import { BaseDataProduct } from "./../../Models/BaseData/BaseDataProduct";
import { UserService } from "./../user.service";
import { DiGiInstellingenService } from "./../DiGiInstellingen.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class BaseDataProductService {
  constructor(
    private http: HttpClient,
    private digiSetup: DiGiInstellingenService,
    private userService: UserService
  ) {}

  // CREATE
  async Create(obj: BaseDataProduct) {
    obj.id = 0; // Init ID (wordt toegekend door DB)

    const result = this.http
      .request("Post", this.digiSetup.BaseDataApiPath + "/api/Product", {
        body: obj
      })
      .toPromise();
    return result;
  }

  async Copy(productID: number) {
    const result = this.http
      .request("Post", this.digiSetup.BaseDataApiPath + "/api/Product/Copy", {
        params: {
          strProductID: productID.toString()
        }
      })
      .toPromise();
    return result;
  }

  // READ
  async GetFromMachineOnderdeel(machineOnderdeelID: number) {
    // Haal alle Role Tags
    const result = this.http
      .get<BaseDataProduct[]>(this.digiSetup.BaseDataApiPath + "/api/Product", {
        params: {
          strmachineOnderdeelID: machineOnderdeelID.toString()
        }
      })

      .toPromise();
    return result;
  }

  async GetFromID(productID: number) {
    const result = this.http
      .get<BaseDataProduct>(
        this.digiSetup.BaseDataApiPath + "/api/Product/GetfromID",
        {
          params: {
            strProductID: productID.toString()
          }
        }
      )

      .toPromise();
    return result;
  }

  // UPDATE
  async Update(obj: BaseDataProduct) {
    const result = this.http
      .request("Put", this.digiSetup.BaseDataApiPath + "/api/Product", {
        body: obj
      })
      .toPromise();
    return result;
  }

  // DELETE
  async Delete(obj: BaseDataProduct) {
    // Remove Overkill
    obj.productVersie = null;

    const result = this.http
      .request("delete", this.digiSetup.BaseDataApiPath + "/api/Product", {
        body: obj
      })
      .toPromise();
    return result;
  }
}
