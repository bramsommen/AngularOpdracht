import { EventsLiveService } from "./../../../../_services/HmiEvents/Live Hubs/EventsLive.service";
import { UserService } from "./../../../../_services/user.service";
import { Eventhot } from "./../../../../Models/HmiEvents/Eventhot";
import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";

@Component({
  selector: "app-EventsLive",
  templateUrl: "./EventsLive.component.html",
  styleUrls: ["./EventsLive.component.css"],
})
export class EventsLiveComponent implements OnInit {
  // PROPS
  lstObjects: Eventhot[] = [];

  constructor(
    private eventsLiveService: EventsLiveService,
    private userService: UserService
  ) {}

  ngOnInit() {
    // Start Live update data
    this.eventsLiveService.StartLiveData();

    this.MapAbservableData();
  }

  MapAbservableData() {
    // De ontvangen data uit de LIVE Service mappen naar local
    this.eventsLiveService.lstObjects.subscribe((x) => {
      this.lstObjects = x;

      for (let item of this.lstObjects) {
        item.onTime = new Date(Date.parse(item.onTime.toString()));
      }
    });
  }

  // Bij het verlaten van deze pagina, dispose alles "Live" resources
  @HostListener("unloaded")
  ngOnDestroy() {
    console.log("Component destroyed");
    this.eventsLiveService.StopLiveDate();
    this.lstObjects = null;
  }
}
