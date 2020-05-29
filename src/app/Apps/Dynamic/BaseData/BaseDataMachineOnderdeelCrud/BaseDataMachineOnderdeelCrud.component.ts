import { Validators } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { BaseDataMachineOnderdeel } from "./../../../../Models/BaseData/BaseDataMachineOnderdeel";
import { UserService } from "./../../../../_services/user.service";
import { FormBuilder } from "@angular/forms";
import { BaseDataMachineOnderdeelService } from "./../../../../_services/BaseData/BaseDataMachineOnderdeel.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-BaseDataMachineOnderdeelCrud",
  templateUrl: "./BaseDataMachineOnderdeelCrud.component.html",
  styleUrls: ["./BaseDataMachineOnderdeelCrud.component.css"],
})
export class BaseDataMachineOnderdeelCrudComponent implements OnInit {
  // PROPS
  lstObjects: BaseDataMachineOnderdeel[] = [];
  form: FormGroup;
  formVisible: boolean;

  constructor(
    private baseDataMachineOnderdeelService: BaseDataMachineOnderdeelService,
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit() {
    if (
      this.userService.staticActiveApp.machine != null &&
      this.userService.staticActiveApp.machine != ""
    ) {
      // Formulier validatie activeren
      this.FormValidation();

      // Inlezen van alle Cyclus types die behoren tot de Poolnaam van de geopende APP
      this.GetFromMachine();
    } else {
      alert("Fout met inladen van Machine naam");
      return;
    }
  }

  FormValidation() {
    this.form = this.fb.group({
      id: [],
      naam: ["", Validators.required],
      omschrijving: [],
    });
  }

  // CREATE
  New() {
    if (this.formVisible) {
      this.form.reset();
      this.formVisible = false;
    } else {
      this.form.reset();
      this.formVisible = true;
    }
  }

  // Form SUbmit
  Formsubmit() {
    if (this.form.valid) {
      // Get object from Form
      const obj = new BaseDataMachineOnderdeel(this.form.value);

      if (obj.id === null) {
        // CREATE
        this.Create(obj);
      } else {
        // UDAPTE
        this.Update(obj);
      }
    }
  }

  Create(obj: BaseDataMachineOnderdeel) {
    if (obj.omschrijving === null) {
      obj.omschrijving = "";
    }

    this.baseDataMachineOnderdeelService.Create(obj).then((x) => {
      this.GetFromMachine();

      this.form.reset();
    });
  }

  // READ
  GetFromMachine() {
    // Inlezen van alle modules
    this.baseDataMachineOnderdeelService
      .GetFromMachine()
      .then((obj: BaseDataMachineOnderdeel[]) => {
        // Er is reactie van de server, navigeer indien geldig
        if (obj != null) {
          console.log("Er zijn " + obj.length + " Objecten uit DB ingelezen");
          //
          // Set list to componen
          //
          this.lstObjects = obj;

          // Hide form
          this.formVisible = false;
        } else {
          console.log("Geen data gevonden in database");
        }
      });
  }

  LoadUpdate(obj: BaseDataMachineOnderdeel) {
    this.form.reset();
    //
    //
    this.form.patchValue({
      id: obj.id,
      naam: obj.naam,
      omschrijving: obj.omschrijving,
    });

    // Scroll naar edit window
    window.scrollTo(0, 0);

    // weergeven van formulier
    this.formVisible = true;
  }

  Update(obj: BaseDataMachineOnderdeel) {
    this.baseDataMachineOnderdeelService.Update(obj).then((x) => {
      // Reset view
      this.GetFromMachine();
    });
  }

  Delete(obj: BaseDataMachineOnderdeel) {
    if (confirm("Bent u zeker dat u dit object wil verwijderen?")) {
      this.baseDataMachineOnderdeelService.Delete(obj).then((x) => {
        // Refresh View
        this.GetFromMachine();
      });
    }
  }
}
