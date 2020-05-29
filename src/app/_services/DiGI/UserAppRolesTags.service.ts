import { DiGiInstellingenService } from "./../DiGiInstellingen.service";
import { DBRoleTag } from "./../../Models/DiGi/DbModels/DBRoleTag";
import { DBApp } from "./../../Models/DiGi/DbModels/DBApp";
import { HttpClient } from "@angular/common/http";
import { DBUserAppRolesTag } from "./../../Models/DiGi/DbModels/DBUserAppRolesTag";
import { Injectable, APP_ID } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class UserAppRolesTagsService {
  constructor(
    private http: HttpClient,
    private digiSetup: DiGiInstellingenService
  ) {}

  // CREATE
  async Create(obj: DBUserAppRolesTag) {
    const result = this.http
      .request("Post", this.digiSetup.DigiApiPath + "/api/UserAppRolesTags", {
        body: obj
      })
      .toPromise();
    return result;
  }

  // READ
  async GetAllFromUser(userID: number) {
    // Haal alle Role Tags van één module
    const result = this.http
      .get<DBUserAppRolesTag[]>(
        this.digiSetup.DigiApiPath + "/api/UserAppRolesTags",
        {
          params: {
            strUserID: userID.toString()
          }
        }
      )
      .toPromise();
    return result;
  }

  async GetAppsFromUser(userID: number) {
    // Haal alle Apps  van één user
    const result = this.http
      .get<DBApp[]>(
        this.digiSetup.DigiApiPath + "/api/UserAppRolesTags/GetAppsFromUser",
        {
          params: {
            strUserID: userID.toString()
          }
        }
      )
      .toPromise();
    return result;
  }

  async GetRoleTagsFromUserApps(userID: number, appID: number) {
    // Haal alle Role Tags van één app
    const result = this.http
      .get<DBRoleTag[]>(
        this.digiSetup.DigiApiPath +
          "/api/UserAppRolesTags/GetRoleTagsFromUserApps",
        {
          params: {
            strUserID: userID.toString(),
            strAppID: appID.toString()
          }
        }
      )
      .toPromise();
    return result;
  }

  // UPDATE
  async Update(obj: DBUserAppRolesTag) {
    const result = this.http
      .request("Put", this.digiSetup.DigiApiPath + "/api/UserAppRolesTags", {
        body: obj
      })
      .toPromise();
    return result;
  }

  // DELETE
  async Delete(obj: DBUserAppRolesTag) {
    const result = this.http
      .request("delete", this.digiSetup.DigiApiPath + "/api/UserAppRolesTags", {
        body: obj
      })
      .toPromise();
    return result;
  }
}
