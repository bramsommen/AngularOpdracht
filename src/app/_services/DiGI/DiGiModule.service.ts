import { DiGiInstellingenService } from "./../DiGiInstellingen.service";
import { DiGiModule } from "./../../Models/DiGi/DiGiModule";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class DiGiModuleService {
  constructor(
    private http: HttpClient,
    private digiSetup: DiGiInstellingenService
  ) {}

  // CREATE
  async Create(obj: DiGiModule) {
    const result = this.http
      .request("Post", this.digiSetup.DigiApiPath + "/api/Modules", {
        body: obj
      })
      .toPromise();
    return result;
  }

  // READ
  async GetAll() {
    // Haal alle Role Tags
    const result = this.http
      .get<DiGiModule[]>(this.digiSetup.DigiApiPath + "/api/Modules")
      .toPromise();
    return result;
  }

  // UPDATE
  async Update(obj: DiGiModule) {
    const result = this.http
      .request("Put", this.digiSetup.DigiApiPath + "/api/Modules", {
        body: obj
      })
      .toPromise();
    return result;
  }

  // DELETE
  async Delete(obj: DiGiModule) {
    const result = this.http
      .request("delete", this.digiSetup.DigiApiPath + "/api/Modules", {
        body: obj
      })
      .toPromise();
    return result;
  }
}
