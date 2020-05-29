import { App } from "./../../../../Models/DiGi/App";
import { DigiActiveUser } from "./../../../../Models/DiGi/DigiActiveUser";
import { UserService } from "./../../../../_services/user.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-appHome",
  templateUrl: "./appHome.component.html",
  styleUrls: ["./appHome.component.css"]
})
export class AppHomeComponent implements OnInit {
  gebruiker: DigiActiveUser; // Actieve gebruiker

  app: App; // Actieve app

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.gebruiker = this.userService.staticActiveUserProfile;
    this.app = this.userService.staticActiveApp;
  }
}
