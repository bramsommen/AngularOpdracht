import { DBUserAppRolesTag } from "./../../../../../Models/DiGi/DbModels/DBUserAppRolesTag";
import { DBRoleTag } from "./../../../../../Models/DiGi/DbModels/DBRoleTag";
import { DBApp } from "./../../../../../Models/DiGi/DbModels/DBApp";
import { DbUserService } from "./../../../../../_services/DiGI/dbUser.service";
import { RoleTagService } from "./../../../../../_services/DiGI/RoleTag.service";
import { AppsService } from "./../../../../../_services/DiGI/Apps.service";
import { UserAppRolesTagsService } from "./../../../../../_services/DiGI/UserAppRolesTags.service";
import { HttpClient } from "@angular/common/http";
import { DBUser } from "./../../../../../Models/DiGi/DbModels/DBUser";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-GebuikersAppsEditor",
  templateUrl: "./GebuikersAppsEditor.component.html",
  styleUrls: ["./GebuikersAppsEditor.component.css"]
})
export class GebuikersAppsEditorComponent implements OnInit {
  selectedUser: DBUser;
  selectedApp: DBApp;

  lstUsers: DBUser[] = []; // Alle gebruikers
  lstApps: DBApp[] = []; // Alle Apps
  lstRoleTags: DBRoleTag[] = []; // Alle roletags

  myApps: DBApp[] = []; // User zijn Apps
  myAppRoleTags: DBRoleTag[] = []; // user zijn App role tags

  constructor(
    private userService: DbUserService,
    private appService: AppsService,
    private roleTagService: RoleTagService,

    private userRoleTagsService: UserAppRolesTagsService
  ) {}

  ngOnInit() {
    this.GetAllUsers(); // Alle beschikbare gebruikers inlezen
    this.GetAllApps(); // Alle Apps inlezen
    this.GetAllRoleTags(); // Alle roletags inlezen

    this.myApps = null;
    this.myAppRoleTags = null;
  }

  GetAllUsers() {
    this.userService.GetAll().then(x => {
      this.lstUsers = x;
    });
  }

  GetAllApps() {
    this.appService.GetAll().then(x => {
      this.lstApps = x;
    });
  }

  GetAllRoleTags() {
    this.roleTagService.GetAll().then(x => {
      this.lstRoleTags = x;
    });
  }

  GetAllAppsFromUser() {
    this.myApps = null;
    this.myAppRoleTags = null;
    this.selectedApp = null;

    this.userRoleTagsService.GetAppsFromUser(this.selectedUser.id).then(x => {
      this.myApps = x;
    });
  }

  GetAllRoleTagsFromUserApp() {
    this.myAppRoleTags = null;

    this.userRoleTagsService
      .GetRoleTagsFromUserApps(this.selectedUser.id, this.selectedApp.id)
      .then(x => {
        this.myAppRoleTags = x;
      });
  }

  SelectUser(usr: DBUser) {
    this.selectedUser = usr;
    this.selectedApp = null;
    this.myApps = null;
    this.myAppRoleTags = null;
    this.GetAllAppsFromUser(); // ophalen van beschikbare apps
  }

  SelectApp(app: DBApp) {
    this.selectedApp = app;

    this.GetAllRoleTagsFromUserApp();
  }

  AddApp(app: DBApp) {
    this.selectedApp = null;
    this.myAppRoleTags = null;
    if (this.selectedUser != null) {
      this.myApps.push(app);
    } else {
      alert("Geen Gebruiker geselecteerd");
    }
  }

  AddAppRoleTag(roleTag: DBRoleTag) {
    if (this.selectedApp === null) {
      // Check geselecteerde User
      alert("Geen gebruiker geselecteerd");
      return;
    }

    if (this.selectedApp === null) {
      // Chek geselecteerde App
      alert("Geen App Geselecteerd");
      return;
    }

    // Create Role Tag
    const newUART = new DBUserAppRolesTag();
    newUART.usersId = this.selectedUser.id;
    newUART.appsId = this.selectedApp.id;
    newUART.rolesTagsId = roleTag.id;

    this.userRoleTagsService.Create(newUART).then(x => {
      // Refresh DB User App Role Tags
      this.GetAllRoleTagsFromUserApp();
    });
  }

  DeleteRoleTag(appRoleTag: DBRoleTag) {
    if (this.selectedApp === null) {
      // Check geselecteerde User
      alert("Geen gebruiker geselecteerd");
      return;
    }

    if (this.selectedApp === null) {
      // Chek geselecteerde App
      alert("Geen App Geselecteerd");
      return;
    }

    // construct DB UserAppRoleTag
    const delUART = new DBUserAppRolesTag();
    delUART.usersId = this.selectedUser.id;
    delUART.appsId = this.selectedApp.id;
    delUART.rolesTagsId = appRoleTag.id;

    this.userRoleTagsService.Delete(delUART).then(x => {
      // Refresh DB User App Role Tags
      this.GetAllRoleTagsFromUserApp();
    });
  }
}
