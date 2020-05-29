import { DiGiInstellingenService } from "./../DiGiInstellingen.service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { DBApp } from "src/app/Models/DiGi/DbModels/DBApp";

@Injectable({
  providedIn: "root"
})
export class AppsService {
  constructor(
    private http: HttpClient,
    private digiSetup: DiGiInstellingenService
  ) {}

  // CREATE
  async Create(obj: DBApp) {
    const result = this.http
      .request("Post", this.digiSetup.DigiApiPath + "/api/Apps", {
        body: obj
      })
      .toPromise();
    return result;
  }

  // READ
  async GetAll() {
    // Haal alle Role Tags
    const result = this.http
      .get<DBApp[]>(this.digiSetup.DigiApiPath + "/api/Apps")
      .toPromise();
    return result;
  }

  // UPDATE
  async Update(obj: DBApp) {
    const result = this.http
      .request("Put", this.digiSetup.DigiApiPath + "/api/Apps", {
        body: obj
      })
      .toPromise();
    return result;
  }

  // DELETE
  async Delete(obj: DBApp) {
    const result = this.http
      .request("delete", this.digiSetup.DigiApiPath + "/api/Apps", {
        body: obj
      })
      .toPromise();
    return result;
  }
}
