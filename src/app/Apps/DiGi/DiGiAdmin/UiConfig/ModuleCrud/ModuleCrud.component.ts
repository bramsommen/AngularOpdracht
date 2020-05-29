import { RoleTagService } from "src/app/_services/DiGI/RoleTag.service";
import { DBRoleTag } from "./../../../../../Models/DiGi/DbModels/DBRoleTag";
import { ModuleRoleTagsService } from "./../../../../../_services/DiGI/ModuleRoleTags.service";
import { DiGiModule } from "./../../../../../Models/DiGi/DiGiModule";
import { DiGiModuleService } from "./../../../../../_services/DiGI/DiGiModule.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { DBModuleRolesTag } from "src/app/Models/DiGi/DbModels/DBModuleRolesTag";

@Component({
  selector: "app-ModuleCrud",
  templateUrl: "./ModuleCrud.component.html",
  styleUrls: ["./ModuleCrud.component.css"]
})
export class ModuleCrudComponent implements OnInit {
  // PROPERTIES
  lstModules: DiGiModule[] = [];
  form: FormGroup;
  formEditStatus: boolean;
  roleTagsFromModule: DBModuleRolesTag[] = [];
  allRoleTags: DBRoleTag[] = [];
  selectedModule: DiGiModule;

  // Visual
  formVisible: boolean;
  RoleTagsVisible: boolean;

  constructor(
    private digiModuleService: DiGiModuleService,
    private fb: FormBuilder,
    private moduleRoleTagsService: ModuleRoleTagsService,
    private roleTagService: RoleTagService
  ) {}

  ngOnInit() {
    // Formulier validatie activeren
    this.FormValidation();

    // Get all from DB
    this.GetAll();
  }

  // METHODS
  FormValidation() {
    this.form = this.fb.group({
      id: [],
      naam: ["", Validators.required],
      omschrijving: ["", Validators.required],
      angularComponent: [],
      dedicatedPc: []
    });
  }

  New() {
    this.form.reset();

    // Set form
    this.ActivateForm();
  }

  Formsubmit() {
    // Get object from Form
    const obj = new DiGiModule(this.form.value);

    if (this.form.status === "VALID") {
      if (this.formEditStatus) {
        this.Update(obj);
      } else {
        this.Create(obj);
      }
    }
  }

  // CREATE
  Create(obj: DiGiModule) {
    obj.id = 0;
    //
    // Save deze role tag naar database
    this.digiModuleService.Create(obj).then(obj => {
      // Er is reactie van de server.

      this.form.reset();

      // Ophalen van alle Role Tags Uit DB
      this.GetAll();
    });
  }

  // READ
  GetAll() {
    // Inlezen van alle modules
    this.digiModuleService.GetAll().then((obj: DiGiModule[]) => {
      // Er is reactie van de server, navigeer indien geldig
      if (obj != null) {
        console.log("Er zijn " + obj.length + " Object uit DB ingelezen");
        //
        // Set list to componen
        //
        this.lstModules = obj;
        //
        // Reset edit status
        this.formEditStatus = false;
      } else {
        console.log("Geen data gevonden in database");
      }
    });

    // Inlezen van all beschikbare Roletags
    this.roleTagService.GetAll().then((objResult: DBRoleTag[]) => {
      // Log
      console.log(objResult.length + " Role tags uitgelezen uit database");

      // Resultaat doorzetten naar locale var
      this.allRoleTags = objResult;

      // Resel selected module
      this.selectedModule = null;
    });
  }

  // UPDATE
  LoadUpdate(obj: DiGiModule) {
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
      angularComponent: obj.angularComponent,
      dedicatedPc: obj.dedicatedPc
    });

    // Activeer formulier
    this.ActivateForm();

    // Scroll naar edit window
    window.scrollTo(0, 0);

    // Actieve module doorzteten
    this.selectedModule = obj;
  }

  Update(obj: DiGiModule) {
    // Save deze role tag naar database
    this.digiModuleService.Update(obj).then(obj => {
      // Er is reactie van de server.

      this.form.reset();

      // Ophalen van alle Role Tags Uit DB
      this.GetAll();
    });
  }

  // DELETE
  Delete(obj: DiGiModule) {
    if (confirm("Bent u zeker dat u dit object wil verwijderen?")) {
      this.digiModuleService.Delete(obj).then(obj => {
        // Er is reactie van de server.

        console.log("Delete Succes");

        // Ophalen van alle Role Tags Uit DB
        this.GetAll();

        this.formVisible = false;
        this.RoleTagsVisible = false;
      });
    }
  }

  // Create RoleTag On Module
  AddRoleTagToModule(roleTag: DBRoleTag) {
    // Aanmaken van roletag bij een module
    if (this.selectedModule != null) {
      // Create new instance
      const moduleRoleTag = new DBModuleRolesTag();
      moduleRoleTag.modulesId = this.selectedModule.id;
      moduleRoleTag.roleTagsId = roleTag.id;

      // Create in database
      this.moduleRoleTagsService.Create(moduleRoleTag).then(result => {
        // Opnieuw inlezen van roletags van geselecteerde module
        this.GetRoleTags(this.selectedModule);
      });
    }
  }

  // Lezen van RoleTags van bijbehorende module
  GetRoleTags(obj: DiGiModule) {
    this.moduleRoleTagsService.GetFromModule(obj.id).then(roleTags => {
      // Log
      console.log(roleTags.length + " RoleTags uitgelezen uit DB");

      // Resultaat omzetten naar locate var
      this.roleTagsFromModule = roleTags;

      // Roletag weergevens
      this.ActivateRoleTagWindow();

      // Actieve module doorzteten
      this.selectedModule = obj;
    });
  }

  DeleteRoleTag(obj: DBModuleRolesTag) {
    if (confirm("Bent u zeker dat u dit object wil verwijderen?")) {
      this.moduleRoleTagsService.Delete(obj).then(objResult => {
        // Er is reactie van de server.

        console.log("Delete Succes");

        // Ophalen van alle Role Tags Uit DB
        this.GetAll();

        this.GetRoleTags(obj.module);
      });
    }
  }

  // SET Visible
  ActivateForm() {
    this.formVisible = true;
    this.RoleTagsVisible = false;
  }

  ActivateRoleTagWindow() {
    this.RoleTagsVisible = true;
    this.formVisible = false;
  }
}
