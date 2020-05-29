import { App } from "./../Models/DiGi/App";
import { Component, OnInit } from "@angular/core";
import { SessionService } from "../_services/session.service";
import { UserService } from "../_services/user.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DigiActiveUser } from "../Models/DiGi/DigiActiveUser";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  // PROPERTIES
  Routering: string; // Afkomst routering ovragen uit URL
  Apps: App[]; // Alle apps van de aangemelde gebruiker

  constructor(
    private userService: UserService,
    private rt: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Inlezen van  de gebruiker zijn apps
    this.Apps = this.userService.staticActiveUserProfile.apps;

    // Lezen van pool naam dat werd meegegeven door routering
    this.Routering = this.rt.snapshot.paramMap.get("poolName");
  }

  openApp(app: App) {
    this.userService.activeApp.next(app); // Gekozen app instellen

    // App Home openen
    this.router.navigate(["/appHome/"]);
  }
}
