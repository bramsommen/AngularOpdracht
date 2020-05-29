import { ClientNodes } from "./../../../Models/KepServerLive/ClientNodes";
import { OpcTagResult } from "./../../../Models/KepServerLive/OpcTagResult";
import { KepServerLiveService } from "./../../../_services/KepserverLive/KepServerLive.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-KepServerLiveDemo",
  templateUrl: "./KepServerLiveDemo.component.html",
  styleUrls: ["./KepServerLiveDemo.component.css"],
})
export class KepServerLiveDemoComponent implements OnInit {
  constructor(private kepserverLive: KepServerLiveService) {}

  ngOnInit() {
    this.StartKepServerWatch();
  }

  StartKepServerWatch() {
    // Init Live Kepserver API
    this.kepserverLive.StartLiveData();

    this.TagMethods(); // Activeer methodes, getriggerd door tags

    // Start Live Data
    this.kepserverLive.hubConnection
      .start()
      .then((X) => {
        // Add To monitored Tags
        this.MonitoredTags();

        console.log("Connected! With Hub");
      })
      .catch(function (err) {
        return console.error(err.toString());
      });
  }

  MonitoredTags() {
    const clientNodes = new ClientNodes();
    clientNodes.client = "hmi";
    clientNodes.methode = "merkerStart";

    clientNodes.opctags.push("Comau.PLC.merkertest");

    this.kepserverLive.hubConnection.invoke("AddClientMethodTags", clientNodes);

    //
    //
    //

    const cl2 = new ClientNodes();
    cl2.client = "koko";
    cl2.methode = "josemethode";

    cl2.opctags.push("Comau.PLC.test");
    cl2.opctags.push("Comau.PLC.merkertest");

    this.kepserverLive.hubConnection.invoke("AddClientMethodTags", cl2);
  }

  TagMethods() {
    this.kepserverLive.hubConnection.on("merkerStart", (obj: OpcTagResult) => {
      //
      // Todo After Update
      //
      console.log(obj.tag + " -- " + obj.value);
    });

    this.kepserverLive.hubConnection.on("josemethode", (obj: OpcTagResult) => {
      //
      // Todo After Update
      //

      console.log(obj.tag + " -- " + obj.value);
    });
  }
}
