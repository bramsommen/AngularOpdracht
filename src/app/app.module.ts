import { KepServerLiveDemoComponent } from "./Apps/KepServerLiveDemo/KepServerLiveDemo/KepServerLiveDemo.component";
import { ArtikelBeheerComponent } from "./Apps/Dynamic/BaseData/ArtikelManager/ArtikelBeheer/ArtikelBeheer.component";
import { EventsLiveComponent } from "./Apps/Dynamic/HmiEvents/EventsLive/EventsLive.component";
import { EventsJournaalComponent } from "./Apps/Dynamic/HmiEvents/EventsJournaal/EventsJournaal.component";
import {
  EventsDefinitiesComponent,
  MyFilterPipe,
} from "./Apps/Dynamic/HmiEvents/EventsDefinities/EventsDefinities.component";
import { RushOrderComponent } from "./Apps/Lascellen/LASCELA__003/RushOrder/RushOrder.component";
import { HmiMgmtExchangeCrudComponent } from "./Apps/Dynamic/BaseData/HmiMgmtExchangeCrud/HmiMgmtExchangeCrud.component";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { RobotProgrammaCrudComponent } from "./Apps/Lascellen/LASCELA__003/RobotProgrammaCrud/RobotProgrammaCrud.component";
import { MachineOnderdeelSelectorComponent } from "./Apps/Dynamic/BaseData/Macros/MachineOnderdeelSelector/MachineOnderdeelSelector.component";
import { BaseDataMachineOnderdeelCrudComponent } from "./Apps/Dynamic/BaseData/BaseDataMachineOnderdeelCrud/BaseDataMachineOnderdeelCrud.component";
import { BaseDataCyclusTypeCrudComponent } from "./Apps/Dynamic/BaseData/BaseDataCyclusTypeCrud/BaseDataCyclusTypeCrud.component";
import { BaseDataProductCrudComponent } from "./Apps/Dynamic/BaseData/BaseDataProductCrud/BaseDataProductCrud.component";
import { MaakInstellingenCrudComponent } from "./Apps/Dynamic/BaseData/MaakInstellingenCrud/MaakInstellingenCrud.component";
import { CyclusCrudComponent } from "./Apps/Dynamic/BaseData/CyclusCrud/CyclusCrud.component";
import { BaseDataEigenschapCrudComponent } from "./Apps/Dynamic/BaseData/BaseDataEigenschapCrud/BaseDataEigenschapCrud.component";
import { GebuikersAppsEditorComponent } from "./Apps/DiGi/DiGiAdmin/DigiGebruikersBeheer/GebuikersAppsEditor/GebuikersAppsEditor.component";
import { AppModulesComponent } from "./Apps/DiGi/DiGiAdmin/UiConfig/AppModules/AppModules.component";
import { AppCrudComponent } from "./Apps/DiGi/DiGiAdmin/UiConfig/AppCrud/AppCrud.component";
import { ModuleCrudComponent } from "./Apps/DiGi/DiGiAdmin/UiConfig/ModuleCrud/ModuleCrud.component";
import { RoleTagCrudComponent } from "./Apps/DiGi/DiGiAdmin/UiConfig/RoleTagCrud/RoleTagCrud.component";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { RouterModule } from "@angular/router";
import { appRoutes } from "./routes";
import { SessionService } from "./_services/session.service";
import { NavComponent } from "./nav/nav.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { HttpClientModule } from "@angular/common/http";
import { AppHomeComponent } from "./Apps/Dynamic/DiGi/appHome/appHome.component";

import { AgGridModule } from "ag-grid-angular";

// MQTT CLIENT
import { MqttModule, IMqttServiceOptions } from "ngx-mqtt";

export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: "192.168.0.120",
  port: 9001,
  // path: "/mqtt",
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    NavComponent,
    AppHomeComponent,
    RoleTagCrudComponent,
    ModuleCrudComponent,
    AppCrudComponent,
    AppModulesComponent,
    GebuikersAppsEditorComponent,
    BaseDataEigenschapCrudComponent,
    CyclusCrudComponent,
    MaakInstellingenCrudComponent,
    BaseDataProductCrudComponent,
    BaseDataCyclusTypeCrudComponent,
    BaseDataMachineOnderdeelCrudComponent,
    MachineOnderdeelSelectorComponent,
    RobotProgrammaCrudComponent,
    HmiMgmtExchangeCrudComponent,
    RushOrderComponent,
    EventsDefinitiesComponent,
    EventsJournaalComponent,
    EventsLiveComponent,
    MyFilterPipe,
    ArtikelBeheerComponent,
    KepServerLiveDemoComponent,
  ],
  imports: [
    BrowserModule,

    ReactiveFormsModule,

    AgGridModule.withComponents(),

    MqttModule.forRoot(MQTT_SERVICE_OPTIONS), // MQTT

    FormsModule, // noodzakelijk voor ngModule te gebruiken
    Ng2SearchPipeModule, // Zoek functie
    HttpClientModule, // Http client
    RouterModule.forRoot(appRoutes), //Routeringnaarcomponentdoorroutes.ts
  ],
  providers: [SessionService],
  bootstrap: [AppComponent],
})
export class AppModule {}
