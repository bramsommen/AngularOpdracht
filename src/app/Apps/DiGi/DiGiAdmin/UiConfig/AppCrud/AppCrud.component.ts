import { DBApp } from "./../../../../../Models/DiGi/DbModels/DBApp";
import { AppModuleService } from "./../../../../../_services/DiGI/AppModule.service";
import { AppsService } from "./../../../../../_services/DiGI/Apps.service";
import { Component, OnInit } from "@angular/core";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";

@Component({
  selector: "app-AppCrud",
  templateUrl: "./AppCrud.component.html",
  styleUrls: ["./AppCrud.component.css"]
})
export class AppCrudComponent implements OnInit {
  // PROPERTIES
  lstApps: DBApp[] = [];
  form: FormGroup;
  formEditStatus: boolean;

  constructor(
    private appService: AppsService,
    private fb: FormBuilder,
    private appModuleService: AppModuleService
  ) {}

  ngOnInit() {
    // Formulier validatie activeren
    this.FormValidation();

    // Lees alle Apps
    this.GetAll();
  }

  // METHODS
  FormValidation() {
    this.form = this.fb.group({
      id: [],
      naam: ["", Validators.required],
      omschrijving: ["", Validators.required],
      poolnaam: [],
      machine: [],
      type: []
    });
  }

  New() {
    this.form.reset();

    // Reset status to new
    this.formEditStatus = false;
  }

  Formsubmit() {
    // Get object from Form
    const obj = new DBApp(this.form.value);

    if (this.form.status === "VALID") {
      if (this.formEditStatus) {
        this.Update(obj);
      } else {
        this.Create(obj);
      }
    }
  }

  // CREATE
  Create(obj: DBApp) {
    obj.id = 0;
    //
    // Save deze role tag naar database
    this.appService.Create(obj).then(obj => {
      // Er is reactie van de server.

      this.form.reset();

      // Ophalen van alle Role Tags Uit DB
      this.GetAll();
    });
  }

  // READ
  GetAll() {
    // Inlezen van alle modules
    this.appService.GetAll().then((obj: DBApp[]) => {
      // Er is reactie van de server, navigeer indien geldig
      if (obj != null) {
        console.log("Er zijn " + obj.length + " Objecten uit DB ingelezen");
        //
        // Set list to componen
        //
        this.lstApps = obj;

        // Reset Edit status
        this.formEditStatus = false;
      } else {
        console.log("Geen data gevonden in database");
      }
    });
  }

  // UPDATE
  LoadUpdate(obj: DBApp) {
    // Reset het huidige formulier
    this.form.reset();
    //
    // SET edit is active
    this.formEditStatus = true;
    //
    this.form.patchValue({
      id: obj.id,
      naam: obj.naam,
      omschrijving: obj.omschrijving,
      poolnaam: obj.poolnaam,
      machine: obj.machine,
      type: obj.type
    });

    // Scroll naar edit window
    window.scrollTo(0, 0);
  }

  Update(obj: DBApp) {
    // Save deze role tag naar database
    this.appService.Update(obj).then(obj => {
      // Er is reactie van de server.

      this.form.reset();

      // Ophalen van alle Role Tags Uit DB
      this.GetAll();
    });
  }
  // DELETE
  Delete(obj: DBApp) {
    if (confirm("Bent u zeker dat u dit object wil verwijderen?")) {
      this.appService.Delete(obj).then(obj => {
        // Er is reactie van de server.

        console.log("Delete Succes");

        // Ophalen van alle Role Tags Uit DB
        this.GetAll();
      });
    }
  }
}
