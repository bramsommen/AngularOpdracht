import { DiGiInstellingenService } from "./../DiGiInstellingen.service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { DBAppModules } from "src/app/Models/DiGi/DbModels/DbAppModules";

@Injectable({
  providedIn: "root"
})
export class AppModuleService {
  constructor(
    private http: HttpClient,
    private digiSetup: DiGiInstellingenService
  ) {}

  // CREATE
  async Create(obj: DBAppModules) {
    const result = this.http
      .request("Post", this.digiSetup.DigiApiPath + "/api/AppModules", {
        body: obj
      })
      .toPromise();
    return result;
  }

  // READ
  async GetFromModule(appID: number, parentModuleID: number) {
    // Haal alle Role Tags van één module
    const result = this.http
      .get<DBAppModules[]>(this.digiSetup.DigiApiPath + "/api/AppModules", {
        params: {
          appIDString: appID.toString(),
          parentModuleString: parentModuleID.toString()
        }
      })
      .toPromise();
    return result;
  }

  // UPDATE
  async Update(obj: DBAppModules) {
    const result = this.http
      .request("Put", this.digiSetup.DigiApiPath + "/api/AppModules", {
        body: obj
      })
      .toPromise();
    return result;
  }

  // DELETE
  async Delete(obj: DBAppModules) {
    const result = this.http
      .request("delete", this.digiSetup.DigiApiPath + "/api/AppModules", {
        body: obj
      })
      .toPromise();
    return result;
  }
}
