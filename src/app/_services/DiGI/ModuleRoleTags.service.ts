import { DiGiInstellingenService } from "./../DiGiInstellingen.service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { DBModuleRolesTag } from "src/app/Models/DiGi/DbModels/DBModuleRolesTag";

@Injectable({
  providedIn: "root"
})
export class ModuleRoleTagsService {
  constructor(
    private http: HttpClient,
    private digiSetup: DiGiInstellingenService
  ) {}

  // CREATE
  async Create(obj: DBModuleRolesTag) {
    const result = this.http
      .request("Post", this.digiSetup.DigiApiPath + "/api/ModuleRoleTags", {
        body: obj
      })
      .toPromise();
    return result;
  }

  // READ
  async GetFromModule(moduleId: number) {
    // Haal alle Role Tags van één module
    const result = this.http
      .get<DBModuleRolesTag[]>(
        this.digiSetup.DigiApiPath + "/api/ModuleRoleTags",
        {
          params: {
            moduleIdString: moduleId.toString()
          }
        }
      )
      .toPromise();
    return result;
  }

  // UPDATE
  async Update(obj: DBModuleRolesTag) {
    const result = this.http
      .request("Put", this.digiSetup.DigiApiPath + "/api/ModuleRoleTags", {
        body: obj
      })
      .toPromise();
    return result;
  }

  // DELETE
  async Delete(obj: DBModuleRolesTag) {
    const result = this.http
      .request("delete", this.digiSetup.DigiApiPath + "/api/ModuleRoleTags", {
        body: obj
      })
      .toPromise();
    return result;
  }
}
