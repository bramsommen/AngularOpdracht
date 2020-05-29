import { KepServerLiveDemoComponent } from "./Apps/KepServerLiveDemo/KepServerLiveDemo/KepServerLiveDemo.component";
import { ArtikelBeheerComponent } from "./Apps/Dynamic/BaseData/ArtikelManager/ArtikelBeheer/ArtikelBeheer.component";
import { EventsJournaalComponent } from "./Apps/Dynamic/HmiEvents/EventsJournaal/EventsJournaal.component";
import { EventsLiveComponent } from "./Apps/Dynamic/HmiEvents/EventsLive/EventsLive.component";
import { EventsDefinitiesComponent } from "./Apps/Dynamic/HmiEvents/EventsDefinities/EventsDefinities.component";
import { RushOrderComponent } from "./Apps/Lascellen/LASCELA__003/RushOrder/RushOrder.component";
import { HmiMgmtExchangeCrudComponent } from "./Apps/Dynamic/BaseData/HmiMgmtExchangeCrud/HmiMgmtExchangeCrud.component";
import { RobotProgrammaCrudComponent } from "./Apps/Lascellen/LASCELA__003/RobotProgrammaCrud/RobotProgrammaCrud.component";
import { BaseDataMachineOnderdeelCrudComponent } from "./Apps/Dynamic/BaseData/BaseDataMachineOnderdeelCrud/BaseDataMachineOnderdeelCrud.component";
import { BaseDataCyclusTypeCrudComponent } from "./Apps/Dynamic/BaseData/BaseDataCyclusTypeCrud/BaseDataCyclusTypeCrud.component";
import { BaseDataProductCrudComponent } from "./Apps/Dynamic/BaseData/BaseDataProductCrud/BaseDataProductCrud.component";
import { MaakInstellingenCrudComponent } from "./Apps/Dynamic/BaseData/MaakInstellingenCrud/MaakInstellingenCrud.component";
import { CyclusCrudComponent } from "./Apps/Dynamic/BaseData/CyclusCrud/CyclusCrud.component";
import { BaseDataEigenschapCrudComponent } from "./Apps/Dynamic/BaseData/BaseDataEigenschapCrud/BaseDataEigenschapCrud.component";
import { AppModulesComponent } from "./Apps/DiGi/DiGiAdmin/UiConfig/AppModules/AppModules.component";
import { AppCrudComponent } from "./Apps/DiGi/DiGiAdmin/UiConfig/AppCrud/AppCrud.component";
import { ModuleCrudComponent } from "./Apps/DiGi/DiGiAdmin/UiConfig/ModuleCrud/ModuleCrud.component";
import { RoleTagCrudComponent } from "./Apps/DiGi/DiGiAdmin/UiConfig/RoleTagCrud/RoleTagCrud.component";
import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { HomeComponent } from "./home/home.component";
import { AppHomeComponent } from "./Apps/Dynamic/DiGi/appHome/appHome.component";
import { GebuikersAppsEditorComponent } from "./Apps/DiGi/DiGiAdmin/DigiGebruikersBeheer/GebuikersAppsEditor/GebuikersAppsEditor.component";

export const appRoutes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "home", component: HomeComponent },
  { path: "home/:poolName", component: HomeComponent },

  // DIGI ADMIN
  { path: "DiGiAdmin/RoleTagCrud", component: RoleTagCrudComponent },
  { path: "DiGiAdmin/ModuleCrud", component: ModuleCrudComponent },
  { path: "DiGiAdmin/AppCrud", component: AppCrudComponent },
  { path: "DiGiAdmin/AppCrud", component: AppCrudComponent },
  { path: "DiGiAdmin/AppModulesCrud", component: AppModulesComponent },

  // Base Data (Dynamic op  basis van Poolnaam)
  {
    path: "BaseData/EigenschapCRUD",
    component: BaseDataEigenschapCrudComponent,
  },
  { path: "BaseData/CyclusCRUD", component: CyclusCrudComponent },
  {
    path: "BaseData/BaseDataCyclusTypeCrud",
    component: BaseDataCyclusTypeCrudComponent,
  },
  {
    path: "BaseData/MaakInstellingenCrud",
    component: MaakInstellingenCrudComponent,
  },
  // Base Data Product editor
  {
    path: "BaseData/BaseDataProductCrud",
    component: BaseDataProductCrudComponent,
  },

  // Machine onderdeel CRUD
  {
    path: "BaseData/MachineOnderdeel",
    component: BaseDataMachineOnderdeelCrudComponent,
  },

  // Base Data - Hmi vs Mgmt Exchange
  {
    path: "BaseData/HmiMgmtExchangeCrudComponent",
    component: HmiMgmtExchangeCrudComponent,
  },

  // Lascellen Robot programma bewerken
  {
    path: "Lascellen/RobotProgrammaCrud",
    component: RobotProgrammaCrudComponent,
  },

  // Rush order venster
  {
    path: "Lascellen/RushOrder",
    component: RushOrderComponent,
  },

  // Digi Gebruikers App
  {
    path: "DiGiAdmin/GebuikersAppsEditor",
    component: GebuikersAppsEditorComponent,
  },

  // ARTIKEL MANAGER
  //Artikel Beheer
  {
    path: "ArtikelManager/ArtikelBeheerComponent",
    component: ArtikelBeheerComponent,
  },

  /// EVENTS
  // Events definities
  {
    path: "Events/EventsDefinitiesComponent",
    component: EventsDefinitiesComponent,
  },

  // Events LIVE
  {
    path: "Events/EventsLiveComponent",
    component: EventsLiveComponent,
  },

  // Eventsjournaal
  {
    path: "Events/EventsJournaalComponent",
    component: EventsJournaalComponent,
  },

  //KepServerLiveDemoComponent
  {
    path: "Demo/KepServerLiveDemoComponent",
    component: KepServerLiveDemoComponent,
  },

  // COMAU
  { path: "appHome", component: AppHomeComponent },

  { path: "**", redirectTo: "login", pathMatch: "full" },
];
