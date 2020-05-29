import { ClientNodes } from "./../../../../Models/KepServerLive/ClientNodes";
import { OpcTagResult } from "./../../../../Models/KepServerLive/OpcTagResult";
import { KepServerLiveService } from "./../../../../_services/KepserverLive/KepServerLive.service";
import { BaseDataProductService } from "./../../../../_services/BaseData/BaseDataProduct.service";
import { HmiMgmtExchangeService } from "./../../../../_services/BaseData/HmiMgmtExchange.service";
import { BaseDataHmiMgmtExchange } from "./../../../../Models/BaseData/BaseDataHmiMgmtExchange";
import { HmiMgmtExchangeLIVEService } from "./../../../../_services/BaseData/Live Hubs/HmiMgmtExchangeLIVE.service";
import { RobotProgrammaService } from "./../../../../_services/Lascellen/RobotProgramma.service";
import { RobotProgrammaCelA003 } from "./../../../../Models/Lascellen/RobotProgrammaCelA003";
import { UserService } from "./../../../../_services/user.service";
import { RobotProgrammaMachineOnderdeelProductService } from "./../../../../_services/Lascellen/RobotProgrammaMachineOnderdeelProduct.service";
import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";

import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";

@Component({
  selector: "app-RushOrder",
  templateUrl: "./RushOrder.component.html",
  styleUrls: ["./RushOrder.component.css"],
})
export class RushOrderComponent implements OnInit, OnDestroy {
  lstArtikelCodes: string[] = [];

  selectedRobotProgramma: RobotProgrammaCelA003;
  lstRobotProgrammas: RobotProgrammaCelA003[] = [];

  zoekString: string;
  selectedArtikelCode: string;

  ManueelBelegLinks: string;
  ManueelBelegRechts: string;
  ManueelBelegCompleet: string;

  ProgrammaStart: number;
  ReloadMal: number;
  ManueelBelgType: number;

  verzendenVanCode: boolean;

  liveUI: plcStatus;

  constructor(
    private robotProgrammaService: RobotProgrammaService,
    private robotProgrammaMachineOnderdeelProductService: RobotProgrammaMachineOnderdeelProductService,
    private userService: UserService,
    private hmiMgmtExchangeLIVEService: HmiMgmtExchangeLIVEService,
    private hmiMgmtExchangeService: HmiMgmtExchangeService,
    private baseDataProductService: BaseDataProductService,
    private kepserverLive: KepServerLiveService
  ) {}

  ngOnInit() {
    this.liveUI = new plcStatus();

    // Alle beschikbare artikel nummers inlezen
    this.GetArtikelNummers();

    this.StartKepServerWatch();

    // Reset Selected Artikel
    this.selectedArtikelCode = null;

    // Reset Selected Robot programma
    this.selectedRobotProgramma = null;

    // Reset actueel Beleg
    this.ManueelBelegLinks = null;
    this.ManueelBelegRechts = null;
    this.ManueelBelegCompleet = null;

    // Start Live update data
    this.hmiMgmtExchangeLIVEService.StartLiveData();

    // Event New Data
    this.hmiMgmtExchangeLIVEService.lstHmiMgmtValues.subscribe((x) => {
      // Links beleg
      const idxLinks = x.findIndex((x) => x.naam === "ManueelBelegLinks");
      const valueLinks = x[idxLinks].value;
      if (valueLinks !== "") {
        this.ManueelBelegLinks = valueLinks;
        this.verzendenVanCode = false;
      } else {
        this.ManueelBelegLinks = null;
      }
      //
      // Rechts Beleg
      const idxRechts = x.findIndex((x) => x.naam === "ManueelBelegRechts");
      const valueRechts = x[idxRechts].value;
      if (valueRechts !== "") {
        this.ManueelBelegRechts = valueRechts;
        this.verzendenVanCode = false;
      } else {
        this.ManueelBelegRechts = null;
      }
      //
      // Compleet beleg
      const idxCompleet = x.findIndex((x) => x.naam === "ManueelBelegCompleet");
      const valueCompleet = x[idxCompleet].value;
      if (valueCompleet !== "") {
        this.ManueelBelegCompleet = valueCompleet;
        this.verzendenVanCode = false;
      } else {
        this.ManueelBelegCompleet = null;
      }

      // Productie start status
      const idxStartStatus = x.findIndex((x) => x.naam === "ProgrammaStart");
      const valueStartStatus = x[idxStartStatus].value;
      this.ProgrammaStart = Number(valueStartStatus);

      const idxReloadStatus = x.findIndex((x) => x.naam === "ReloadMal");
      const valueReloadStatus = x[idxReloadStatus].value;
      this.ReloadMal = Number(valueReloadStatus);

      const idxManueelBelgType = x.findIndex(
        (x) => x.naam === "ManueelBelegType"
      );
      const valueManueelBelegType = x[idxManueelBelgType].value;
      this.ManueelBelgType = Number(valueManueelBelegType);
    });

    // Load actueel beleg
    this.hmiMgmtExchangeLIVEService.RefreshHmiMgmtList();
  }

  // Bij het verlaten van deze pagina, dispose alles "Live" resources
  @HostListener("unloaded")
  ngOnDestroy() {
    console.log("Component destroyed");
    this.hmiMgmtExchangeLIVEService.StopLiveDate();

    this.kepserverLive.StopLiveData();
  }

  // Ophalen van alle beschikbare artikelcodes
  GetArtikelNummers() {
    this.robotProgrammaMachineOnderdeelProductService
      .GetArtikelCodesFromMachine(this.userService.staticActiveApp.machine)
      .then((x) => {
        this.lstArtikelCodes = x;
      });
  }

  // Dropdown selectie artikel codes + haal robot programma's op uit DB
  SelectArtikelCode(artikelCode: string) {
    // Set selected artikel code
    this.selectedArtikelCode = artikelCode;
    //
    // Reset Selected Robot programma
    this.selectedRobotProgramma = null;

    // Haal alle beschikbare robot programma's op waar deze artikelcode in voorkomt
    this.robotProgrammaService
      .GetFromMachineArtikelCode(
        this.userService.staticActiveApp.machine,
        this.selectedArtikelCode
      )
      .then((x) => {
        this.lstRobotProgrammas = x as RobotProgrammaCelA003[];

        // Opvullen van objecten
        for (let item of this.lstRobotProgrammas) {
          this.FillObject(item);
        }
      });
  }

  // Opvullen van P4 machine config
  FillObject(obj: RobotProgrammaCelA003) {
    if (obj.type === 2) {
      // Links en rechts is belegd

      if (obj.robotProgrammaMachineOnderdeelProduct.length >= 1) {
        // Er zijn 2 mogelijkheden beschikbaar
        // Check Links
        const indexLinks = obj.robotProgrammaMachineOnderdeelProduct.findIndex(
          (x) => x.baseDataMachineOnderdeelId === 1
        );
        if (indexLinks >= 0) {
          // Er is een item gevinden
          obj.malLinks = obj.robotProgrammaMachineOnderdeelProduct[indexLinks];
        } else {
          obj.malLinks = null;
        }

        // Check Rechts
        const indexRechts = obj.robotProgrammaMachineOnderdeelProduct.findIndex(
          (x) => x.baseDataMachineOnderdeelId === 2
        );
        if (indexRechts >= 0) {
          // Er is een item gevinden
          obj.malRechts =
            obj.robotProgrammaMachineOnderdeelProduct[indexRechts];
        } else {
          obj.malRechts = null;
        }
      }
    } else if (obj.type === 1) {
      // Enkele oplegging
      if (obj.robotProgrammaMachineOnderdeelProduct.length === 1) {
        // Fout
        if (
          obj.robotProgrammaMachineOnderdeelProduct[0]
            .baseDataMachineOnderdeelId === 3
        ) {
          obj.malCompleet = obj.robotProgrammaMachineOnderdeelProduct[0];
        }
      }
    } else {
      // Niets
    }
  }

  // Selecteer robot programa
  SelectRobotProgramma(obj: RobotProgrammaCelA003) {
    if (obj.status !== 1) {
      alert(
        "Dit kan niet geproduceerd worden omdat het robot programma nog niet gereed is"
      );
      return;
    }

    const aantalStatusOK = obj.robotProgrammaMachineOnderdeelProduct.filter(
      (x) => x.basedataVersieStatus === 1
    ).length;

    if (obj.robotProgrammaMachineOnderdeelProduct.length !== aantalStatusOK) {
      alert(
        "Dit kan niet geproduceerd worden omdat de base data van één of meerdere stukken niet OK is"
      );
      return;
    }

    //Set Selected Robot Programma
    this.selectedRobotProgramma = obj;

    // Reset Selected Artikel
    this.selectedArtikelCode = null;
  }

  // Verstuur gegevens naar productie
  StartProductie() {
    if (this.ProgrammaStart !== 0) {
      alert("Productie status is niet klaar om nieuw programma te versturen.");
      return;
    }

    // Values
    let valueLinks = "";
    let valueRechts = "";
    let valueCompleet = "";
    let valueManueelBelegType = 0;

    if (this.selectedRobotProgramma == null) {
      alert(
        "Start productie niet mogelijk omdat er geen robot programma is geselecteerd."
      );
      return;
    }

    // CHECK COMPLEET
    if (this.selectedRobotProgramma.type === 1) {
      if (this.selectedRobotProgramma.malCompleet !== null) {
        valueLinks = "";
        valueRechts = "";
        valueManueelBelegType = 3;
        valueCompleet = this.selectedRobotProgramma.malCompleet
          .baseDataProductArtikelCode;
      }
    }

    // CHECK DUO
    if (this.selectedRobotProgramma.type === 2) {
      // Reset ValueCompleet
      valueCompleet = "";

      // CHECK LINKS
      if (this.selectedRobotProgramma.malLinks !== null) {
        valueLinks = this.selectedRobotProgramma.malLinks
          .baseDataProductArtikelCode;
        valueManueelBelegType = 1;
      }

      // CHECK RECHTS
      if (this.selectedRobotProgramma.malRechts !== null) {
        valueRechts = this.selectedRobotProgramma.malRechts
          .baseDataProductArtikelCode;

        // Als er ook een linkse poot aanwezig is, set duo (links+rechts
        if (valueManueelBelegType === 1) {
          // Er is ook een linkse poot aanwezig
          valueManueelBelegType = 4;
        } else {
          valueManueelBelegType = 2;
        }
      }
    }

    // Update value
    // Construct Object LINKS
    const objLinks = new BaseDataHmiMgmtExchange();
    objLinks.id = 0;
    objLinks.machine = this.userService.staticActiveApp.machine;
    objLinks.naam = "ManueelBelegLinks";
    objLinks.omschrijving = "dummy";
    objLinks.value = valueLinks;

    // COnstruct Object Rechts
    const objRechts = new BaseDataHmiMgmtExchange();
    objRechts.id = 0;
    objRechts.machine = this.userService.staticActiveApp.machine;
    objRechts.naam = "ManueelBelegRechts";
    objRechts.omschrijving = "dummy";
    objRechts.value = valueRechts;

    // COnstruct Object Compleet
    const objCompleet = new BaseDataHmiMgmtExchange();
    objCompleet.id = 0;
    objCompleet.machine = this.userService.staticActiveApp.machine;
    objCompleet.naam = "ManueelBelegCompleet";
    objCompleet.omschrijving = "dummy";
    objCompleet.value = valueCompleet;

    // COnstruct Object ProgrammaStart
    const objProgrammaStart = new BaseDataHmiMgmtExchange();
    objProgrammaStart.id = 0;
    objProgrammaStart.machine = this.userService.staticActiveApp.machine;
    objProgrammaStart.naam = "ProgrammaStart";
    objProgrammaStart.omschrijving = "dummy";
    objProgrammaStart.value = "1";

    // Construct Object Manueel Beleg Type
    const objManueelBelegType = new BaseDataHmiMgmtExchange();
    objManueelBelegType.id = 0;
    objManueelBelegType.machine = this.userService.staticActiveApp.machine;
    objManueelBelegType.naam = "ManueelBelegType";
    objManueelBelegType.omschrijving = "dummy";
    objManueelBelegType.value = String(valueManueelBelegType);

    const objManueelBelegRobotProgrammaID = new BaseDataHmiMgmtExchange();
    objManueelBelegRobotProgrammaID.id = 0;
    objManueelBelegRobotProgrammaID.machine = this.userService.staticActiveApp.machine;
    objManueelBelegRobotProgrammaID.naam = "ManueelBelegRobotProgrammaID";
    objManueelBelegRobotProgrammaID.omschrijving = "dummy";
    objManueelBelegRobotProgrammaID.value = this.selectedRobotProgramma.id.toString();

    // Status verzenden van code weergeven
    this.verzendenVanCode = true;

    // Update to DB
    this.hmiMgmtExchangeService.UpdateValue(objLinks).then((x) => {
      this.hmiMgmtExchangeService.UpdateValue(objRechts).then((y) => {
        this.hmiMgmtExchangeService.UpdateValue(objCompleet).then((y) => {
          this.hmiMgmtExchangeService
            .UpdateValue(objProgrammaStart)
            .then((y) => {
              this.hmiMgmtExchangeService
                .UpdateValue(objManueelBelegType)
                .then((y) => {
                  this.hmiMgmtExchangeService
                    .UpdateValue(objManueelBelegRobotProgrammaID)
                    .then((y) => {
                      // Reset Selectie
                      this.selectedArtikelCode = null;
                      this.selectedRobotProgramma = null;

                      this.ManueelBelegLinks = "";
                      this.ManueelBelegLinks = "";
                      this.ManueelBelegCompleet = "";
                    });
                });
            });
        });
      });
    });
  }

  SetReloadMal() {
    if (this.ProgrammaStart !== 0 || this.ReloadMal !== 0) {
      alert(
        "Opnieuw laden van mal niet mogelijk, Programma start en/of reload reeds actief."
      );
      return;
    }

    // Construct Object re-load mal
    const objreloadMal = new BaseDataHmiMgmtExchange();
    objreloadMal.id = 0;
    objreloadMal.machine = this.userService.staticActiveApp.machine;
    objreloadMal.naam = "ReloadMal";
    objreloadMal.omschrijving = "dummy";
    objreloadMal.value = "1";

    this.hmiMgmtExchangeService.UpdateValue(objreloadMal).then((x) => {
      this.ReloadMal = 1;
    });
  }

  StatusText(): string {
    if (this.verzendenVanCode) {
      // HMI verstuurd code naar productie
      return "Artikel Code bezig met verzenden naar machine.";
    }

    if (this.ProgrammaStart === 1) {
      return "Verwerken van gegevens door MGMT.";
    }

    if (this.ProgrammaStart === 2) {
      return "Bezig met produceren.";
    }

    if (this.ReloadMal === 1) {
      return "Reload mal commando verstuurd naar MGMT.";
    }

    if (this.ReloadMal === 2) {
      return "Reload mal wordt verwerkt door MGMT.";
    }

    return "Klaar";
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
    const klaarNode = new ClientNodes();
    klaarNode.client = "hmi";
    klaarNode.methode = "klaarMeth";
    klaarNode.opctags.push("Lascel.PLC.klaar_installatie3");
    this.kepserverLive.hubConnection.invoke("AddClientMethodTags", klaarNode);
    //
    //
    const intUitvoeringNode = new ClientNodes();
    intUitvoeringNode.client = "hmi";
    intUitvoeringNode.methode = "inUitvoeringMeth";
    intUitvoeringNode.opctags.push("Lascel.PLC.Inuitvoering_installatie3");
    this.kepserverLive.hubConnection.invoke(
      "AddClientMethodTags",
      intUitvoeringNode
    );
    //
    //
    const afgewerktNode = new ClientNodes();
    afgewerktNode.client = "hmi";
    afgewerktNode.methode = "afgewerktMeth";
    afgewerktNode.opctags.push("Lascel.PLC.Afgewerkt_installatie3");
    this.kepserverLive.hubConnection.invoke(
      "AddClientMethodTags",
      afgewerktNode
    );
    //
    //
    const gekopieerdNode = new ClientNodes();
    gekopieerdNode.client = "hmi";
    gekopieerdNode.methode = "gekopieerdMeth";
    gekopieerdNode.opctags.push("Lascel.PLC.Geg_gekopieerd_3");
    this.kepserverLive.hubConnection.invoke(
      "AddClientMethodTags",
      gekopieerdNode
    );
    //
    //
    const doorgestuurdNode = new ClientNodes();
    doorgestuurdNode.client = "hmi";
    doorgestuurdNode.methode = "doorgestuurdMeth";
    doorgestuurdNode.opctags.push("Lascel.PLC.Geg_doorgestuurd3");
    this.kepserverLive.hubConnection.invoke(
      "AddClientMethodTags",
      doorgestuurdNode
    );
    //
    //
    const verwerktNode = new ClientNodes();
    verwerktNode.client = "hmi";
    verwerktNode.methode = "verwerktMeth";
    verwerktNode.opctags.push("Lascel.PLC.Geg_verwerkt3");
    this.kepserverLive.hubConnection.invoke(
      "AddClientMethodTags",
      verwerktNode
    );
  }

  TagMethods() {
    this.kepserverLive.hubConnection.on("klaarMeth", (obj: OpcTagResult) => {
      this.liveUI.klaar = obj.bitValue;
    });

    this.kepserverLive.hubConnection.on(
      "inUitvoeringMeth",
      (obj: OpcTagResult) => {
        this.liveUI.inUitvoering = obj.bitValue;
      }
    );

    this.kepserverLive.hubConnection.on(
      "afgewerktMeth",
      (obj: OpcTagResult) => {
        this.liveUI.afgewerkt = obj.bitValue;
      }
    );

    this.kepserverLive.hubConnection.on(
      "gekopieerdMeth",
      (obj: OpcTagResult) => {
        this.liveUI.gekopieerd = obj.bitValue;
      }
    );

    this.kepserverLive.hubConnection.on(
      "doorgestuurdMeth",
      (obj: OpcTagResult) => {
        this.liveUI.doorgestuurd = obj.bitValue;
      }
    );

    this.kepserverLive.hubConnection.on("verwerktMeth", (obj: OpcTagResult) => {
      this.liveUI.verwerkt = obj.bitValue;
    });
  }
}

export class plcStatus {
  klaar: boolean;
  inUitvoering: boolean;
  afgewerkt: boolean;
  gekopieerd: boolean;
  doorgestuurd: boolean;
  verwerkt: boolean;
}
