import { BaseDataMachineOnderdeelService } from "./../../../../../_services/BaseData/BaseDataMachineOnderdeel.service";
import { BaseDataMachineOnderdeel } from "./../../../../../Models/BaseData/BaseDataMachineOnderdeel";
import { Component, OnInit, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-MachineOnderdeelSelector",
  templateUrl: "./MachineOnderdeelSelector.component.html",
  styleUrls: ["./MachineOnderdeelSelector.component.css"]
})
export class MachineOnderdeelSelectorComponent implements OnInit {
  @Output() selectMachineOnderdeel = new EventEmitter<
    BaseDataMachineOnderdeel
  >();

  lstMachineOnderdelen: BaseDataMachineOnderdeel[];

  selectedMachineOnderdeel: BaseDataMachineOnderdeel;

  constructor(
    private baseDataMachineOnderdeelService: BaseDataMachineOnderdeelService
  ) {}

  ngOnInit() {
    this.selectedMachineOnderdeel = null;

    // Ophalen van alle machine onderdelen
    this.GetFromMachine();
  }

  // READ
  GetFromMachine() {
    // Inlezen van alle modules
    this.baseDataMachineOnderdeelService
      .GetFromMachine()
      .then((obj: BaseDataMachineOnderdeel[]) => {
        // Er is reactie van de server, navigeer indien geldig
        if (obj != null) {
          console.log("Er zijn " + obj.length + " Objecten uit DB ingelezen");
          //
          // Set list to componen
          //
          this.lstMachineOnderdelen = obj;
        } else {
          console.log("Geen data gevonden in database");
        }
      });
  }

  Select(obj: BaseDataMachineOnderdeel) {
    // Local selected machine onderdeel
    this.selectedMachineOnderdeel = obj;

    // Send action to parent
    this.selectMachineOnderdeel.emit(obj);
  }
}
