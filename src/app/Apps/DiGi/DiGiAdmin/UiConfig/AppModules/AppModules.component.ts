import { DiGiModuleService } from "./../../../../../_services/DiGI/DiGiModule.service";
import { DBAppModules } from "src/app/Models/DiGi/DbModels/DbAppModules";
import { DiGiModule } from "./../../../../../Models/DiGi/DiGiModule";
import { AppModuleService } from "./../../../../../_services/DiGI/AppModule.service";
import { AppModule } from "./../../../../../app.module";
import { AppsService } from "./../../../../../_services/DiGI/Apps.service";
import { DBModule } from "./../../../../../Models/DiGi/DbModels/DBModule";
import { DBApp } from "./../../../../../Models/DiGi/DbModels/DBApp";
import { Component, OnInit } from "@angular/core";
import { ThrowStmt } from "@angular/compiler";

@Component({
  selector: "app-AppModules",
  templateUrl: "./AppModules.component.html",
  styleUrls: ["./AppModules.component.css"]
})
export class AppModulesComponent implements OnInit {
  apps: DBApp[] = []; // Lijst van beschikbare Applicaties
  modules: DBModule[] = [];
  app: DBApp; // Selected App
  activeParentModule: DBModule; // Actieve parent module
  childModules: DBAppModules[] = []; // Lijst van kinderen van Parent

  constructor(
    private appService: AppsService,
    private moduleService: DiGiModuleService,
    private AppModuleService: AppModuleService
  ) {}

  ngOnInit() {
    this.Refresh();
  }

  // READ
  Refresh() {
    // Init All
    this.apps = [];
    this.app = null;
    this.activeParentModule = null;
    this.childModules = [];

    // Inlezen van alle bestaande Apps
    this.appService.GetAll().then((obj: DBApp[]) => {
      // Er is reactie van de server, navigeer indien geldig
      if (obj != null) {
        console.log("Er zijn " + obj.length + " Objecten uit DB ingelezen");
        //
        // Set list to component
        //
        this.apps = obj;
      } else {
        console.log("Geen data gevonden in database");
      }
    });

    // Inlezen van alle bestaande modules
    this.moduleService.GetAll().then((obj: DBModule[]) => {
      // Er is reactie van de server, navigeer indien geldig
      if (obj != null) {
        console.log("Er zijn " + obj.length + " Objecten uit DB ingelezen");
        //
        // Set list to component
        //
        this.modules = obj;
      } else {
        console.log("Geen data gevonden in database");
      }
    });
  }

  SelectApp(app: DBApp) {
    this.app = app; // Selected app instellen

    // Als de parant NULL is moet het hoogste menu niveau worden ingeladen, hiervoor moet ID 0 naar de API worden gestuurd
    // Aanmaken object met ID 0
    this.activeParentModule = new DBModule();
    this.activeParentModule.id = 0;
    this.activeParentModule.naam = "Hoofd Menu";

    this.LoadChildModules(); // inlezen van kinderen
  }

  LoadChildModules() {
    // Inlezen van child modules
    this.AppModuleService.GetFromModule(
      this.app.id,
      this.activeParentModule.id
    ).then(resultObj => {
      // Load children
      this.childModules = resultObj;
    });
  }

  LoadHoofdMenu() {
    this.activeParentModule = new DBModule();
    this.activeParentModule.id = 0;
    this.activeParentModule.naam = "Hoofd Menu";

    this.LoadChildModules(); // inlezen van kinderen
  }

  SelectParent(obj: DBAppModules) {
    // Selecteer parent
    this.activeParentModule = obj.module; // Set nieuw active parent

    this.LoadChildModules();
  }

  //Delete Module from App
  DeleteAppModule(obj: DBAppModules) {
    if (
      confirm(
        "Bent u zeker dat u deze appModule en alle onderliggende appModules wil verwijderen? De modules zelf worden niet verwijderd, enkel de orientering binnen de applicatie."
      )
    ) {
      this.AppModuleService.Delete(obj).then(resultObj => {
        // Opslaan is verwerkt
        // opnieuw inlezen van
        this.LoadChildModules();
      });
    }
  }

  AddModuleToParent(
    obj: DiGiModule // Toevoegen van module aan App
  ) {
    if (this.app === null) {
      alert("Geen applicatie geselecteerd");
      return;
    }

    if (this.activeParentModule === null) {
      alert("Geen parent geselecteerd");
      return;
    }

    if (obj.id === this.activeParentModule.id) {
      alert("Niet mogelijk, module is dezelfde als de parent module");
      return;
    }

    // Zoek naar hoogste sorteer waarde
    var hoogsteSortWaarde = 0;

    if (this.childModules.length > 0) {
      hoogsteSortWaarde = this.childModules[this.childModules.length - 1]
        .sortNumber;
    }

    // Init AppModule
    const newAppModule = new DBAppModules();
    newAppModule.moduleId = obj.id;
    newAppModule.appsId = this.app.id;
    newAppModule.sortNumber = hoogsteSortWaarde + 1; // Neem hoogste sorteer nummer in lijst en tel hier één bij op

    if (this.activeParentModule.id === 0) {
      // Hoofd parent "Main Menu"
      newAppModule.parentModuleId = null;
    } else {
      newAppModule.parentModuleId = this.activeParentModule.id;
    }

    // Voeg nieuw App Module toe aan Database
    this.AppModuleService.Create(newAppModule).then(objResult => {
      // Als module is toegevoegd, laad dan opnieuw de kinderen van de de geslectereede parent
      this.LoadChildModules();

      // Scroll naar edit window
      window.scrollTo(0, 0);
    });
  }

  MoveChildDown(obj: DBAppModules) {
    // Huidige positie opvragen van geselecteerde module
    const myIndex = this.childModules.findIndex(x => x.id === obj.id);

    if (myIndex === 0) {
      // Ik ben de eerset positie, dus kan niet meer hoger, doe niets
      return;
    }

    const mySortPos = this.childModules[myIndex].sortNumber;
    const beforeSortPos = this.childModules[myIndex - 1].sortNumber;

    // Aanpassingen schrijven naar database
    this.childModules[myIndex].sortNumber = beforeSortPos; // Swap sort number met volgende in rij

    this.AppModuleService.Update(this.childModules[myIndex]).then(result => {
      this.childModules[myIndex - 1].sortNumber = mySortPos; // swap sort number met geselecteerd object
      this.AppModuleService.Update(this.childModules[myIndex - 1]).then(
        res2 => {
          // Beide zijn bijgewerkt, laad kinderen opnieuw
          this.LoadChildModules();
        }
      );
    });
  }

  MoveChildUp(obj: DBAppModules) {
    // Huidige positie opvragen van geselecteerde module
    const myIndex = this.childModules.findIndex(x => x.id === obj.id);
    console.log("Positie: " + myIndex.toString());

    if (myIndex === this.childModules.length - 1) {
      // Ik ben de laatste positie, dus kan niet meer hoger, doe niets
      return;
    }

    const mySortPos = this.childModules[myIndex].sortNumber;
    const nextSortPos = this.childModules[myIndex + 1].sortNumber;

    // Aanpassingen schrijven naar database
    this.childModules[myIndex].sortNumber = nextSortPos; // Swap sort number met volgende in rij
    this.AppModuleService.Update(this.childModules[myIndex]).then(result => {
      this.childModules[myIndex + 1].sortNumber = mySortPos; // swap sort number met geselecteerd object
      this.AppModuleService.Update(this.childModules[myIndex + 1]).then(
        res2 => {
          // Beide zijn bijgewerkt, laad kinderen opnieuw
          this.LoadChildModules();
        }
      );
    });
  }
}
