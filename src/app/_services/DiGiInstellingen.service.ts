import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class DiGiInstellingenService {
  constructor() {}
  // DiGI UI API
  // Menu's User handling, apps, modules
  DigiApiPath: string = "http://192.168.0.199:8083";

  // Productie Base Data API
  // Product base data
  // BaseDataApiPath: string = "https://localhost:44377";
  BaseDataApiPath: string = "http://192.168.0.199:8084"; // SIRIUS IIS

  // Lascellen API
  // LascellenApiPath: string = "http://localhost:51755";
  LascellenApiPath: string = "http://192.168.0.199:8085"; // SIRIUS IIS

  // Events API
  //  EventsApiPath: string = "http://localhost:51755";
  EventsApiPath: string = "http://192.168.0.199:8086";

  // KepserverLive API
  // KepserverLivePath: string = "http://localhost:51755";
  KepserverLivePath: string = "http://192.168.0.199:8087";
}
