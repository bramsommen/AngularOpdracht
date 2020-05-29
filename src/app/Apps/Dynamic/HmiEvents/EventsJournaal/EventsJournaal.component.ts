import { UserService } from "./../../../../_services/user.service";
import { EventLogService } from "./../../../../_services/HmiEvents/EventLog.service";
import { Eventlog } from "./../../../../Models/HmiEvents/Eventlog";
import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-EventsJournaal",
  templateUrl: "./EventsJournaal.component.html",
  styleUrls: ["./EventsJournaal.component.css"],
})
export class EventsJournaalComponent implements OnInit {
  title = "app";

  defaultColDef = { resizable: true };

  columnDefs = [
    {
      headerName: "On",
      field: "onTime",

      sortable: true,
      //   filter: true,
      width: 200,
      valueFormatter: this.DateFormat,

      filter: "agDateColumnFilter",

      filterParams: {
        comparator: this.DateComparer,
      },
    },

    {
      headerName: "Off",
      field: "offTime",
      sortable: true,
      width: 200,
      valueFormatter: this.DateFormat,

      filter: "agDateColumnFilter",

      filterParams: {
        comparator: this.DateComparer,
      },
    },

    {
      headerName: "ID",
      field: "eventId",
      sortable: true,
      filter: "agNumberColumnFilter",
      width: 75,
      valueFormatter: this.NummerFormat,
    },

    {
      headerName: "Type",
      field: "event.type",
      sortable: true,
      filter: true,
      width: 125,
    },

    {
      headerName: "Omschtijving",
      field: "event.omschrijving",
      sortable: true,
      filter: true,
      flex: 1,
    },
  ];

  rowData: any;

  constructor(
    private http: HttpClient,
    private eventLogService: EventLogService,
    private userService: UserService
  ) {}

  DateComparer(filterLocalDateAtMidnight: Date, cellValue: string) {
    //"2019-09-11T11:04:17.393"

    const dateAsString = cellValue;
    if (dateAsString === null) {
      return -1;
    }

    // Parse string to NEW Date
    const cellDate = new Date(
      Number(dateAsString.substr(0, 4)), // Jaar
      Number(dateAsString.substr(5, 2)) - 1, // Maand
      Number(dateAsString.substr(8, 2)), // Dag
      Number(dateAsString.substr(11, 2)), // Uren
      Number(dateAsString.substr(14, 2)), // Minuten
      Number(dateAsString.substr(17, 2)) // Seconden
    );

    if (
      filterLocalDateAtMidnight.getFullYear() === cellDate.getFullYear() &&
      filterLocalDateAtMidnight.getMonth() === cellDate.getMonth() &&
      filterLocalDateAtMidnight.getDate() === cellDate.getDate()
    ) {
      // Als de datum gelijk is

      return 0;
    }
    if (cellDate < filterLocalDateAtMidnight) {
      return -1;
    }
    if (cellDate > filterLocalDateAtMidnight) {
      return 1;
    }
  }

  ngOnInit() {
    this.rowData = this.http.get(
      "http://192.168.0.199:8086/api/EventLog/GetFromApp?_appName=" +
        this.userService.staticActiveApp.machine
    );
  }

  NummerFormat(params) {
    return Number(params.value);
  }

  DateFormat(params) {
    const test: Date = new Date(Date.parse(params.value));

    return test;
  }
}
