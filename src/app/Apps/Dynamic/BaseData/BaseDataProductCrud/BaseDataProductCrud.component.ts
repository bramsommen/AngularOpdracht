import { BaseDataGlobalProductService } from "./../../../../_services/BaseData/BaseDataGlobalProduct.service";
import { BaseDataGlobalProduct } from "./../../../../Models/BaseData/BaseDataGlobalProduct";
import { BaseDataMachineOnderdeel } from "./../../../../Models/BaseData/BaseDataMachineOnderdeel";
import { BaseDataProductVersieCylusService } from "./../../../../_services/BaseData/BaseDataProductVersieCylus.Service";
import { BaseDataProductVersieCylus } from "./../../../../Models/BaseData/BaseDataProductVersieCylus";
import { BaseDataCyclusTypeService } from "./../../../../_services/BaseData/BaseDataCyclusType.service";
import { BaseDataCyclusType } from "./../../../../Models/BaseData/BaseDataCyclusType";
import { BaseDataCyclusService } from "./../../../../_services/BaseData/BaseDataCyclus.service";
import { BaseDataCyclusMaakInstelling } from "./../../../../Models/BaseData/BaseDataCyclusMaakInstelling";
import { BaseDataProductEigenschappenService } from "./../../../../_services/BaseData/BaseDataProductEigenschappen.service";
import { BaseDataCyclusMaakInstellingenService } from "./../../../../_services/BaseData/BaseDataCyclusMaakInstellingen.service";
import { BaseDataEigenschapServiceService } from "./../../../../_services/BaseData/BaseDataEigenschapService.service";
import { BaseDataProductEigenschap } from "./../../../../Models/BaseData/BaseDataProductEigenschap";
import { BaseDataProductVersieService } from "./../../../../_services/BaseData/BaseDataProductVersie.service";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { BaseDataProductVersie } from "./../../../../Models/BaseData/BaseDataProductVersie";
import { BaseDataProductService } from "./../../../../_services/BaseData/BaseDataProduct.service";
import { BaseDataProduct } from "./../../../../Models/BaseData/BaseDataProduct";
import { Component, OnInit } from "@angular/core";
import { BaseDataCyclus } from "src/app/Models/BaseData/BaseDataCyclus";

@Component({
  selector: "app-BaseDataProductCrud",
  templateUrl: "./BaseDataProductCrud.component.html",
  styleUrls: ["./BaseDataProductCrud.component.css"],
})
export class BaseDataProductCrudComponent implements OnInit {
  // PROPS
  selectedMachineOnderdeel: BaseDataMachineOnderdeel;

  lstProducten: BaseDataProduct[] = [];
  lstVersies: BaseDataProductVersieService[] = [];
  lstCyclusMaakInstellingen: BaseDataProductVersieService[] = [];
  lstPoolCyclussen: BaseDataCyclus[] = [];
  lstCyclusTypes: BaseDataCyclusType[] = [];
  lstCylusFromType: BaseDataCyclus[] = [];

  maakCyclussenVisible: boolean;

  selectedProduct: BaseDataProduct;
  selectedProductVersie: BaseDataProductVersie;
  selectedProductVersieCycle: BaseDataProductVersieCylus;
  selectedeCyclusType: BaseDataCyclusType;

  selectedToUpdateProduct: BaseDataProduct;

  pageYOffset: number; // Actueele Scroll Positie

  productFormVisible: boolean;

  // Sub-Venster voor selectie van producten
  artikelen: BaseDataGlobalProduct[] = [];

  zoekString: string;

  // Forms
  productForm: FormGroup;
  productVersieForm: FormGroup;
  productEigenschapForm: FormGroup;
  productCyclusWaardeForm: FormGroup;
  productCyclusVertragingForm: FormGroup;

  constructor(
    private baseDataProductService: BaseDataProductService,
    private baseDataProductVersieService: BaseDataProductVersieService,
    private baseDataProductVersieCylusService: BaseDataProductVersieCylusService,
    private baseDataProductEigenschapServiceService: BaseDataProductEigenschappenService,
    private baseDataProductCyclusMaakInstellingenService: BaseDataProductVersieService,
    private baseDataGlobalProductService: BaseDataGlobalProductService,
    private baseDataCyclusService: BaseDataCyclusService,
    private baseDataCyclusTypeService: BaseDataCyclusTypeService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    // Formulier validatie
    this.ProductFormValidation();
    this.ProductVersieFormValidation();
    this.ProductEigenschapFormValidation();
    this.ProductCyclusWaardeFormValidation();
    this.ProductCyclusVertragingFormValidation();

    //Get Alle beschikbare producten
    this.GetAllArtikelen();
  }

  GetAllArtikelen() {
    //
    this.baseDataGlobalProductService.GetAll().then((x) => {
      this.artikelen = x;
    });
  }

  selectMachineOnderdeel(obj: BaseDataMachineOnderdeel) {
    this.selectedMachineOnderdeel = obj;

    // Alle producten inlezen
    this.GetAllProducts();

    // Uitlezen van verschillende typce Cyclussen
    this.GetCyclusTypesFromMachineOnderdeel();

    // Set eigenschappen als standaard
    this.SetEigenschapVisible();

    // Set selected update prod
    this.selectedProduct = null;
    this.selectedProductVersie = null;
    this.selectedProductVersieCycle = null;
    this.selectedeCyclusType = null;
    this.selectedToUpdateProduct = null;
  }

  // Tab Visible
  SetEigenschapVisible() {
    // Geef eigenschappen TAB weer
    this.maakCyclussenVisible = false;

    // Reset gekozen maak instellings
    this.selectedProductVersieCycle = null;
    this.selectedeCyclusType = null;
  }

  SetMaakInstellingen() {
    this.maakCyclussenVisible = true;
  }

  // FORM VALIDATION
  ProductFormValidation() {
    this.productForm = this.fb.group({
      id: [],
      artikelCode: ["", Validators.required],
      omschrijving: ["", Validators.required],
    });
  }

  // READ
  GetCyclusTypesFromMachineOnderdeel() {
    // Inlezen van alle modules
    this.baseDataCyclusTypeService
      .GetFromMachineOnderdeel(this.selectedMachineOnderdeel.id)
      .then((obj: BaseDataCyclusType[]) => {
        // Er is reactie van de server, navigeer indien geldig
        if (obj != null) {
          console.log("Er zijn " + obj.length + " Objecten uit DB ingelezen");
          //
          // Set list to componen
          //
          this.lstCyclusTypes = obj;
        }
      });
  }

  ProductVersieFormValidation() {
    this.productVersieForm = this.fb.group({
      id: [],
      productId: [],
      foto: [],
      cad3d: [],
      cad2d: [],
      pdf: [],
      naam: ["", Validators.required],
      versie: [],
      status: [],
    });
  }

  ProductEigenschapFormValidation() {
    this.productEigenschapForm = this.fb.group({
      waarde: [],
    });
  }

  ProductCyclusWaardeFormValidation() {
    this.productCyclusWaardeForm = this.fb.group({
      waarde: [],
    });
  }

  ProductCyclusVertragingFormValidation() {
    this.productCyclusVertragingForm = this.fb.group({
      vertraging: [],
    });
  }

  /////
  /////
  //// PRODUCT METHODS
  GetAllProducts() {
    // Ophalen van alle producten uit DB
    this.baseDataProductService
      .GetFromMachineOnderdeel(this.selectedMachineOnderdeel.id)
      .then((x) => {
        // Set lijst producten
        this.lstProducten = x;

        this.UpdateVersieStatus(); // status "er is een versie in productie" bijwerken voor UI;

        if (this.lstProducten === null) {
          // Geen producten
          return;
        }

        if (this.selectedProduct === null) {
          // Geen selected product
          return;
        }

        // Reload Geslecteerd product vanuit nieuwe lijst
        const index: number = this.lstProducten.findIndex(
          (x) =>
            x.artikelCode.toUpperCase() ===
            this.selectedProduct.artikelCode.toUpperCase()
        );

        if (index >= 0) {
          // Er is een artikel gevonden op basis van Artikel Code
          this.selectedProduct = this.lstProducten[index];
        } else {
          // Geen resultaat, reset selected product
          this.selectedProduct = null;
        }
      });
  }

  UpdateVersieStatus() {
    // Als er een versie van een product status "in productie heeft" zet dan in het product object de boolean "productieVersieAanwezig"
    for (let obj of this.lstProducten) {
      if (obj.productVersie != null) {
        if (obj.productVersie.findIndex((x) => x.status === 2) >= 0) {
          obj.productieVersieAanwezig = true;
        } else {
          obj.productieVersieAanwezig = false;
        }
      }
    }
  }

  DropDownSelectProduct(obj: BaseDataProduct) {
    // Reset Selected Product
    this.selectedProductVersie = null;
    this.selectedProduct = null;

    // Load Selected Product
    this.SelectProduct(obj);
  }

  SelectProduct(obj: BaseDataProduct) {
    this.baseDataProductService.GetFromID(obj.id).then((x) => {
      // Set selected product
      this.selectedProduct = x;
    });

    // Set geselecteerd product
    this.selectedProduct = obj;

    // Reload Selected Versie
    if (this.selectedProductVersie != null) {
      // Als deze call wordt gedaan wanneer er reeds een versie was geselecteerd, open deze dan trug
      this.SelectVersie(this.selectedProductVersie);
    }
  }

  NieuwProduct() {
    // Init formulier
    this.productForm.reset();

    if (this.productFormVisible === true) {
      // Formulier verbergen
      this.productFormVisible = false;
    } else {
      // Formulier weergeven
      this.productFormVisible = true;
    }
  }

  LoadUpdateProduct(
    obj: BaseDataProduct // Product inladen in form
  ) {
    // Set to update product
    this.selectedToUpdateProduct = obj;

    this.productForm.patchValue({
      id: obj.id,
      artikelCode: obj.artikelCode,
      omschrijving: obj.omschrijving,
    });

    // Formulier weergeven
    this.productFormVisible = true;
  }

  DeleteProduct(obj: BaseDataProduct) {
    if (
      confirm("Bent u zeker dat u dit Artikel en alle versies wil verwijderen?")
    ) {
      // Delete Product
      this.baseDataProductService.Delete(obj).then((x) => {
        // delete selected product
        this.selectedProduct = null;
        this.selectedProductVersie = null;
        this.selectedProductVersieCycle = null;
        this.selectedeCyclusType = null;

        // Reload Producten
        this.GetAllProducts();
      });
    }
  }

  ProductFormSubmit(selectedGlobalproduct: BaseDataGlobalProduct) {
    // Maak  nieuw product aan

    // Get from object
    const obj = new BaseDataProduct();
    obj.id = 0;
    obj.artikelCode = selectedGlobalproduct.artikelCode.toUpperCase();
    obj.machineOnderdeelId = this.selectedMachineOnderdeel.id;
    obj.omschrijving = "";

    // Controleer of dit product nog niet bestaat
    const index = this.lstProducten.findIndex(
      (x) => x.artikelCode.toUpperCase() === obj.artikelCode.toUpperCase()
    );

    // Controleren of de artikelcode al bestaat, enkel voor nieuwe producten
    if (index >= 0) {
      alert("Deze artikelcode bestaat reeds voor dit machine onderdeel");
      return;
    }
    // Set tmp selected product

    // Nieuw Product aanmaken
    // Save Product to DB
    this.baseDataProductService.Create(obj).then((x) => {
      // Set Selected
      this.selectedProduct = obj;

      // Reset alle onderliggende selected objecten
      this.selectedProductVersie = null;
      this.selectedProductVersieCycle = null;
      this.selectedeCyclusType = null;

      // Refresh product list
      this.GetAllProducts();

      // Reset Form.
      this.productForm.reset();

      // Rest update product
      this.selectedToUpdateProduct = null;
    });

    // Verbergen van formulier
    this.productFormVisible = false;
  }

  CopyProduct(obj: BaseDataProduct) {
    // Check of er in dit product een versie heeft dat status "In Productie" heeft.

    const lstVersie: BaseDataProductVersie[] = obj.productVersie.filter(
      (x) => x.status === 2
    );

    if (lstVersie.length > 0) {
      // Er is minimaal één versie met status "in productie"

      this.baseDataProductService.Copy(obj.id).then((x) => {
        // Set Selected
        this.selectedProduct = obj;
        this.selectedProduct.artikelCode =
          this.selectedProduct.artikelCode + "(COPY)"; // Artikelcode aanvullen met COPY

        // Reset selected Product items
        this.selectedProductVersie = null;
        this.selectedProductVersieCycle = null;
        this.selectedeCyclusType = null;

        // Reload Producten
        this.GetAllProducts();
      });
    } else {
      alert(
        "Sorry, Dit product kan niet gekopieerd worden omdat er geen product versie met status 'In Productie' werd gevonden."
      );
    }
  }
  /////
  /////
  //// PRODUCT VERSIE METHODS
  SelectVersie(obj: BaseDataProductVersie) {
    // Haal Info Van Vesrie
    this.GetVersie(obj.id);
  }

  GetVersie(versieID: number) {
    // Reset selected product versie

    // Ophalen van Versie Details
    this.baseDataProductVersieService.GetFrom(versieID).then((x) => {
      // Set Selected product versie
      this.selectedProductVersie = x;

      // Als er reeds een cyclus type geselceerd was, refresh dan deze info
      if (this.selectedeCyclusType != null) {
        this.SelectCyclusType(this.selectedeCyclusType);
      }

      if (x === null) {
        return;
      }

      // Load form
      this.LoadProductieVesriesForm(x);
    });
  }

  CreateBlancoVersie(obj: BaseDataProduct) {
    if (this.selectedProduct.productVersie.length >= 10) {
      alert("Maximaal aantal versies (10) bereikt");
      return;
    }
    // Create blanco versie
    this.baseDataProductVersieService.CreateFromTemplate(obj).then((x) => {
      // Get all
      this.SelectProduct(obj);
    });
  }

  CopyVersie(obj: BaseDataProductVersie) {
    if (this.selectedProduct.productVersie.length >= 10) {
      alert("Maximaal aantal versies (10) bereikt");
      return;
    }
    // Create blanco versie
    this.baseDataProductVersieService
      .CreateNewFromOtherVersion(obj)
      .then((x) => {
        // Reload versie
        this.SelectProduct(this.selectedProduct);

        // Reload Producten
        this.GetAllProducts();
      });
  }

  SubmitProductVersieForm() {
    // Haal object uit formulier
    const obj = new BaseDataProductVersie(this.productVersieForm.value);

    if (obj.status !== this.selectedProductVersie.status) {
      // Status wordt veranded
      //
      // 1) controleer of onderliggende maak cyclussen ingevuld zijn
      if (obj.status === 2) {
        if (
          this.selectedProductVersie.productVersieCyclus.length !=
          this.lstCyclusTypes.length
        ) {
          alert(
            "Deze versie kan niet in productie want niet alle cyclus types hebben een invulling."
          );
          // Reload actuele versie
          this.SelectVersie(this.selectedProductVersie);
          return;
        }
      }

      //
      // 2 ) Valideer versie
      this.baseDataProductVersieService
        .ValidateVersie(obj.id)
        .then((validatieResult) => {
          //
          //

          if (validatieResult !== "OK") {
            // Er is een probleem met de vesrie
            alert(
              "Fout bij versie validatie! Controleer eigenschappen!  " +
                validatieResult
            );

            // Reload actuele versie
            this.SelectVersie(this.selectedProductVersie);
            return;
          } else {
            // Versie is OK, update is toegestaan
            this.UpdateProductVersie(obj);
          }
        });
    } else {
      // Versie is niet veranderd, dus updaten is toegestaan
      this.UpdateProductVersie(obj);
    }
  }

  UpdateProductVersie(obj: BaseDataProductVersie) {
    // Update
    // Update Database
    this.baseDataProductVersieService.Update(obj).then((x) => {
      // Reload versie
      this.SelectProduct(this.selectedProduct);

      // Reload Producten
      this.GetAllProducts();
    });
  }

  // Delete ProductVersie
  DeleteProductVersie(obj: BaseDataProductVersie) {
    if (obj.status === 2) {
      alert(
        "Product Versies met status 'Productie' kunnen niet verwijderd worden."
      );
      return;
    }

    if (
      confirm(
        "Bent u zeker dat u deze versie met al zijn eigenschappen wil verwijderen?"
      )
    ) {
      this.baseDataProductVersieService.Delete(obj).then((x) => {
        // Refresh Product
        this.SelectProduct(this.selectedProduct);
      });
    }
  }

  // UPDATE
  LoadProductieVesriesForm(obj: BaseDataProductVersie) {
    // Reset het huidige formulier
    this.productVersieForm.reset();
    //
    //
    this.productVersieForm.patchValue({
      id: obj.id,
      productId: obj.productId,
      foto: obj.foto,
      cad3d: obj.cad3d,
      cad2d: obj.cad2d,
      pdf: obj.pdf,
      naam: obj.naam,
      versie: obj.versie,
      status: obj.status,
    });
  }

  /////
  /////
  // PRODUCT EIGENSCHAPPEN
  UpdateProductEigenschapCheck(obj: BaseDataProductEigenschap) {
    // In vert checkbox
    obj.check = !obj.check;

    this.UpdateProductEigenschap(obj);
  }

  UpdateProductEigenschapWaarde(obj: BaseDataProductEigenschap) {
    // Get actuele scroll positie
    this.pageYOffset = window.pageYOffset;

    // Get from object
    const formObj = new BaseDataProductEigenschap(
      this.productEigenschapForm.value
    );

    // Check waarde is correct
    if (!this.CheckWaarde(formObj.waarde, obj.eigenschap.dataType)) {
      alert("Waarde voldoet niet aan type: " + obj.eigenschap.dataType);
      return;
    }

    // Als er geen waarde van het formulier komt
    if (formObj.waarde === null) {
      return;
    }

    // Set nietuwe waarde
    obj.waarde = formObj.waarde;

    // Reset Form
    this.productEigenschapForm.reset();

    // Update Database
    this.UpdateProductEigenschap(obj);
  }

  UpdateProductEigenschap(obj: BaseDataProductEigenschap) {
    // Update database
    this.baseDataProductEigenschapServiceService.Update(obj).then((x) => {
      // Reload data after update
      this.SelectVersie(this.selectedProductVersie);
    });
  }
  ///
  ///
  /// Cyclus Maak Instellingen
  SelectCyclusType(obj: BaseDataCyclusType) {
    // Instelen van gekozen Cyclus Type
    this.selectedeCyclusType = obj;

    const idx = this.selectedProductVersie.productVersieCyclus.findIndex(
      (x) => x.cyclus.cyclusTypeId === obj.id
    );

    if (idx >= 0) {
      // Er is een cyclus aanwezig van dit type

      // Set geselcteerde cyclus
      this.selectedProductVersieCycle = this.selectedProductVersie.productVersieCyclus[
        idx
      ];
    } else {
      this.selectedProductVersieCycle = null;
    }

    // Ophalen van mogelijk Cylussen
    this.GetFromCyclusType(obj);

    // Activeer TAB
    this.SetMaakInstellingen();
  }

  GetFromCyclusType(obj: BaseDataCyclusType) {
    this.baseDataCyclusService.GetFromCyclusType(obj.id).then((x) => {
      // Set Respons
      this.lstCylusFromType = x;
    });
  }

  AddCyclusToProductVersie(obj: BaseDataCyclus) {
    // Create nieuwe Product Versie Cyclus
    const newBaseDataProductVersieCylus = new BaseDataProductVersieCylus();
    newBaseDataProductVersieCylus.id = 0;
    newBaseDataProductVersieCylus.cyclusId = obj.id;
    newBaseDataProductVersieCylus.cyclus = null;
    newBaseDataProductVersieCylus.productVersieId = this.selectedProductVersie.id;

    // Save to DB
    this.baseDataProductVersieCylusService
      .Create(newBaseDataProductVersieCylus)
      .then((x) => {
        // Reload data after update
        this.SelectVersie(this.selectedProductVersie);
      });
  }

  // Verwijder ProductieMaakCyclus
  DeleteProductieMaakCylus() {
    // Verwijder Actieve Product Versie Cyclus
    if (this.selectedProductVersieCycle != null) {
      this.baseDataProductVersieCylusService
        .Delete(this.selectedProductVersieCycle)
        .then((x) => {
          // Reload data after update
          this.SelectVersie(this.selectedProductVersie);
        });
    }
  }

  //
  // ALGEMEEN
  CheckWaarde(waarde: string, type: string): boolean {
    // Bepaal of de strin correct is afhankelijk van het type

    switch (type) {
      case "Integer": {
        if (Number(waarde) != parseInt(waarde, 10)) {
          // Waarde is niet geconverteerd
          return false;
        } else {
          // Waarde is geconverteerd
          return true;
        }
        break;
      }
      case "String": {
        return true;
        break;
      }

      case "Decimal": {
        if (isNaN(Number(waarde))) {
          // Waarde is niet geconverteerd
          return false;
        } else {
          // Waarde is geconverteerd
          return true;
        }
        break;
      }

      case "Boolean": {
        if (waarde === "0" || waarde === "1") {
          return true;
        } else {
          return false;
        }

        break;
      }
      default: {
        return false;
      }
    }
  }
}
