import { BaseDataMachineOnderdeel } from "./../../../../Models/BaseData/BaseDataMachineOnderdeel";
import { UserService } from "./../../../../_services/user.service";
import { BaseDataEigenschap } from "./../../../../Models/BaseData/BaseDataEigenschap";
import { BaseDataEigenschapServiceService } from "./../../../../_services/BaseData/BaseDataEigenschapService.service";
import { Component, OnInit } from "@angular/core";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";

@Component({
  selector: "app-BaseDataEigenschapCrud",
  templateUrl: "./BaseDataEigenschapCrud.component.html",
  styleUrls: ["./BaseDataEigenschapCrud.component.css"],
})
export class BaseDataEigenschapCrudComponent implements OnInit {
  mymasterprop = "Choco Master";

  // Properties
  selectedMachineOnderdeel: BaseDataMachineOnderdeel;
  lstEigenschappen: BaseDataEigenschap[] = [];
  form: FormGroup;
  formVisible: boolean;

  constructor(
    private baseDataEigenschapServiceService: BaseDataEigenschapServiceService,
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

    this.GetFromMachineOnderdeel();
  }

  FormValidation() {
    this.form = this.fb.group({
      id: [],
      sort: [],
      naam: ["", Validators.required],
      omschrijving: ["", Validators.required],
      dataType: ["", Validators.required],
      globalEigenschap: [],
    });
  }

  // Form SUbmit
  Formsubmit() {
    if (this.form.valid) {
      // Get object from Form
      const obj = new BaseDataEigenschap(this.form.value);

      obj.machineOnderdeelId = this.selectedMachineOnderdeel.id;

      if (obj.globalEigenschap === null) {
        obj.globalEigenschap = "";
      }

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

    if (!this.formVisible) {
      this.formVisible = true;
    } else {
      this.formVisible = false;
    }
  }

  Create(obj: BaseDataEigenschap) {
    // Zoek hoogste sort waarde en voeg er één toe
    if (this.lstEigenschappen.length > 0) {
      obj.sort =
        this.lstEigenschappen[this.lstEigenschappen.length - 1].sort + 1;
    } else {
      obj.sort = 1;
    }

    this.baseDataEigenschapServiceService.Create(obj).then((x) => {
      this.GetFromMachineOnderdeel();

      this.form.reset();
    });
  }

  // READ
  GetFromMachineOnderdeel() {
    // Inlezen van alle modules
    this.baseDataEigenschapServiceService
      .GetFromMachineOnderdeel(this.selectedMachineOnderdeel.id)
      .then((obj: BaseDataEigenschap[]) => {
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

  LoadUpdate(obj: BaseDataEigenschap) {
    this.form.reset();
    //
    //
    this.form.patchValue({
      id: obj.id,
      sort: obj.sort,
      naam: obj.naam,
      omschrijving: obj.omschrijving,
      dataType: obj.dataType,
      globalEigenschap: obj.globalEigenschap,
    });

    // Scroll naar edit window
    window.scrollTo(0, 0);

    // weergeven van formulier
    this.formVisible = true;
  }

  Update(obj: BaseDataEigenschap) {
    obj.machineOnderdeelId = this.selectedMachineOnderdeel.id;

    this.baseDataEigenschapServiceService.Update(obj).then((x) => {
      // Reset view
      this.GetFromMachineOnderdeel();
    });
  }

  Delete(obj: BaseDataEigenschap) {
    if (confirm("Bent u zeker dat u dit object wil verwijderen?")) {
      this.baseDataEigenschapServiceService.Delete(obj).then((x) => {
        // Refresh View
        this.GetFromMachineOnderdeel();
      });
    }
  }

  MoveChildUp(obj: BaseDataEigenschap) {
    if (obj.sort === 1) {
      // Dit object kan niet omhoog geplaatst worden
      return;
    }

    // Zoek in index van eigen plaats
    const myIndex = this.lstEigenschappen.findIndex((x) => x.id === obj.id);
    const beforeIndex = myIndex - 1;

    // tmp Store value
    const tmpMySort = this.lstEigenschappen[myIndex].sort;
    const tmpBeforeSort = this.lstEigenschappen[beforeIndex].sort;

    // Swap sort ID
    const myObj = this.lstEigenschappen[myIndex];
    myObj.sort = tmpBeforeSort;

    const beforeObj = this.lstEigenschappen[beforeIndex];
    beforeObj.sort = tmpMySort;

    // Update database
    this.baseDataEigenschapServiceService.Update(myObj).then((x) => {
      this.baseDataEigenschapServiceService.Update(beforeObj).then((y) => {
        this.GetFromMachineOnderdeel();
      });
    });
  }

  MoveChildDown(obj: BaseDataEigenschap) {
    if (obj.sort === this.lstEigenschappen.length) {
      // Dit object kan niet omlaag geplaatst worden
      return;
    }

    // Zoek in index van eigen plaats
    const myIndex = this.lstEigenschappen.findIndex((x) => x.id === obj.id);
    const NextIndex = myIndex + 1;

    // tmp Store value
    const tmpMySort = this.lstEigenschappen[myIndex].sort;
    const tmpNextSort = this.lstEigenschappen[NextIndex].sort;

    // Swap sort ID
    const myObj = this.lstEigenschappen[myIndex];
    myObj.sort = tmpNextSort;

    const NextObj = this.lstEigenschappen[NextIndex];
    NextObj.sort = tmpMySort;

    // Update database
    this.baseDataEigenschapServiceService.Update(myObj).then((x) => {
      this.baseDataEigenschapServiceService.Update(NextObj).then((y) => {
        this.GetFromMachineOnderdeel();
      });
    });
  }
}
