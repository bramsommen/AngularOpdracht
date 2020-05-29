import { Eventhot } from "./../../Models/HmiEvents/Eventhot";
import { UserService } from "./../user.service";
import { DiGiInstellingenService } from "./../DiGiInstellingen.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class EventHotService {
  constructor(
    private http: HttpClient,
    private digiSetup: DiGiInstellingenService,
    private userService: UserService
  ) {}

  // CREATE
  async Create(obj: Eventhot) {
    obj.hotId = 0; // Init ID (wordt toegekend door DB
    obj.event = null;
    const result = this.http
      .request("Post", this.digiSetup.EventsApiPath + "/api/EventHot", {
        body: obj,
      })
      .toPromise();
    return result;
  }

  // READ
  async GetfromID(id: number) {
    // Haal alle Role Tags
    const result = this.http
      .get<Eventhot[]>(
        this.digiSetup.EventsApiPath + "/api/EventHot/GetFromID",
        {
          params: {
            strID: id.toString(),
          },
        }
      )

      .toPromise();
    return result;
  }

  async GetFromApp(appName: string) {
    // Haal alle Role Tags
    const result = this.http
      .get<Eventhot[]>(
        this.digiSetup.EventsApiPath + "/api/EventHot/GetFromApp",
        {
          params: {
            _appName: appName,
          },
        }
      )

      .toPromise();
    return result;
  }

  // UPDATE
  async Update(obj: Eventhot) {
    const result = this.http
      .request("Put", this.digiSetup.EventsApiPath + "/api/EventHot", {
        body: obj,
      })
      .toPromise();
    return result;
  }

  // DELETE
  async Delete(obj: Eventhot) {
    const result = this.http
      .request("delete", this.digiSetup.EventsApiPath + "/api/EventHot", {
        body: obj,
      })
      .toPromise();
    return result;
  }
}
