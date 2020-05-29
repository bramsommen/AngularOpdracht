import { DiGiInstellingenService } from "./../DiGiInstellingen.service";
import { UserService } from "./../user.service";
import { Injectable } from "@angular/core";
import * as signalR from "@microsoft/signalr";

@Injectable({
  providedIn: "root",
})
export class KepServerLiveService {
  hubConnection: signalR.HubConnection;

  constructor(
    private digiSetup: DiGiInstellingenService,
    private userService: UserService
  ) {}

  public StartLiveData() {
    // Create hub connection
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.digiSetup.KepserverLivePath + "/KepserverLiveHub")
      .withAutomaticReconnect()
      .build();
  }

  public StopLiveData() {
    this.hubConnection.stop().then((x) => {
      //
    });
  }
}
