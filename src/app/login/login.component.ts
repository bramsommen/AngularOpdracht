import { DBUser } from "./../Models/DiGi/DbModels/DBUser";
import { DbUserService } from "./../_services/DiGI/dbUser.service";
import { User } from "./../Models/DiGi/User";
import { Component, OnInit, AfterViewInit } from "@angular/core";
import { UserService } from "../_services/user.service";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { SessionService } from "../_services/session.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  formChanger: number; // 0 = Login, 1 = Paswoord Aanpassen, 2 = nieuwe gebruiker
  allUsers: DBUser[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dbUserService: DbUserService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.CreateRegForm();

    this.formChanger = 0; // Set standaard login

    this.ReadUsers(); // inlezen van alle users
  }

  CreateRegForm() {
    this.form = this.fb.group({
      naam: ["", Validators.required],
      paswoord: ["", [Validators.required, Validators.minLength(4)]],
      paswoord2: []
    });
  }

  ReadUsers() {
    this.dbUserService.GetAll().then(objResult => {
      this.allUsers = objResult;
    });
  }

  Formsubmit() {
    // Get object from Form
    const formUser = new User(this.form.value);

    if (formUser.paswoord2 === null) {
      // Init paswoord hethaling
      formUser.paswoord2 = "";
    }

    if (this.form.status === "VALID") {
      // Gegevens zijn correct ingegeven
      console.log("Formulier is geldig");

      if (formUser.naam.toUpperCase() === formUser.paswoord.toUpperCase()) {
        alert("Gebruikersnaam en paswoord mag niet gelijk zijn.");
        return;
      }

      switch (this.formChanger) {
        case 0: {
          this.Login(formUser);
          break;
        }
        case 1: {
          if (formUser.paswoord2 === "") {
            alert("Nieuw paswoord ontbreekt.");
            return;
          }

          this.PaswoordUpdate(formUser); // Aanpassen van paswoord
          break;
        }
        case 2: {
          if (formUser.paswoord2 === "") {
            alert("Herhaald paswoord ontbreekt.");
            return;
          }

          if (
            formUser.paswoord.toUpperCase() !== formUser.paswoord2.toUpperCase()
          ) {
            alert("Paswoord is niet gelijk aan herhaling.");
            return;
          }

          this.Create(formUser); // Aanmaken van gebruiker
          break;
        }
        default: {
          break;
        }
      }
    } else {
      // Gegevens zijn niet correct
      alert("Formulier niet geldig");
    }
  }

  Login(usr: User) {
    this.userService.GetUserProfiel(usr.naam, usr.paswoord).then(obj => {
      // Er is reactie van de server, navigeer indien geldig
      if (obj != null) {
        console.log("User: " + obj.naam + " is aangemeld");
        //
        // Set Active user profile in app
        //
        this.userService.activeUserProfile.next(obj);
        //
        // Navigeer naar "Home" Pagina
        this.router.navigate(["/home/" + this.sessionService.UrlPoolPointer]);
        //
      } else {
        alert("Geen geldige login");
      }
    });
  }

  PaswoordUpdate(usr: User) {
    const dbUserIndex = this.allUsers.findIndex(
      x => x.naam.toUpperCase() === usr.naam.toUpperCase()
    ); // Database user

    if (dbUserIndex === -1) {
      alert("Onbekende gebruiker");
      return;
    }

    // gekende gebruiker, werk paswoord bij
    const dbUser = this.allUsers[dbUserIndex];

    if (dbUser.paswoord.toUpperCase() !== usr.paswoord.toUpperCase()) {
      alert("Oud paswoord is niet correct");
      return;
    }

    // Set nieuw paswoord
    dbUser.paswoord = usr.paswoord2;

    this.dbUserService.Update(dbUser).then(objResult => {
      alert("Paswoord is bijgewerkt");

      // Bijwerken DB geslaagd
      this.formChanger = 0;
      this.form.reset();
    });
  }

  Create(usr: User) {
    // Check of gebruikersnaam al bestaat
    const dbUserIndex = this.allUsers.findIndex(
      x => x.naam.toUpperCase() === usr.naam.toUpperCase()
    ); // Database user

    if (dbUserIndex >= 0) {
      alert("Gebruikersnaam bestaat reeds");
      return;
    }

    // Create nieuw database user
    const newDbUser = new DBUser();
    newDbUser.id = 0;
    newDbUser.naam = usr.naam.toUpperCase();
    newDbUser.paswoord = usr.paswoord.toUpperCase();

    // Save to DB
    this.dbUserService.Create(newDbUser).then(objResult => {
      alert("Welkom! Account is aangemaakt.");

      // Bijwerken DB geslaagd
      this.formChanger = 0;
      this.form.reset();
    });
  }

  ActiveerPaswoordVeranderen() {
    this.form.clearAsyncValidators();
    // ACtiveer modus
    this.formChanger = 1;

    // Resetten van formulier
    // this.form.reset();
  }

  ActiveerCreateAccount() {
    // ACtiveer modus
    this.formChanger = 2;

    // Resetten van formulier
    // this.form.reset();
  }
}
