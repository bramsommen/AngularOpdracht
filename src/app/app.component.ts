import { KepServerLiveService } from "./_services/KepserverLive/KepServerLive.service";
import { App } from "./Models/DiGi/App";
import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { Router, Event, ActivatedRoute, NavigationEnd } from "@angular/router";
import { SessionService } from "./_services/session.service";
import { UserService } from "./_services/user.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  change: EventEmitter<void> = new EventEmitter<void>();

  constructor(private sessionService: SessionService) {
    // Inlezen van URL om op te zoeken vanuit welke Pool er gestart moet worden.
    this.sessionService.GetPoolName();
  }
}
