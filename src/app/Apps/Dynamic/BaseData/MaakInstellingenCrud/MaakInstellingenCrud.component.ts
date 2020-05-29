import { BaseDataMachineOnderdeel } from "./../../../../Models/BaseData/BaseDataMachineOnderdeel";
import { FormGroup, Validators } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { UserService } from "./../../../../_services/user.service";
import { MaakInstellingService } from "./../../../../_services/BaseData/BaseDataMaakInstelling.service";
import { BaseDataMaakInstelling } from "./../../../../Models/BaseData/BaseDataMaakInstelling";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-MaakInstellingenCrud",
  templateUrl: "./MaakInstellingenCrud.component.html",
  styleUrls: ["./MaakInstellingenCrud.component.css"]
})
export class MaakInstellingenCrudComponent implements OnInit {
  // PROPS
  selectedMachineOnderdeel: BaseDataMachineOnderdeel;

  lstEigenschappen: BaseDataMaakInstelling[] = [];
  form: FormGroup;
  formVisible: boolean;

  // CONSTRUCTOR
  constructor(
    private maakInstellingService: MaakInstellingService,
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit() {
    if (
      this.userService.staticActiveApp.poolnaam != null &&
      this.userService.staticActiveApp.poolnaam != ""
    ) {
      // Formulier validatie activeren
      this.FormValidation();
    } else {
      alert("Fout met inladen van Poolnaam");
      return;
    }
  }

  selectMachineOnderdeel(obj: BaseDataMachineOnderdeel) {
    this.selectedMachineOnderdeel = obj;

    // Inlezen van alle eigenschappen die behoren tot de Poolnaam van de geopende APP
    this.GetFromMachineOnderdeel();
  }

  FormValidation() {
    this.form = this.fb.group({
      id: [],
      naam: ["", Validators.required],
      omschrijving: ["", Validators.required],
      dataType: ["", Validators.required]
    });
  }

  // Form SUbmit
  Formsubmit() {
    if (this.form.valid) {
      // Get object from Form
      const obj = new BaseDataMaakInstelling(this.form.value);
      obj.machineOnderdeelId = this.selectedMachineOnderdeel.id;

      if (obj.id === null) {
        // CREATE
        this.Create(obj);
      } else {
        // UDAPTE
        this.Update(obj);
      }
    }
  }

  // CREATE
  New() {
    this.form.reset();
    this.formVisible = true;
  }

  Create(obj: BaseDataMaakInstelling) {
    this.maakInstellingService.Create(obj).then(x => {
      this.GetFromMachineOnderdeel();

      this.form.reset();
    });
  }

  // READ
  GetFromMachineOnderdeel() {
    // Inlezen van alle modules
    this.maakInstellingService
      .GetFromMachineOnderdeel(this.selectedMachineOnderdeel.id)
      .then((obj: BaseDataMaakInstelling[]) => {
        // Er is reactie van de server, navigeer indien geldig
        if (obj != null) {
          console.log("Er zijn " + obj.length + " Objecten uit DB ingelezen");
          //
          // Set list to componen
          //
          this.lstEigenschappen = obj;

          // Hide form
          this.formVisible = false;
        } else {
          console.log("Geen data gevonden in database");
        }
      });
  }

  LoadUpdate(obj: BaseDataMaakInstelling) {
    this.form.reset();
    //
    //
    this.form.patchValue({
      id: obj.id,
      naam: obj.naam,
      omschrijving: obj.omschrijving,
      dataType: obj.dataType
    });

    // Scroll naar edit window
    window.scrollTo(0, 0);

    // weergeven van formulier
    this.formVisible = true;
  }

  Update(obj: BaseDataMaakInstelling) {
    this.maakInstellingService.Update(obj).then(x => {
      // Reset view
      this.GetFromMachineOnderdeel();
    });
  }

  Delete(obj: BaseDataMaakInstelling) {
    if (confirm("Bent u zeker dat u dit object wil verwijderen?")) {
      this.maakInstellingService.Delete(obj).then(x => {
        // Refresh View
        this.GetFromMachineOnderdeel();
      });
    }
  }
}
