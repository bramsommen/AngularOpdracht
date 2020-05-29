import { Injectable } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class SessionService {
  constructor(private router: Router) {}

  UrlPoolPointer: string; // Poolnaam dat via url wordt meegegeven

  GetPoolName() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Uitlzen van start URL bij opstarten APP
        this.UrlPoolPointer = event.url;
      }
      //   console.log(event); // Laat alle events zien die door de router worden opgehaald - elke iteratie
    });
  }
}
