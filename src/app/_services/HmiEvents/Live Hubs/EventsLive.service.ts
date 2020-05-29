import { UserService } from "./../../user.service";
import { EventHotService } from "./../EventHot.service";
import { DiGiInstellingenService } from "./../../DiGiInstellingen.service";
import { Eventhot } from "./../../../Models/HmiEvents/Eventhot";
import { Subject } from "rxjs";
import { Injectable } from "@angular/core";
import * as signalR from "@microsoft/signalr";

@Injectable({
  providedIn: "root",
})
export class EventsLiveService {
  public lstObjects: Subject<Eventhot[]>; // LIVE ResultaatLijst

  hubConnection: signalR.HubConnection;

  constructor(
    private digiSetup: DiGiInstellingenService,
    private eventHotService: EventHotService,
    private userService: UserService
  ) {
    // Init LIVE List
    this.lstObjects = new Subject();
  }

  public StartLiveData() {
    // Create hub connection
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.digiSetup.EventsApiPath + "/EventsLiveHub")
      .withAutomaticReconnect()
      .build();

    // Start Hub Connection
    this.hubConnection
      .start()
      .then((X) => {
        // Client toevoegen aan HUB groep
        this.AddToGroup();

        console.log("Connected! With Hub");
      })
      .catch(function (err) {
        return console.error(err.toString());
      });

    // Set Hub Events
    this.HubEvents();
  }

  AddToGroup() {
    // Mezelf toevoegen aan een applicatie groep
    this.hubConnection.invoke(
      "AddToGroup",
      this.userService.staticActiveApp.machine
    );

    // Data opnieuw inladen
    this.GetData();
  }

  public StopLiveDate() {
    this.hubConnection.stop();
    this.hubConnection = null;
  }

  private HubEvents() {
    // Bij reconnecten
    this.hubConnection.onreconnected((x) => {
      // Load/Refresh List
      this.AddToGroup();
    });

    // Bij sluiten van connection
    this.hubConnection.onclose((x) => {
      console.log("hub connectie is gesloten");
    });

    // DELETE ACTION ON DB
    this.hubConnection.on("DeletedItem", (obj: Eventhot) => {
      //
      // Todo after Delete
      //
      console.log("Delete Event");

      // Reload list
      this.GetData();
    });

    // INSERT ACTION ON DB
    this.hubConnection.on("InsertedItem", (obj: Eventhot) => {
      //
      // Todo after Instert
      //
      console.log("Instert Event");

      // Reload list
      this.GetData();
    });

    // UPDATE ACTION ON DB
    this.hubConnection.on("UpdatedItem", (obj: Eventhot) => {
      //
      // Todo After Update
      //
      console.log("Update Event");

      // Reload list
      this.GetData();
    });
  }

  public RefreshData() {
    this.GetData();
  }

  //GET
  private GetData() {
    this.eventHotService
      .GetFromApp(this.userService.staticActiveApp.machine)
      .then((x) => {
        this.lstObjects.next(x);
      });
  }
}
