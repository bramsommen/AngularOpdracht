import { DiGiModule } from "./../Models/DiGi/DiGiModule";
import { DigiActiveUser } from "./../Models/DiGi/DigiActiveUser";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { UserService } from "../_services/user.service";
import { App } from "../Models/DiGi/App";
import { Router } from "@angular/router";

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.css"],
})
export class NavComponent implements OnInit, OnDestroy {
  constructor(private userService: UserService, private router: Router) {}

  gebruiker: DigiActiveUser; // Actieve gebruiker

  app: App; // Actieve app

  openModele: DiGiModule;
  activeModules: DiGiModule[] = []; // Actieve rij met modules
  activeMenuLevel: LevelModules[] = []; // Lijst van doorgeklikte menu's

  menuVisible: boolean;

  ngOnInit() {
    this.app = null;
    this.openModele = null;
    this.gebruiker = null;

    // Als er een update is van een gebruikers profile, pas dan de menu balk aan
    this.userService.activeUserProfile.subscribe(
      (value: DigiActiveUser) => (this.gebruiker = value)
    );

    // Gekozen app inlezen
    this.userService.activeApp.subscribe(
      (value: App) => ((this.app = value), (this.activeModules = value.modules))
    );
  }

  showNavigatie() {
    this.menuVisible = true;
  }

  hideNavigatie() {
    this.menuVisible = false;
  }

  ngOnDestroy() {
    console.log("Component destroyed");
  }

  OpenModule(parentModule: DiGiModule) {
    if (parentModule.childModules.length !== 0) {
      // Wis Alle onderliggende menu's van crumble
      const idx = this.activeMenuLevel.findIndex(
        (x) => x.parentModule.id === parentModule.id
      );

      if (idx >= 0) {
        // De aangeklikte module is gevonden in de cruble lijst
        const aantalTeWissen = this.activeMenuLevel.length - idx;

        // verwijder alle onderliggen menu items
        this.activeMenuLevel.splice(idx, aantalTeWissen);
      }

      // Vorig niveau toevoegen aan levelList
      const oldLevelModules = new LevelModules();
      oldLevelModules.parentModule = parentModule;
      oldLevelModules.modules = this.activeModules;
      this.activeMenuLevel.push(oldLevelModules);

      // Onderliggend menu openen
      this.activeModules = parentModule.childModules;
    }

    if (parentModule.angularComponent != null) {
      if (parentModule.angularComponent != "") {
        this.router.navigate([parentModule.angularComponent]);
        this.openModele = parentModule;
        this.menuVisible = false;
      }
    }
  }

  GoToUpMenu() {
    // Zoek of de huduige module rij inhoud heeft
    if (this.activeMenuLevel.length == 0) {
      return;
    }

    // Het vorige menu inladen
    this.activeModules = this.activeMenuLevel[
      this.activeMenuLevel.length - 1
    ].modules;

    // Verwijderen van huidig niveau
    this.activeMenuLevel.splice(this.activeMenuLevel.length - 1, 1);
  }

  GotToAppRoot() {
    this.activeModules = this.app.modules;

    if (this.activeMenuLevel.length !== 0) {
      // Clear sub menu's
      this.activeMenuLevel.splice(0, this.activeMenuLevel.length);
    }
  }

  GoToApps() {
    this.router.navigate(["home/"]);
    this.activeMenuLevel.splice(0, this.activeMenuLevel.length);
    this.activeModules = null;
    this.app = null;
    this.openModele = null;
  }
}

export class LevelModules {
  parentModule: DiGiModule;
  modules: DiGiModule[] = [];
}
