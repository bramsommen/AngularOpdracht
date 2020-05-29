import { HmiMgmtExchangeLIVEService } from "./../../../../_services/BaseData/Live Hubs/HmiMgmtExchangeLIVE.service";
import { DiGiInstellingenService } from "./../../../../_services/DiGiInstellingen.service";
import { HmiMgmtExchangeService } from "./../../../../_services/BaseData/HmiMgmtExchange.service";
import { BaseDataHmiMgmtExchange } from "./../../../../Models/BaseData/BaseDataHmiMgmtExchange";
import { BaseDataMachineOnderdeel } from "./../../../../Models/BaseData/BaseDataMachineOnderdeel";
import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";

@Component({
  selector: "app-HmiMgmtExchangeCrud",
  templateUrl: "./HmiMgmtExchangeCrud.component.html",
  styleUrls: ["./HmiMgmtExchangeCrud.component.css"],
})
export class HmiMgmtExchangeCrudComponent implements OnInit, OnDestroy {
  // PROP
  form: FormGroup;
  lstHmiMgmtValues: BaseDataHmiMgmtExchange[] = [];
  formVisible: boolean;

  // CONSTRUCTOR
  constructor(
    private fb: FormBuilder,
    private hmiMgmtExchangeService: HmiMgmtExchangeService,
    private digiSetup: DiGiInstellingenService,
    private hmiMgmtExchangeLIVEService: HmiMgmtExchangeLIVEService
  ) {}

  ngOnInit() {
    // Formulier validatie activeren
    this.FormValidation();

    // Live data connection
    this.hmiMgmtExchangeLIVEService.StartLiveData();

    // Bind lijst to service list
    this.hmiMgmtExchangeLIVEService.lstHmiMgmtValues.subscribe(
      (value: BaseDataHmiMgmtExchange[]) => (this.lstHmiMgmtValues = value)
    );
  }

  // Bij het verlaten van deze pagina, dispose alles "Live" resources
  @HostListener("unloaded")
  ngOnDestroy() {
    console.log("Component destroyed");
    this.hmiMgmtExchangeLIVEService.StopLiveDate();
  }

  FormValidation() {
    this.form = this.fb.group({
      id: [],
      machine: [],
      naam: ["", Validators.required],
      omschrijving: ["", Validators.required],
      value: [],
    });
  }

  // NEW FORM
  New() {
    this.form.reset();

    if (!this.formVisible) {
      this.formVisible = true;
    } else {
      this.formVisible = false;
    }
  }

  // Load Update
  LoadUpdate(obj: BaseDataHmiMgmtExchange) {
    this.form.reset();
    //
    //
    this.form.patchValue({
      id: obj.id,
      machine: obj.machine,
      naam: obj.naam,
      omschrijving: obj.omschrijving,
      value: obj.value,
    });

    // Scroll naar edit window
    window.scrollTo(0, 0);

    // weergeven van formulier
    this.formVisible = true;
  }

  // Form SUbmit
  Formsubmit() {
    if (this.form.valid) {
      // Get object from Form
      const obj = new BaseDataHmiMgmtExchange(this.form.value);

      if (obj.id === null) {
        // CREATE
        this.Create(obj);
      } else {
        // UDAPTE
        this.Update(obj);
      }
    }

    this.formVisible = false;
  }

  // CREATE
  Create(obj: BaseDataHmiMgmtExchange) {
    // Zoek hoogste sort waarde en voeg er één toe

    this.hmiMgmtExchangeService
      .Create(obj)
      .then((x) => {
        const joske = x;

        // Load/Refresh List
        this.hmiMgmtExchangeLIVEService.RefreshHmiMgmtList();

        this.form.reset();
      })
      .catch((fout) => {
        const kip = fout;
        const joske = fout;
      });
  }

  // UPDATE
  Update(obj: BaseDataHmiMgmtExchange) {
    this.hmiMgmtExchangeService.Update(obj).then((x) => {
      // Load/Refresh List
      this.hmiMgmtExchangeLIVEService.RefreshHmiMgmtList();
    });
  }

  // DELETE
  Delete(obj: BaseDataHmiMgmtExchange) {
    if (confirm("Bent u zeker dat u dit object wil verwijderen?")) {
      this.hmiMgmtExchangeService.Delete(obj).then((x) => {
        // Load/Refresh List
        this.hmiMgmtExchangeLIVEService.RefreshHmiMgmtList();
      });
    }
  }
}
