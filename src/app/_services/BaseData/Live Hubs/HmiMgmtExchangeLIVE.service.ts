import { Subject } from "rxjs";
import { HmiMgmtExchangeService } from "./../HmiMgmtExchange.service";
import { UserService } from "./../../user.service";
import { DiGiInstellingenService } from "./../../DiGiInstellingen.service";
import { BaseDataHmiMgmtExchange } from "./../../../Models/BaseData/BaseDataHmiMgmtExchange";
import { Injectable } from "@angular/core";
import * as signalR from "@microsoft/signalr";

@Injectable({
  providedIn: "root",
})
export class HmiMgmtExchangeLIVEService {
  public lstHmiMgmtValues: Subject<BaseDataHmiMgmtExchange[]>; // LIVE ResultaatLijst

  hubConnection: signalR.HubConnection;

  constructor(
    private digiSetup: DiGiInstellingenService,
    private hmiMgmtExchangeService: HmiMgmtExchangeService,
    private userService: UserService
  ) {
    // Init LIVE List
    this.lstHmiMgmtValues = new Subject();
  }

  public StartLiveData() {
    // Create hub connection
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.digiSetup.BaseDataApiPath + "/HmiMgmtExchangeHub")
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
    this.GetFromMachine();
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
    this.hubConnection.on("DeletedItem", (obj: BaseDataHmiMgmtExchange) => {
      //
      // Todo after Delete
      //
      console.log("Delete Event");

      // Reload list
      this.GetFromMachine();
    });

    // INSERT ACTION ON DB
    this.hubConnection.on("InsertedItem", (obj: BaseDataHmiMgmtExchange) => {
      //
      // Todo after Instert
      //
      console.log("Instert Event");

      // Reload list
      this.GetFromMachine();
    });

    // UPDATE ACTION ON DB
    this.hubConnection.on("UpdatedItem", (obj: BaseDataHmiMgmtExchange) => {
      //
      // Todo After Update
      //
      console.log("Update Event");

      // Reload list
      this.GetFromMachine();
    });
  }

  public RefreshHmiMgmtList() {
    this.GetFromMachine();
  }

  //GET
  private GetFromMachine() {
    this.hmiMgmtExchangeService.GetFromMachine().then((x) => {
      this.lstHmiMgmtValues.next(x);
    });
  }
}
