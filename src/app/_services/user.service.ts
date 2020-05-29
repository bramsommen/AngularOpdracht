import { DiGiInstellingenService } from "./DiGiInstellingen.service";
import { App } from "./../Models/DiGi/App";
import { Injectable, OnInit } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DigiActiveUser } from "../Models/DiGi/DigiActiveUser";

@Injectable({
  providedIn: "root",
})
export class UserService {
  //
  // PROPERTIES
  // public userNameStream: Subject<string>; // Update username

  public activeUserProfile: Subject<DigiActiveUser>; // Active user profiel
  public staticActiveUserProfile: DigiActiveUser;
  //
  public activeApp: Subject<App>;
  public staticActiveApp: App;
  //
  //
  //
  // CONSTRUCTOR
  constructor(
    private http: HttpClient,
    private digiSetup: DiGiInstellingenService
  ) {
    this.activeUserProfile = new Subject();

    // Als er een nieuwe gebruiker wordt geactiveer, laad deze in de App
    this.activeUserProfile.subscribe(
      (value: DigiActiveUser) => (this.staticActiveUserProfile = value)
    );
    //
    // Als er een nieuwe app wordt geselecteerd, laad deze dan
    this.activeApp = new Subject();
    this.activeApp.subscribe((value: App) => (this.staticActiveApp = value));
  }
  //
  //
  //
  //
  //

  //
  // METHODS
  public ValidateLogin(userName: string, paswoord: string): boolean {
    // Valideren van gebruikersnaam en paswoord.
    // Als de server dit goedkeurt dan wordt het volledige user profiel doorgegeven

    return false;
  }

  UnloadApp() {
    //  this.activeApp.next(null);
  }

  async GetUserProfiel(naam: string, paswoord: string) {
    // Haal user van API

    const result = this.http
      .get<DigiActiveUser>(this.digiSetup.DigiApiPath + "/api/DigiActiveUser", {
        params: {
          Naam: naam,
          Paswoord: paswoord,
        },
      })
      .toPromise();
    return result;
  }
}
