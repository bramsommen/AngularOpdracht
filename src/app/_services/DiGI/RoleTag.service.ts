import { DiGiInstellingenService } from "./../DiGiInstellingen.service";
import { DBRoleTag } from "./../../Models/DiGi/DbModels/DBRoleTag";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class RoleTagService {
  constructor(
    private http: HttpClient,
    private digiSetup: DiGiInstellingenService
  ) {}

  // CREATE
  async Create(obj: DBRoleTag) {
    const result = this.http
      .request("Post", this.digiSetup.DigiApiPath + "/api/RoleTag", {
        body: obj
      })
      .toPromise();
    return result;
  }

  // READ
  async GetAll() {
    // Haal alle Role Tags
    const result = this.http
      .get<DBRoleTag[]>(this.digiSetup.DigiApiPath + "/api/RoleTag")
      .toPromise();
    return result;
  }

  // UPDATE
  async Update(obj: DBRoleTag) {
    const result = this.http
      .request("Put", this.digiSetup.DigiApiPath + "/api/RoleTag", {
        body: obj
      })
      .toPromise();
    return result;
  }

  // DELETE
  async Delete(obj: DBRoleTag) {
    const result = this.http
      .request("delete", this.digiSetup.DigiApiPath + "/api/RoleTag", {
        body: obj
      })
      .toPromise();
    return result;
  }
}
