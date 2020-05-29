import { Eventdefinitie } from "./../../../../Models/HmiEvents/Eventdefinitie";
import { FormGroup } from "@angular/forms";
import { Validators } from "@angular/forms";
import { UserService } from "./../../../../_services/user.service";
import { FormBuilder } from "@angular/forms";
import { EventDefinitieService } from "./../../../../_services/HmiEvents/EventDefinitie.service";
import { Component, OnInit, Pipe, PipeTransform } from "@angular/core";

@Component({
  selector: "app-EventsDefinities",
  templateUrl: "./EventsDefinities.component.html",
  styleUrls: ["./EventsDefinities.component.css"],
})
export class EventsDefinitiesComponent implements OnInit {
  // PROPS
  lstTypes: string[] = ["Allemaal", "Alarm", "Waarschuwing", "Melding"];
  lstObjects: Eventdefinitie[] = [];
  form: FormGroup;
  formVisible: boolean;

  zoekString: string;

  constructor(
    private eventDefinitieService: EventDefinitieService,
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

      this.zoekString = null;

      // Inlezen van alle Cyclus types die behoren tot de Poolnaam van de geopende APP
      this.GetFromMachine();
    } else {
      alert("Fout met inladen van Machine naam");
      return;
    }
  }

  FormValidation() {
    this.form = this.fb.group({
      eventId: [],
      opcTag: [],
      plcAdress: [],
      appName: [],
      type: [],
      omschrijving: ["", Validators.required],
      info: ["", Validators.required],
      logging: [],
    });
  }

  // Filter dropdown
  Select(obj: string) {
    if (obj === "Allemaal") {
      this.zoekString = "";
    } else {
      this.zoekString = obj;
    }
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
      const obj = new Eventdefinitie(this.form.value);

      if (obj.eventId === null) {
        // CREATE
        this.Create(obj);
      } else {
        // UDAPTE
        this.Update(obj);
      }

      this.zoekString = obj.type;
    }
  }

  Create(obj: Eventdefinitie) {
    obj.appName = this.userService.staticActiveApp.machine;

    this.eventDefinitieService.Create(obj).then((x) => {
      this.GetFromMachine();

      this.form.reset();
    });
  }

  // READ
  GetFromMachine() {
    // Inlezen van alle modules
    this.eventDefinitieService
      .Get(this.userService.staticActiveApp.machine)
      .then((obj: Eventdefinitie[]) => {
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

  LoadUpdate(obj: Eventdefinitie) {
    this.form.reset();
    //
    //
    this.form.patchValue({
      eventId: obj.eventId,
      opcTag: obj.opcTag,
      plcAdress: obj.plcAdress,
      appName: obj.appName,
      type: obj.type,
      omschrijving: obj.omschrijving,
      info: obj.info,
      logging: obj.logging,
    });

    // Scroll naar edit window
    window.scrollTo(0, 0);

    // weergeven van formulier
    this.formVisible = true;
  }

  Update(obj: Eventdefinitie) {
    this.eventDefinitieService.Update(obj).then((x) => {
      // Reset view
      this.GetFromMachine();
    });
  }

  Delete(obj: Eventdefinitie) {
    if (confirm("Bent u zeker dat u dit object wil verwijderen?")) {
      this.eventDefinitieService.Delete(obj).then((x) => {
        // Refresh View
        this.GetFromMachine();
      });
    }
  }
}

// FILTER PIPE
@Pipe({
  name: "myfilter",
  pure: false,
})
export class MyFilterPipe implements PipeTransform {
  transform(items: Eventdefinitie[], filter: string): any {
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter((item) => item.type.indexOf(filter) !== -1);
  }
}
