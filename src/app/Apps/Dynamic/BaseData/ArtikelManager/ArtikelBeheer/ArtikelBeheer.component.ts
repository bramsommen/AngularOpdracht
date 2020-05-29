import { BaseDataMachineOnderdeelService } from "./../../../../../_services/BaseData/BaseDataMachineOnderdeel.service";
import { BaseDataMachineOnderdeel } from "./../../../../../Models/BaseData/BaseDataMachineOnderdeel";
import { Subject } from "rxjs";
import { BaseDataGlobalProductEigenschap } from "./../../../../../Models/BaseData/BaseDataGlobalProductEigenschap";
import { BaseDataGlobalProduct } from "./../../../../../Models/BaseData/BaseDataGlobalProduct";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { BaseDataGlobalProductService } from "./../../../../../_services/BaseData/BaseDataGlobalProduct.service";
import { UserService } from "./../../../../../_services/user.service";
import { BaseDataGlobalProductEigenschapService } from "./../../../../../_services/BaseData/BaseDataGlobalProductEigenschap.service";
import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { CellValueChangedEvent } from "ag-grid-community";

@Component({
  selector: "app-ArtikelBeheer",
  templateUrl: "./ArtikelBeheer.component.html",
  styleUrls: ["./ArtikelBeheer.component.css"],
})
export class ArtikelBeheerComponent implements OnInit {
  // PROPS
  artikelen: BaseDataGlobalProduct[] = [];
  algemeenForm: FormGroup;
  copyForm: FormGroup;

  zoekString: string;

  selectedArtikel: BaseDataGlobalProduct;
  selectedEigenschapRow: BaseDataGlobalProductEigenschap;

  rowData: any;

  baseDataMachineOnderdelen: BaseDataMachineOnderdeel[] = [];

  gridOptions = {
    columnDefs: [
      {
        headerName: "Naam",
        field: "naam",
        editable: true,
        width: 250,
      },
      { headerName: "Waarde", field: "waarde", editable: true, width: 100 },

      {
        headerName: "Omschrijving",
        field: "omschrijving",
        editable: true,
        flex: 1,
      },

      {
        headerName: "DataType",
        field: "dataType",
        editable: true,
        width: 175,
      },
    ],
    defaultColDef: {
      width: 150,
      sortable: false,
      resizable: true,
      filter: true,
    },
    getRowHeight: this.getRowHeight,
  };

  constructor(
    private baseDataGlobalProductEigenschapService: BaseDataGlobalProductEigenschapService,
    private baseDataGlobalProductService: BaseDataGlobalProductService,
    private baseDataMachineOnderdeelService: BaseDataMachineOnderdeelService,
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  getRowHeight(params) {
    return 50;
  }

  OnRowEdit(obj: CellValueChangedEvent) {
    ////
    const rowObject = obj.data as BaseDataGlobalProductEigenschap;
    //

    this.baseDataGlobalProductEigenschapService
      .Update(rowObject)
      .then((x) => this.GetAllArtikelen());
  }
  onCellClicked(obj: CellValueChangedEvent) {
    ////
    const rowObject = obj.data as BaseDataGlobalProductEigenschap;
    //

    this.selectedEigenschapRow = rowObject;
  }

  ngOnInit() {
    this.AlgemeenFormValidation();
    this.copyFormvalidateion();
    this.selectedEigenschapRow = null;
    this.rowData = new Subject();

    this.selectedArtikel = null;

    // Load alle artikelen
    this.GetAllArtikelen();

    this.GetMachineOnderdelen();
  }

  GetMachineOnderdelen() {
    this.baseDataMachineOnderdeelService.GetAll().then((x) => {
      this.baseDataMachineOnderdelen = x;
    });
  }

  AlgemeenFormValidation() {
    this.algemeenForm = this.fb.group({
      artikelCode: ["", Validators.required],
      naam: ["", Validators.required],
      omschrijving: ["", Validators.required],
    });
  }

  copyFormvalidateion() {
    this.copyForm = this.fb.group({
      copyArtikelCode: ["", Validators.required],
    });
  }

  LoadAlgemeenForm(obj: BaseDataGlobalProduct) {
    this.algemeenForm.patchValue({
      artikelCode: obj.artikelCode,
      naam: obj.naam,
      omschrijving: obj.omschrijving,
    });
  }

  GetAllArtikelen() {
    //
    this.baseDataGlobalProductService.GetAll().then((x) => {
      this.artikelen = x;

      if (this.artikelen.length === 0) {
        this.selectedArtikel = null;
        return;
      }

      // Reload selected artikel
      if (this.selectedArtikel !== null) {
        const index = this.artikelen.findIndex(
          (x) =>
            x.artikelCode.toUpperCase() ===
            this.selectedArtikel.artikelCode.toUpperCase()
        );
        if (index >= 0) {
          this.SelectArtikel(this.artikelen[index]);
        }
      }
    });
  }

  AddNewArtikel() {
    // Check input
    if (this.zoekString === null) {
      alert("Geen artikelcode opgegeven");
      return;
    }

    if (this.zoekString === undefined) {
      alert("Geen artikelcode opgegeven");
      return;
    }

    if (this.zoekString === "") {
      alert("Geen artikelcode opgegeven");
      return;
    }

    if (this.checkOfArtikelCodeBestaat(this.zoekString)) {
      alert("Deze code bestaat reeds");
      return;
    }

    const newGlobalProduct = new BaseDataGlobalProduct();
    newGlobalProduct.artikelCode = this.zoekString.toUpperCase();
    newGlobalProduct.naam = this.zoekString.toUpperCase();
    newGlobalProduct.omschrijving = "Nieuw Product";
    newGlobalProduct.eigenschappen = null;

    // Save tot Database
    this.baseDataGlobalProductService.Create(newGlobalProduct).then((x) => {
      this.GetAllArtikelen();
    });

    const gb = new BaseDataGlobalProduct();
    gb.artikelCode = newGlobalProduct.artikelCode;
    gb.eigenschappen = null;
    gb.naam = "";
    gb.omschrijving = "";

    this.selectedArtikel = gb;
  }

  checkOfArtikelCodeBestaat(newArtikelCode: string): boolean {
    // Check of deze code reeds bestaat
    if (this.artikelen !== null) {
      const index = this.artikelen.findIndex(
        (x) => x.artikelCode.toUpperCase() === newArtikelCode.toUpperCase()
      );

      if (index >= 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  UpdateArtikel() {
    const obj = new BaseDataGlobalProduct(this.algemeenForm.value);

    if (this.algemeenForm.invalid === true) {
      alert("Formulier niet geldig");
      return;
    }

    // UPDATE

    this.baseDataGlobalProductService.Update(obj).then((x) => {
      this.GetAllArtikelen();
    });
  }

  SelectArtikel(obj: BaseDataGlobalProduct) {
    // Reset forms
    this.algemeenForm.reset();
    this.copyForm.reset();
    this.selectedEigenschapRow = null;

    this.selectedArtikel = obj;

    // Formulier inladen
    this.LoadAlgemeenForm(obj);

    this.rowData.next(this.selectedArtikel.eigenschappen);
  }

  CopyFrom() {
    // CHeck of er een source object opgegegevn is.
    if (this.selectedArtikel === null) {
      return null;
    }

    if (this.copyForm.invalid === true) {
      alert("Formulier niet geldig");
      return;
    }

    const nieuweArtikelCode = this.copyForm.get("copyArtikelCode").value;

    if (this.checkOfArtikelCodeBestaat(nieuweArtikelCode)) {
      alert("Deze code bestaat reeds");
      return;
    }

    // Maak als selected product een object met de nieuwe artikelcode, zodat na een reload deze zal wordt geopend
    // CopyCommand
    this.baseDataGlobalProductService
      .CopyFrom(this.selectedArtikel, nieuweArtikelCode)
      .then((x) => {
        this.GetAllArtikelen();
      });

    const gb = new BaseDataGlobalProduct();
    gb.artikelCode = nieuweArtikelCode;
    gb.eigenschappen = null;
    gb.naam = "";
    gb.omschrijving = "";

    this.selectedArtikel = gb;
  }

  DeleteArtikel() {
    if (!confirm("Bent u zeker dat u dit object wil verwijderen?")) {
      return;
    }

    if (
      !confirm(
        "Als u nu verder gaat worden alle productie gegevens over dit product definitief verwijdert!"
      )
    ) {
      return;
    }

    this.baseDataGlobalProductService.Delete(this.selectedArtikel).then((x) => {
      this.selectedArtikel = null;
      this.GetAllArtikelen();
    });
  }

  DeleteEigenschap() {
    if (this.selectedEigenschapRow === null) {
      return;
    }

    this.baseDataGlobalProductEigenschapService
      .Delete(this.selectedEigenschapRow)
      .then((x) => {
        this.GetAllArtikelen();

        this.selectedEigenschapRow = null;
      });
  }

  CreateBlancoEigenschap() {
    if (this.selectedArtikel === null) {
      return;
    }

    const newGlobalProductEigenschap = new BaseDataGlobalProductEigenschap();
    newGlobalProductEigenschap.id = 0;
    newGlobalProductEigenschap.artikelCode = this.selectedArtikel.artikelCode;
    newGlobalProductEigenschap.sort = 0;
    newGlobalProductEigenschap.naam = "New";
    newGlobalProductEigenschap.omschrijving = "";
    newGlobalProductEigenschap.dataType = "";

    newGlobalProductEigenschap.waarde = "";

    this.baseDataGlobalProductEigenschapService
      .Create(newGlobalProductEigenschap)
      .then((x) => {
        this.GetAllArtikelen();

        this.selectedEigenschapRow = null;
      });
  }

  SelectMachineonderdeel(
    obj: BaseDataMachineOnderdeel // Eigenschappen toevoegen gedefinierd onder een machine onderdeel. // Enkel eigenschapsnamen die niet voorkomen, worden toegevoegd
  ) {
    this.baseDataGlobalProductEigenschapService
      .AddEigenschapFromMachineonderdeel(
        this.selectedArtikel.artikelCode,
        obj.id
      )
      .then((x) => {
        this.GetAllArtikelen();
      });
  }
}
