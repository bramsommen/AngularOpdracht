import { BaseDataMachineOnderdeel } from "./../../../../Models/BaseData/BaseDataMachineOnderdeel";
import { BaseDataCyclusType } from "./../../../../Models/BaseData/BaseDataCyclusType";
import { UserService } from "./../../../../_services/user.service";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { BaseDataCyclusTypeService } from "./../../../../_services/BaseData/BaseDataCyclusType.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-BaseDataCyclusTypeCrud",
  templateUrl: "./BaseDataCyclusTypeCrud.component.html",
  styleUrls: ["./BaseDataCyclusTypeCrud.component.css"]
})
export class BaseDataCyclusTypeCrudComponent implements OnInit {
  // Properties
  selectedMachineOnderdeel: BaseDataMachineOnderdeel;

  lstCyclusTypes: BaseDataCyclusType[] = [];
  form: FormGroup;
  formVisible: boolean;

  constructor(
    private baseDataCyclusTypeService: BaseDataCyclusTypeService,
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

    // Inlezen van alle Cyclus types die behoren tot de Poolnaam van de geopende APP
    this.GetFromMachineOnderdeel();
  }

  FormValidation() {
    this.form = this.fb.group({
      id: [],
      naam: ["", Validators.required]
    });
  }

  // Form SUbmit
  Formsubmit() {
    if (this.form.valid) {
      // Get object from Form
      const obj = new BaseDataCyclusType(this.form.value);
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

  Create(obj: BaseDataCyclusType) {
    // Zoek hoogste sort waarde en voeg er één toe

    obj.naam = obj.naam.toUpperCase();

    this.baseDataCyclusTypeService.Create(obj).then(x => {
      this.GetFromMachineOnderdeel();

      this.form.reset();
    });
  }

  // READ
  GetFromMachineOnderdeel() {
    // Inlezen van alle modules
    this.baseDataCyclusTypeService
      .GetFromMachineOnderdeel(this.selectedMachineOnderdeel.id)
      .then((obj: BaseDataCyclusType[]) => {
        // Er is reactie van de server, navigeer indien geldig
        if (obj != null) {
          console.log("Er zijn " + obj.length + " Objecten uit DB ingelezen");
          //
          // Set list to componen
          //
          this.lstCyclusTypes = obj;

          // Hide form
          this.formVisible = false;
        } else {
          console.log("Geen data gevonden in database");
        }
      });
  }

  LoadUpdate(obj: BaseDataCyclusType) {
    this.form.reset();
    //
    //
    this.form.patchValue({
      id: obj.id,
      naam: obj.naam
    });

    // Scroll naar edit window
    window.scrollTo(0, 0);

    // weergeven van formulier
    this.formVisible = true;
  }

  Update(obj: BaseDataCyclusType) {
    this.baseDataCyclusTypeService.Update(obj).then(x => {
      // Reset view
      this.GetFromMachineOnderdeel();
    });
  }

  Delete(obj: BaseDataCyclusType) {
    if (confirm("Bent u zeker dat u dit object wil verwijderen?")) {
      this.baseDataCyclusTypeService.Delete(obj).then(x => {
        // Refresh View
        this.GetFromMachineOnderdeel();
      });
    }
  }
}
