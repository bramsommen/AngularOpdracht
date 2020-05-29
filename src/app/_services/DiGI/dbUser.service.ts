import { DiGiInstellingenService } from "./../DiGiInstellingen.service";
import { HttpClient } from "@angular/common/http";
import { DBUser } from "./../../Models/DiGi/DbModels/DBUser";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class DbUserService {
  constructor(
    private http: HttpClient,
    private digiSetup: DiGiInstellingenService
  ) {}
  // CREATE
  async Create(obj: DBUser) {
    const result = this.http
      .request("Post", this.digiSetup.DigiApiPath + "/api/User", {
        body: obj
      })
      .toPromise();
    return result;
  }

  // READ
  async GetAll() {
    // Haal alle Role Tags van één module
    const result = this.http
      .get<DBUser[]>(this.digiSetup.DigiApiPath + "/api/User")
      .toPromise();
    return result;
  }

  // UPDATE
  async Update(obj: DBUser) {
    const result = this.http
      .request("Put", this.digiSetup.DigiApiPath + "/api/User", {
        body: obj
      })
      .toPromise();
    return result;
  }

  // DELETE
  async Delete(obj: DBUser) {
    const result = this.http
      .request("delete", this.digiSetup.DigiApiPath + "/api/User", {
        body: obj
      })
      .toPromise();
    return result;
  }
}
