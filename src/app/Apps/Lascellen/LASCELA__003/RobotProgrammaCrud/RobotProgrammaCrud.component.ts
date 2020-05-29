import { BaseDataProduct } from "./../../../../Models/BaseData/BaseDataProduct";
import { BaseDataProductService } from "./../../../../_services/BaseData/BaseDataProduct.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { RobotProgrammaMachineOnderdeelProduct } from "./../../../../Models/Lascellen/RobotProgrammaMachineOnderdeelProduct";
import { UserService } from "./../../../../_services/user.service";
import { RobotProgrammaMachineOnderdeelProductService } from "./../../../../_services/Lascellen/RobotProgrammaMachineOnderdeelProduct.service";
import { RobotProgrammaService } from "./../../../../_services/Lascellen/RobotProgramma.service";
import { NgModule, Component, OnInit } from "@angular/core";
import { RobotProgrammaCelA003 } from "src/app/Models/Lascellen/RobotProgrammaCelA003";
import { RobotProgramma } from "src/app/Models/Lascellen/RobotProgramma";

@Component({
  selector: "app-RobotProgrammaCrud",
  templateUrl: "./RobotProgrammaCrud.component.html",
  styleUrls: ["./RobotProgrammaCrud.component.css"],
})
export class RobotProgrammaCrudComponent implements OnInit {
  // PROPERTIES
  lstRobotProgrammas: RobotProgrammaCelA003[] = [];
  selectedRobotProgramma: RobotProgrammaCelA003;

  newObjectInForm: boolean;

  belegVensterVisible: boolean;

  form: FormGroup;

  zoekString: string;

  // lst beschikbare producten
  lstProductenMalLinks: BaseDataProduct[] = [];
  lstProductenMalRechts: BaseDataProduct[] = [];
  lstProductenMalComppleet: BaseDataProduct[] = [];

  constructor(
    private robotProgrammaService: RobotProgrammaService,
    private robotProgrammaMachineOnderdeelProductService: RobotProgrammaMachineOnderdeelProductService,
    private userService: UserService,
    private fb: FormBuilder,
    private baseDataProductService: BaseDataProductService
  ) {}

  ngOnInit() {
    // Formulier activben
    this.FormValidation();

    // Eenmalige init van selected robot prog
    this.selectedRobotProgramma = null;

    // Init ophalen van alle robot programma's
    this.GetFromMachine();

    // Ophalen van beschikbare base data
    this.GetAllProductsMalLinks();
    this.GetAllProductsMalRechts();
    this.GetAllProductsMalCmpleet();
  }

  // Ophalen Van Alle Robot Programma's Voor deze machine
  GetFromMachine() {
    this.robotProgrammaService
      .GetFromMachine(this.userService.staticActiveApp.machine)
      .then((x) => {
        // Set list to local
        this.lstRobotProgrammas = x as RobotProgrammaCelA003[];

        if (this.lstRobotProgrammas === null) {
          alert("Geen data ontvangen van API");
          return;
        }

        for (let item of this.lstRobotProgrammas) {
          this.FillObject(item);
        }
        //INIT
        this.InitLocals();

        // Reload selected Programma
        if (this.selectedRobotProgramma != null) {
          // Zoek naar overeenkomstige robot programma
          const index = this.lstRobotProgrammas.findIndex(
            (x) => x.id === this.selectedRobotProgramma.id
          );

          if (index >= 0) {
            this.selectedRobotProgramma = this.lstRobotProgrammas[index];

            // Reselect this robot programma
            this.SelectRobotProgramma(this.selectedRobotProgramma);
          } else {
            this.selectedRobotProgramma = null;
          }
        }
      });
  }

  GetAllProductsMalLinks() {
    // Ophalen van alle producten uit DB
    this.baseDataProductService.GetFromMachineOnderdeel(1).then((x) => {
      // Set lijst producten
      this.lstProductenMalLinks = x;
    });
  }

  GetAllProductsMalRechts() {
    // Ophalen van alle producten uit DB
    this.baseDataProductService.GetFromMachineOnderdeel(2).then((x) => {
      // Set lijst producten
      this.lstProductenMalRechts = x;
    });
  }

  GetAllProductsMalCmpleet() {
    // Ophalen van alle producten uit DB
    this.baseDataProductService.GetFromMachineOnderdeel(3).then((x) => {
      // Set lijst producten
      this.lstProductenMalComppleet = x;
    });
  }

  InitLocals() {
    this.newObjectInForm = false;
  }

  FormValidation() {
    // Init Form
    this.form = this.fb.group({
      id: [],
      machine: [],
      naam: ["", Validators.required],
      omschrijving: ["", Validators.required],
      roseServerReferentie: ["", Validators.required],
      type: ["", Validators.required],
      status: ["", Validators.required],
    });
  }

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
      {
        obj.malCompleet = null;
        obj.malLinks = null;
        obj.malRechts = null;
      }
    }

    if (obj.robotProgrammaMachineOnderdeelProduct.length === 0) {
      // Init na aanmaken
      obj.malCompleet = null;
      obj.malLinks = null;
      obj.malRechts = null;
    }
  }

  // Knop Tab Algemeen
  BtnAlgemeen() {
    // Activeer algemeen venster
    this.belegVensterVisible = false;
  }

  BtnBeleg() {
    // Activeer beleg venster
    this.belegVensterVisible = true;
  }

  SelectRobotProgramma(obj: RobotProgrammaCelA003) {
    this.robotProgrammaService.GetFromID(obj.id).then((x) => {
      this.selectedRobotProgramma = x as RobotProgrammaCelA003;

      this.FillObject(this.selectedRobotProgramma);

      // Reset Form
      this.form.reset();
      this.newObjectInForm = false;

      this.form.patchValue({
        id: obj.id,
        machine: obj.machine,
        roseServerReferentie: obj.roseServerReferentie,
        naam: obj.naam,
        omschrijving: obj.omschrijving,
        type: obj.type,
        status: obj.status,
      });
    });
  }

  NewForm() {
    // Reset selected robot programma
    this.selectedRobotProgramma = null;

    // Reset formulier velden
    this.form.reset();

    // Weergeven van formulier
    this.belegVensterVisible = false;

    // Init new object
    this.newObjectInForm = true;
  }

  Formsubmit() {
    if (this.form.valid) {
      // Get form values
      const obj = new RobotProgrammaCelA003(this.form.value);
      obj.machine = this.userService.staticActiveApp.machine; // Set machine naam

      if (obj.status !== this.ValidateStatus(obj)) {
        if (
          !confirm(
            "Deze status is niet geldig! Status word aangepast. Wenst u verder te gaan?"
          )
        ) {
          return;
        }
      }

      obj.status = this.ValidateStatus(obj);

      if (
        this.selectedRobotProgramma === null ||
        this.selectedRobotProgramma.id !== obj.id
      ) {
        // Nieuw object aanmaken
        this.robotProgrammaService.Create(obj as RobotProgramma).then((x) => {
          this.selectedRobotProgramma = null;

          this.GetFromMachine();
        });
      } else {
        // Update geselecteerd object
        this.robotProgrammaService.Update(obj as RobotProgramma).then((x) => {
          this.GetFromMachine();
        });
      }
    }
  }

  ValidateStatus(obj: RobotProgrammaCelA003): number {
    if (obj.id === null) {
      // Als dit een nieum object is kan de status enkel uitgesloten zijn
      return 0;
    }

    if (obj.id !== this.selectedRobotProgramma.id) {
      // Er klopt iets niet met het geselecteerde robot programma
      return 0;
    }

    if (obj.type !== this.selectedRobotProgramma.type) {
      // Er is een type wijziging aangevraagd
      return 0;
    }

    if (obj.type === 1) {
      if (this.selectedRobotProgramma.malCompleet === undefined) {
        return 0;
      }
    } else if (obj.type === 2) {
      if (
        this.selectedRobotProgramma.malLinks === undefined &&
        this.selectedRobotProgramma.malRechts === undefined
      ) {
        return 0;
      }
    }

    // Ingesteld type is toegestaan
    return obj.status;
  }

  EditMalCompleetBelegging(obj: BaseDataProduct) {
    if (
      this.selectedRobotProgramma.malCompleet === undefined ||
      this.selectedRobotProgramma.malCompleet === null
    ) {
      // Nieuw
      const rpmop = new RobotProgrammaMachineOnderdeelProduct();
      rpmop.id = 0;
      rpmop.robotProgramaId = this.selectedRobotProgramma.id;
      rpmop.baseDataMachineOnderdeelId = obj.machineOnderdeelId;
      rpmop.baseDataMachineOnderdeelNaam = obj.machineOnderdeel.naam;
      rpmop.baseDataProductId = obj.id;
      rpmop.baseDataProductArtikelCode = obj.artikelCode;

      // Save to DB
      this.CreateBeleg(rpmop);
    }
    // Update
    else {
      this.selectedRobotProgramma.malCompleet.baseDataProductId = obj.id;
      this.selectedRobotProgramma.malCompleet.baseDataProductArtikelCode =
        obj.artikelCode;

      // Update to DB
      this.UpdateBeleg(this.selectedRobotProgramma.malCompleet);
    }
  }

  DeleteMalCompleet() {
    if (
      this.selectedRobotProgramma.malCompleet === undefined ||
      this.selectedRobotProgramma.malCompleet === null
    ) {
      // DOe niets
    } else {
      // Verwijderen vorige versie
      this.DeleteBeleg(this.selectedRobotProgramma.malCompleet);
    }
  }

  EditMalLinks(obj: BaseDataProduct) {
    if (
      this.selectedRobotProgramma.malLinks === undefined ||
      this.selectedRobotProgramma.malLinks === null
    ) {
      // Nieuw
      const rpmop = new RobotProgrammaMachineOnderdeelProduct();
      rpmop.id = 0;
      rpmop.robotProgramaId = this.selectedRobotProgramma.id;
      rpmop.baseDataMachineOnderdeelId = obj.machineOnderdeelId;
      rpmop.baseDataMachineOnderdeelNaam = obj.machineOnderdeel.naam;
      rpmop.baseDataProductId = obj.id;
      rpmop.baseDataProductArtikelCode = obj.artikelCode;

      // Save to DB
      this.CreateBeleg(rpmop);
    }
    // Update
    else {
      this.selectedRobotProgramma.malLinks.baseDataProductId = obj.id;
      this.selectedRobotProgramma.malLinks.baseDataProductArtikelCode =
        obj.artikelCode;

      // Update to DB
      this.UpdateBeleg(this.selectedRobotProgramma.malLinks);
    }
  }

  DeleteMalLinks() {
    if (
      this.selectedRobotProgramma.malLinks === undefined ||
      this.selectedRobotProgramma.malLinks === null
    ) {
      // DOe niets
    } else {
      // Verwijderen vorige versie
      this.DeleteBeleg(this.selectedRobotProgramma.malLinks);
    }
  }

  EditMalRechts(obj: BaseDataProduct) {
    if (
      this.selectedRobotProgramma.malRechts === undefined ||
      this.selectedRobotProgramma.malRechts === null
    ) {
      // Nieuw
      const rpmop = new RobotProgrammaMachineOnderdeelProduct();
      rpmop.id = 0;
      rpmop.robotProgramaId = this.selectedRobotProgramma.id;
      rpmop.baseDataMachineOnderdeelId = obj.machineOnderdeelId;
      rpmop.baseDataMachineOnderdeelNaam = obj.machineOnderdeel.naam;
      rpmop.baseDataProductId = obj.id;
      rpmop.baseDataProductArtikelCode = obj.artikelCode;

      // Save to DB
      this.CreateBeleg(rpmop);
    }
    // Update
    else {
      this.selectedRobotProgramma.malRechts.baseDataProductId = obj.id;
      this.selectedRobotProgramma.malRechts.baseDataProductArtikelCode =
        obj.artikelCode;

      // Update to DB
      this.UpdateBeleg(this.selectedRobotProgramma.malRechts);
    }
  }

  DeleteMalRechts() {
    if (
      this.selectedRobotProgramma.malRechts === undefined ||
      this.selectedRobotProgramma.malRechts === null
    ) {
      // DOe niets
    } else {
      // Verwijderen vorige versie
      this.DeleteBeleg(this.selectedRobotProgramma.malRechts);
    }
  }

  CreateBeleg(obj: RobotProgrammaMachineOnderdeelProduct) {
    this.robotProgrammaMachineOnderdeelProductService.Create(obj).then((x) => {
      this.GetFromMachine();
    });
  }

  UpdateBeleg(obj: RobotProgrammaMachineOnderdeelProduct) {
    this.robotProgrammaMachineOnderdeelProductService.Update(obj).then((x) => {
      this.GetFromMachine();
    });
  }

  DeleteBeleg(obj: RobotProgrammaMachineOnderdeelProduct) {
    this.robotProgrammaMachineOnderdeelProductService.Delete(obj).then((x) => {
      this.GetFromMachine();
    });
  }

  DeleteRobotProgramma(obj: RobotProgramma) {
    if (!confirm("Zeker dat u dit object wil verwijderen?")) {
      return;
    }
    this.robotProgrammaService.Delete(obj).then((x) => {
      this.selectedRobotProgramma = null; // Reset Selected Robot Programa

      // Reload
      this.GetFromMachine();
    });
  }
}
