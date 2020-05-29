import { Eventdefinitie } from "./../../Models/HmiEvents/Eventdefinitie";
import { HttpClient } from "@angular/common/http";
import { DiGiInstellingenService } from "./../DiGiInstellingen.service";
import { UserService } from "./../user.service";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class EventDefinitieService {
  constructor(
    private http: HttpClient,
    private digiSetup: DiGiInstellingenService,
    private userService: UserService
  ) {}

  // CREATE
  async Create(obj: Eventdefinitie) {
    obj.eventId = 0; // Init ID (wordt toegekend door DB

    const result = this.http
      .request("Post", this.digiSetup.EventsApiPath + "/api/Eventdefinitie", {
        body: obj,
      })
      .toPromise();
    return result;
  }

  // READ
  async Get(appNaam: string) {
    // Haal alle Role Tags
    const result = this.http
      .get<Eventdefinitie[]>(
        this.digiSetup.EventsApiPath + "/api/Eventdefinitie",
        {
          params: {
            _appNaam: appNaam,
          },
        }
      )

      .toPromise();
    return result;
  }

  async GetFromID(id: number) {
    // Haal alle Role Tags
    const result = this.http
      .get<Eventdefinitie>(
        this.digiSetup.EventsApiPath + "/api/Eventdefinitie/GetFromID",
        {
          params: {
            strID: id.toString(),
          },
        }
      )

      .toPromise();
    return result;
  }

  // UPDATE
  async Update(obj: Eventdefinitie) {
    const result = this.http
      .request("Put", this.digiSetup.EventsApiPath + "/api/Eventdefinitie", {
        body: obj,
      })
      .toPromise();
    return result;
  }

  // DELETE
  async Delete(obj: Eventdefinitie) {
    const result = this.http
      .request("delete", this.digiSetup.EventsApiPath + "/api/Eventdefinitie", {
        body: obj,
      })
      .toPromise();
    return result;
  }
}
