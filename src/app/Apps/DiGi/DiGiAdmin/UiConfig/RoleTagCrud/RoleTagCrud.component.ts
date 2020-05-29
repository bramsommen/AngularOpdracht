import { FormBuilder, Validators } from "@angular/forms";
import { DBRoleTag } from "./../../../../../Models/DiGi/DbModels/DBRoleTag";
import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { RoleTagService } from "src/app/_services/DiGI/RoleTag.service";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "app-RoleTagCrud",
  templateUrl: "./RoleTagCrud.component.html",
  styleUrls: ["./RoleTagCrud.component.css"]
})
export class RoleTagCrudComponent implements OnInit {
  // PROPERTIES
  listRoleTags: DBRoleTag[] = [];
  form: FormGroup;
  formEditStatus: boolean;

  // CONSTRUCTOR
  constructor(
    private roleTagService: RoleTagService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    // Formulier validatie activeren
    this.FormValidation();
    //
    // Ophalen van alle Role Tags Uit DB
    this.GetAll();
  }

  // METHODS
  FormValidation() {
    this.form = this.fb.group({
      txtid: [],
      txtNaam: ["", Validators.required],
      txtBeschrijving: ["", Validators.required]
    });
  }

  Formsubmit() {
    if (this.formEditStatus) {
      this.Update();
    } else {
      this.Create();
    }
  }

  // CREATE
  Create() {
    if (this.form.status === "VALID") {
      // Maakt niew RoleTag aan
      const newRoleTag: DBRoleTag = new DBRoleTag();
      newRoleTag.naam = this.form.get("txtNaam").value;
      newRoleTag.beschrijving = this.form.get("txtBeschrijving").value;
      //
      // Save deze role tag naar database
      this.roleTagService.Create(newRoleTag).then(obj => {
        // Er is reactie van de server.

        this.form.reset();

        // Ophalen van alle Role Tags Uit DB
        this.GetAll();
      });
    }
  }

  // READ
  GetAll() {
    this.roleTagService.GetAll().then((obj: DBRoleTag[]) => {
      // Er is reactie van de server, navigeer indien geldig
      if (obj != null) {
        console.log("Er zijn " + obj.length + " Object uit DB ingelezen");
        //
        // Set list to componen
        //
        this.listRoleTags = obj;
        //
        // Reset edit status
        this.formEditStatus = false;
      } else {
        console.log("Geen data gevonden in database");
      }
    });
  }

  // UPDATE
  LoadUpdate(obj: DBRoleTag) {
    // Reset het huidige formulier
    this.form.reset();
    //
    // SET edit is active
    this.formEditStatus = true;
    //
    this.form.patchValue({
      txtid: obj.id,
      txtNaam: obj.naam,
      txtBeschrijving: obj.beschrijving
    });
  }

  Update() {
    // Maakt niew RoleTag aan
    const newRoleTag: DBRoleTag = new DBRoleTag();
    newRoleTag.id = this.form.get("txtid").value;
    newRoleTag.naam = this.form.get("txtNaam").value;
    newRoleTag.beschrijving = this.form.get("txtBeschrijving").value;
    //
    // Save deze role tag naar database
    this.roleTagService.Update(newRoleTag).then(obj => {
      // Er is reactie van de server.

      this.form.reset();

      // Ophalen van alle Role Tags Uit DB
      this.GetAll();
    });
  }

  // DELETE
  Delete(obj: DBRoleTag) {
    if (
      confirm(
        "Bent u zeker dat u deze role tag wil verwijderen? Weet dat ook alle links met deze role tag verwijderd worden!"
      )
    ) {
      this.roleTagService.Delete(obj).then(obj => {
        // Er is reactie van de server.

        console.log("Delete Succes");

        // Ophalen van alle Role Tags Uit DB
        this.GetAll();
      });
    }
  }
}
