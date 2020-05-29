import { BaseDataMachineOnderdeel } from "./../../../../Models/BaseData/BaseDataMachineOnderdeel";
import { BaseDataEigenschapServiceService } from "./../../../../_services/BaseData/BaseDataEigenschapService.service";
import { BaseDataCyclusType } from "./../../../../Models/BaseData/BaseDataCyclusType";
import { BaseDataCyclusTypeService } from "./../../../../_services/BaseData/BaseDataCyclusType.service";
import { BaseDataCyclusMaakInstelling } from "./../../../../Models/BaseData/BaseDataCyclusMaakInstelling";
import { BaseDataCyclusMaakInstellingenService } from "./../../../../_services/BaseData/BaseDataCyclusMaakInstellingen.service";
import { MaakInstellingService } from "./../../../../_services/BaseData/BaseDataMaakInstelling.service";
import { BaseDataMaakInstelling } from "./../../../../Models/BaseData/BaseDataMaakInstelling";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { BaseDataCyclusService } from "./../../../../_services/BaseData/BaseDataCyclus.service";
import { BaseDataCyclus } from "./../../../../Models/BaseData/BaseDataCyclus";
import { Component, OnInit } from "@angular/core";
import { BaseDataEigenschap } from "src/app/Models/BaseData/BaseDataEigenschap";

@Component({
  selector: "app-CyclusCrud",
  templateUrl: "./CyclusCrud.component.html",
  styleUrls: ["./CyclusCrud.component.css"]
})
export class CyclusCrudComponent implements OnInit {
  // PROPS
  selectedMachineOnderdeel: BaseDataMachineOnderdeel;

  formVisible: boolean; // Formulier weergeven/verbergen
  lstCyclus: BaseDataCyclus[] = []; // Lijst van beschikbare Cyclussen voor dit machine onderdeel
  lstCyclusType: BaseDataCyclusType[] = []; // Lijst van mogelijk cyclus types
  form: FormGroup;
  lstMaakInstellingen: BaseDataMaakInstelling[] = [];
  lstCyclusMaakInstellingen: BaseDataCyclusMaakInstelling[] = [];
  selectedCyclus: BaseDataCyclus;
  selectedCyclusMaakInstelling: BaseDataCyclusMaakInstelling;

  selectedUpdateCycle: BaseDataCyclus;

  formCyclusMaakInstelling: FormGroup;
  lstEigenschappenVanType: BaseDataEigenschap[] = [];

  constructor(
    private baseDataCyclusService: BaseDataCyclusService,
    private fb: FormBuilder,
    private maakInstellingService: MaakInstellingService,
    private baseDataCyclusMaakInstellingenService: BaseDataCyclusMaakInstellingenService,
    private baseDataCyclusTypeService: BaseDataCyclusTypeService,
    private baseDataEigenschapServiceService: BaseDataEigenschapServiceService
  ) {}

  ngOnInit() {
    // Formulier validatie activeren
    this.FormValidation();

    // Cyclus Maak Instelling formulier
    this.formCyclusMaakInstellingValidation();

    this.selectedCyclusMaakInstelling = null;
  }

  selectMachineOnderdeel(obj: BaseDataMachineOnderdeel) {
    this.selectedMachineOnderdeel = obj;

    // Inlezen van alle beschikbare  cyclussen
    this.GetCyclusFromMachineOnderdeel();

    // Ophalen van verschilende cyclus types van machine onderdeel
    this.GetCyclusTypeFromMachineOnderdeel();

    // Haal beschikbare maak instellinge uit DB
    this.GetMaakInstellingen();
  }

  // CREATE
  New() {
    if (this.formVisible === false) {
      this.form.reset();
      this.formVisible = true;
    } else {
      this.form.reset();
      this.formVisible = false;
    }
  }

  // METHODS
  FormValidation() {
    this.form = this.fb.group({
      id: [],
      naam: ["", Validators.required],
      cyclusTypeID: ["", Validators.required]
    });
  }

  // METHODS
  formCyclusMaakInstellingValidation() {
    this.formCyclusMaakInstelling = this.fb.group({
      staticWaarde: [],
      eigenschapID: ["", Validators.required]
    });
  }

  GetCyclusTypeFromMachineOnderdeel() {
    this.baseDataCyclusTypeService
      .GetFromMachineOnderdeel(this.selectedMachineOnderdeel.id)
      .then(x => {
        this.lstCyclusType = x;
      });
  }

  GetCyclusFromMachineOnderdeel() {
    // Ophalen van Cyclus gegevens uit database
    this.baseDataCyclusService
      .GetFromMachineOnderdeel(this.selectedMachineOnderdeel.id)
      .then(x => {
        this.lstCyclus = x;

        // Reset Selected Cylus
        this.selectedCyclus = null;
      });
  }

  GetMaakInstellingen() {
    this.maakInstellingService
      .GetFromMachineOnderdeel(this.selectedMachineOnderdeel.id)
      .then(x => {
        this.lstMaakInstellingen = x;

        // Reset update item
        this.selectedUpdateCycle = null;
      });
  }

  SelectCycle(
    obj: BaseDataCyclus // Selecteer Cyclus uit dropdown
  ) {
    this.baseDataCyclusMaakInstellingenService.GetFrom(obj.id).then(x => {
      // Laden van Cyclus Maak Instellingen van DB
      this.lstCyclusMaakInstellingen = x;

      // Set "Selected Cyclus"
      this.selectedCyclus = obj;
    });
  }

  // Clone Cyclus
  CloneCyclus(obj: BaseDataCyclus) {
    this.baseDataCyclusService.Clone(obj).then(x => {
      // Reload cyclussen
      this.GetCyclusFromMachineOnderdeel();
    });
  }

  // Laad Cyclus update venster
  LoadUpdateCyclus(
    obj: BaseDataCyclus // Cyclus edit Formulier laden
  ) {
    // Set Geselecteerde update
    this.selectedUpdateCycle = obj;

    this.form.patchValue({
      id: obj.id,
      naam: obj.naam,
      cyclusTypeID: obj.cyclusTypeId
    });

    // Formulier weergeven
    this.formVisible = true;

    // Scrool UP
    // Scroll naar edit window
    window.scrollTo(0, 0);
  }

  DeleteCycle(obj: BaseDataCyclus) {
    if (confirm("Bent u zeker dat u dit object wil verwijderen?")) {
      this.baseDataCyclusService.Delete(obj).then(x => {
        this.GetCyclusFromMachineOnderdeel();
      });
    }
  }

  Formsubmit() {
    if (this.form.valid) {
      // Get from object
      const obj = new BaseDataCyclus(this.form.value);
      obj.machineOnderdeelId = this.selectedMachineOnderdeel.id;

      if (this.selectedUpdateCycle === null) {
        // Maak nieuwe variant aan
        this.baseDataCyclusService.Create(obj).then(x => {
          // Reload cyclussen
          this.GetCyclusFromMachineOnderdeel();

          this.formVisible = false;

          // Reset Form
          this.form.reset();
        });
      }
      // Bewerken van bestaande cyclus
      else {
        this.baseDataCyclusService.Update(obj).then(x => {
          // Reload cyclussen
          this.GetCyclusFromMachineOnderdeel();

          this.formVisible = false;

          // Reset Form
          this.form.reset();

          // Reset selected cycle to edit
          this.selectedUpdateCycle = null;
        });
      }
    }
  }

  AddCyclusMaakInstelling(obj: BaseDataMaakInstelling) {
    if (this.selectedCyclus === null) {
      alert("Geen cyclus gekozen");
      return;
    }

    let hoogsteSort: number = 0;

    // Zoek hoogste sort in actuele lijst Cyclus maak instellingen
    if (this.lstCyclusMaakInstellingen.length > 0) {
      hoogsteSort = this.lstCyclusMaakInstellingen[
        this.lstCyclusMaakInstellingen.length - 1
      ].stap;
    }

    // Creëer nieus Cyclus Maak Instelling object
    const newCyclusMaakInstelling = new BaseDataCyclusMaakInstelling();
    newCyclusMaakInstelling.id = 0;

    newCyclusMaakInstelling.cyclusId = this.selectedCyclus.id;
    newCyclusMaakInstelling.maakInstellingId = obj.id;

    newCyclusMaakInstelling.stap = hoogsteSort + 1;
    newCyclusMaakInstelling.childStap = 0;

    newCyclusMaakInstelling.productEigenschapId = null;

    newCyclusMaakInstelling.staticWaarde = "";

    newCyclusMaakInstelling.check = false;

    newCyclusMaakInstelling.maakInstelling = null;
    newCyclusMaakInstelling.productEigenschap = null;

    // Save to DB
    this.baseDataCyclusMaakInstellingenService
      .Create(newCyclusMaakInstelling)
      .then(x => {
        // Refresh list
        this.SelectCycle(this.selectedCyclus);
      });
  }
  DeleteCyclusMaakInstelling(obj: BaseDataCyclusMaakInstelling) {
    this.baseDataCyclusMaakInstellingenService.Delete(obj).then(x => {
      // Refresh view
      this.SelectCycle(this.selectedCyclus);
    });
  }

  MoveChildUp(obj: BaseDataCyclusMaakInstelling) {
    if (obj.stap === 1) {
      // Dit object kan niet omhoog geplaatst worden
      return;
    }

    // Zoek in index van eigen plaats
    const myIndex = this.lstCyclusMaakInstellingen.findIndex(
      x => x.id === obj.id
    );
    const beforeIndex = myIndex - 1;

    // tmp Store value
    const tmpMySort = this.lstCyclusMaakInstellingen[myIndex].stap;
    const tmpBeforeSort = this.lstCyclusMaakInstellingen[beforeIndex].stap;

    // Swap sort ID
    const myObj = this.lstCyclusMaakInstellingen[myIndex];
    const beforeObj = this.lstCyclusMaakInstellingen[beforeIndex];

    // Swap Stap
    this.baseDataCyclusMaakInstellingenService
      .SwapStap(beforeObj.id, myObj.id)
      .then(x => {
        // Refresh view
        this.SelectCycle(this.selectedCyclus);
      });
  }

  MoveChildDown(obj: BaseDataCyclusMaakInstelling) {
    // Zoek in index van eigen plaats
    const myIndex = this.lstCyclusMaakInstellingen.findIndex(
      x => x.id === obj.id
    );

    if (myIndex === this.lstCyclusMaakInstellingen.length - 1) {
      // Dit object kan niet omhoog geplaatst worden
      return;
    }

    const afterIndex = myIndex + 1;

    // tmp Store value
    const tmpMySort = this.lstCyclusMaakInstellingen[myIndex].stap;
    const tmpAfterSort = this.lstCyclusMaakInstellingen[afterIndex].stap;

    // Swap sort ID
    const myObj = this.lstCyclusMaakInstellingen[myIndex];
    const afterObj = this.lstCyclusMaakInstellingen[afterIndex];

    // Swap Stap
    this.baseDataCyclusMaakInstellingenService
      .SwapStap(myObj.id, afterObj.id)
      .then(x => {
        // Refresh view
        this.SelectCycle(this.selectedCyclus);
      });
  }

  AttachMaakInstelling(
    obj: BaseDataCyclusMaakInstelling //
  ) {
    this.baseDataCyclusMaakInstellingenService.Attach(obj.id).then(x => {
      // Refresh
      this.SelectCycle(this.selectedCyclus);
    });
  }

  SaveCyclusMaakInstellingFormSubmit() {
    let staticWaarde = this.formCyclusMaakInstelling.get("staticWaarde").value;
    let eigenschapID = this.formCyclusMaakInstelling.get("eigenschapID").value;

    if (eigenschapID != null) {
      // Dynamische waarde uit eigenschap halen
      // Check

      // Geldige waarde ingegeven
      // Statische waarde opnemen
      this.selectedCyclusMaakInstelling.staticWaarde = ""; // Static waarde instellen

      this.selectedCyclusMaakInstelling.productEigenschapId = Number(
        eigenschapID
      ); // set null to static eigenschap
      this.selectedCyclusMaakInstelling.productEigenschap = null;

      this.selectedCyclusMaakInstelling.maakInstelling = null;

      this.baseDataCyclusMaakInstellingenService
        .Update(this.selectedCyclusMaakInstelling)
        .then(x => {
          // refresh
          this.SelectCycle(this.selectedCyclus);

          this.selectedCyclusMaakInstelling = null;

          // Reset Formulier
          this.formCyclusMaakInstelling.reset();
        });
    } else {
      // Statische waarde wordt gebruikt, waarde moet ingevuld worden
      if (
        this.CheckWaarde(
          staticWaarde,
          this.selectedCyclusMaakInstelling.maakInstelling.dataType
        )
      ) {
        // Geldige waarde ingegeven

        // Statische waarde opnemen
        this.selectedCyclusMaakInstelling.staticWaarde = staticWaarde; // Static waarde instellen
        this.selectedCyclusMaakInstelling.productEigenschapId = null; // set null to static eigenschap
        this.selectedCyclusMaakInstelling.productEigenschap = null;

        this.selectedCyclusMaakInstelling.maakInstelling = null;

        this.baseDataCyclusMaakInstellingenService
          .Update(this.selectedCyclusMaakInstelling)
          .then(x => {
            // refresh
            this.SelectCycle(this.selectedCyclus);

            this.selectedCyclusMaakInstelling = null;

            // Reset Formulier
            this.formCyclusMaakInstelling.reset();
          });
      } else {
        alert("Ongeldige waarde ingegeven");
      }
    }
  }

  // Cyclus Maak instellings EDITOR
  LoadCyclusMaakForm(obj: BaseDataCyclusMaakInstelling) {
    // Ophalen van beschikbare eigenschappen van hetzelfde datatype
    this.baseDataEigenschapServiceService
      .GetFromMachineOnderdeelType(
        this.selectedMachineOnderdeel.id,
        obj.maakInstelling.dataType
      )
      .then(x => {
        this.lstEigenschappenVanType = x;

        this.selectedCyclusMaakInstelling = obj;

        this.formCyclusMaakInstelling.patchValue({
          staticWaarde: obj.staticWaarde,
          eigenschapID: obj.productEigenschapId
        });

        // Scrool UP
        // Scroll naar edit window
        window.scrollTo(0, 0);
      });
  }

  // ALGEMEEN
  CheckWaarde(waarde: string, type: string): boolean {
    // Bepaal of de strin correct is afhankelijk van het type

    switch (type) {
      case "Integer": {
        if (Number(waarde) != parseInt(waarde, 10)) {
          // Waarde is niet geconverteerd
          return false;
        } else {
          // Waarde is geconverteerd
          return true;
        }
        break;
      }
      case "String": {
        return true;
        break;
      }

      case "Decimal": {
        if (isNaN(Number(waarde))) {
          // Waarde is niet geconverteerd
          return false;
        } else {
          // Waarde is geconverteerd
          return true;
        }
        break;
      }

      case "Boolean": {
        if (waarde === "0" || waarde === "1") {
          return true;
        } else {
          return false;
        }

        break;
      }
      default: {
        return false;
      }
    }
  }
}
