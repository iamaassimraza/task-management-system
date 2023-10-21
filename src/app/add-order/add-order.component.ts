import { Directive, Component, OnInit, HostListener, ViewChild, ChangeDetectorRef, Input, ElementRef } from '@angular/core';
import {
  FormBuilder, FormGroupDirective, FormGroup, FormArray, NgForm, Validators, FormControl,
  FormControlName, FormArrayName,
} from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { OrderService } from '../Apis/order.service';
import { OtherService } from '../Apis/other.service';
import { GetApisService } from '../Apis/get-apis.service';
import { BusinessAddressService } from '../Apis/business-address.service';
import { emitDistinctChangesOnlyDefaultValue } from '@angular/compiler';
import { ServicesService } from '../Apis/services.service';
import { UserService } from '../Apis/user.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { PackageService } from '../Apis/package.service';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionPanel } from '@angular/material/expansion';
declare var google: any;

const phoneRegex = /^\+?\d{10,14}$/;
function phoneValidator(control: FormControl): { [key: string]: any } | null {
  const valid = phoneRegex.test(control.value);
  return valid ? null : { invalidPhone: true };
}
/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.css']
})
export class AddOrderComponent {
  ownRegisteredAgentOpened=false;
  registeredAgentCompanyOpened=false;

  matcher = new MyErrorStateMatcher();
  @ViewChild('accordion1',) accordion1!: ElementRef;
  @ViewChild('top',) topDiv!: ElementRef;
  @ViewChild('duration') duration !: ElementRef;
  @ViewChild('collapse1',) collapse1!: ElementRef;
  @ViewChild('accordion2',) accordion2!: ElementRef;
  @ViewChild('collapse2') collapse2!: ElementRef;
  @ViewChild('membersPanelRef') membersPanelRef!: MatExpansionPanel;
  @ViewChild('managersPanelRef') managersPanelRef!: MatExpansionPanel;

  @ViewChild('openExpansion') openExpansion!: ElementRef;

  // GOOGLE PLACES START
  @ViewChild('clientAddress_street') clientAddress_streetField!: ElementRef;
  @ViewChild('clientAddress_zipcode') clientAddress_zipcodeField!: ElementRef;
  @ViewChild('Contact_address') Contact_addressField!: ElementRef;
  @ViewChild('Contact_zip') Contact_zipField!: ElementRef;
  @ViewChild('Agent_address') Agent_addressField!: ElementRef;
  @ViewChild('Agent_zip') Agent_zipField!: ElementRef;
  @ViewChild('SSN_holder_address') SSN_holder_addressField!: ElementRef;
  @ViewChild('SSN_holder_zipcode') SSN_holder_zipcodeField!: ElementRef;
  // GOOGLE PLACES END
  members: any[] = [];
  isTakeAddOns = false;
  paymentHandler: any = null;
  isResumeOrder = '';
  isSelected = '';
  isEINinAddon = false;
  isResellerinAddon = false
  isBankinAddon = false;
  isAmazoninAddon = false;
  businessAddress: any = '';
  selectedAddressIndex: any;
  invalidEquity=false;
  goldPkg: any[] = [
    { name: 'Operating Agreement', price: 100 },
    { name: 'IRS Form 2553', price: 150 },
    { name: 'Online Dashboard Access', price: 70 },
    { name: 'Lifelong Company Alerts', price: 80 },
    { name: 'Consultation On Business Tax', price: 15 },
    { name: 'Unlimited Phone And Email Support', price: 25 },
    { name: 'EIN', price: 100 },
    { name: 'Reseller Certificate', price: 120 },
  ];

  platinumPkg: any[] = [
    { name: 'Preparing and filing Article of Organization.', price: 100 },
    // { name: 'One-year free Registered Agent Service', price: 150 },
    { name: 'Operating Agreement', price: 70 },
    { name: 'IRS Form 2553', price: 80 },
    { name: 'Online Dashboard Access', price: 15 },
    { name: 'Lifelong Company Alerts', price: 25 },
    { name: 'Consultation on Business Tax', price: 100 },
    { name: 'Unlimited Phone and Email support', price: 120 },
    { name: 'EIN', price: 80 },
    { name: 'Reseller Certificate', price: 120 },
  ];
  //use_existing_user_detail variables START
  existing_detail_check_box = false;
  use_existing_user_detail_contact_person: boolean = true;
  use_existing_user_detail_mailing_address = true;
  use_existing_user_detail_agent = true;
  use_existing_user_detail_company = true;
  use_existing_user_detail_members = true;
  use_existing_user_detail_managers = true;
  use_existing_user_detail_tax = true;
  use_existing_user_detail_tax_address = true;
  use_existing_user_detail_card_holder = true;
  accordian_variable: any = false;
  isActive = 'private';
  use_existing_user_detail = true;
  public selectedIndex: any;
  user_detail: any[] = [];
  div_click = false;
  myarray: any[] = [];
  allmembers: any[] = [];
  allmanagers: any[] = [];
  addOnsArray: any[] = [];
  packageArray: any[] = [];
  selectedPkg: any[] = [];
  allBills: any[] = [];
  isUpgradePkg = false;
  isUpgradePkgTaxForm = false;
  disabled = false;
  our_address = false;
  own_address = false;
  default_index: any = 0;
  border1: any = true;
  order_array: any[] = [];
  temp_status = '';
  isEditClicked = false;
  // crossHide: any = true;
  buttonClicked = false;
  invalidBusinessAddress: any = '';
  company_div = false;
  account_datails_div = false;
  mailling_address_div = false;
  members_div = false;
  managers_div = false;
  agent_div = false;
  amazon_div = false;
  reseller_div = false;
  tax_ssn_div = false;
  bank_div = false;
  loading = false;

  // Forms Start
  invalid_entity = false;
  invalid_state = false;
  contact_form = true;
  company_form = false;
  company_form2 = false;
  upgrade_service_pkg_form = false;
  addOnsForm = false;
  addOnsArrayForm = false;
  ecommerceForm = false;
  agent_form = false;
  tax_form = false;
  upgradepkgtax_form = false;
  resellerForm = false;
  bank_form = false;
  filing_time_form = false;
  second_form = false;
  members_form = false;
  billing_form = false;
  documentation_form = false;
  review_form = false;
  stateIsUK = false;
  // Forms End

  our_agent_div = false;
  bank_statment_div = false;
  all_choose_us: any[] = [];
  section_why_choose_us = true;
  agent_type_individual = false;
  // Radio button variables
  want_agent: boolean | undefined = undefined;
  want_reseller: boolean | undefined = undefined;
  want_amazon: boolean | undefined = undefined;
  want_bank: boolean | undefined = undefined;
  want_payoneer: boolean | undefined = undefined;
  want_wise: boolean | undefined = undefined;
  agentIsCompany: boolean | undefined = undefined;
  agentIsIndividual: boolean | undefined = undefined;

  // code_selected = false;
  // name_selected = false;
  selected_state: any[] = [];
  selected_entity: any[] = [];
  all_share_holder: any[] = [];
  all_formation_state: any[] = [];
  all_Contries: any[] = [];
  filteredStates: any[] = [];
  border: any = 'none';
  timelineStep = 1;
  // filteredStates: any[];
  formation_state_id: any = '';
  contry_id: any = '';
  allentity: any[] = [];
  allpkg: any[] = [];
  includes: any[] = [];
  includes_silver: any[] = [];
  includes_gold: any[] = [];
  includes_platinum: any[] = [];
  single_code_array: any[] = [];
  allcode: any[] = [];
  user: any[] = [];
  single_state: any[] = [];
  all_address_by_state: any[] = [];
  get_address_by_id: any[] = [];
  get_all_services: any[] = [];
  push_services: any[] = [];
  countries: any[] = ["usa", "uk"];
  companyStructureNames: any[] = ["Member Managed", "Manager Managed", "Both Managed"];

  // companyStructureNames: any[] = ["Member Managed", "Manager Managed", "Both Managed", "Not decided yet"];
  entityPronunciationNames: any[] = ["L.L.C.", "LLC", "Limited Liability Company"];
  company_name_look: any = '';
  btn_title = 'Continue';
  form_title = 'Formation';
  total_bill: any = 0;
  Newtotal_bill: number = 0;
  panelOpenState = false;
  total_days: any = 0;
  back_btn = false;
  continue_btn = true;
  upgrade_btn = false;
  payment_btn = false;
  control: any;
  selectedBankName = 'Business Bank Account';
  managerControls: any;
  order_id: any;
  Invalid_cv = false;
  fileName: any = '1';
  fileName1: any = '1';
  img_url = this.ser.imgUrl;
  // state variable
  Entity_name: any = '';
  Package_fee: any = 0;
  Country_name: any = '';
  state_Name: any = 'State Name';
  formation_fee: any = 0;
  formation_days: any = 0;
  state_Fee: any = 0;
  package_Fee: any = 0;
  package_Name = '';

  state_days: any = '';
  bussiness_address_fee: any = 0;
  address_ser_fee: any = 0;
  address_ser_days: any = 0;
  ssn_div = false;
  with_ssn_div = false;
  without_ssn_div = true;
  // Summary variables Start
  isPersonal_form = false;
  isCompany_form = false;
  isMember_form = false;
  isAgent_form = false;
  isAmazon_form = false;
  isReseller_form = false;

  isEIN_form = false;
  isBank_form = false;
  isReview_form = false;
  isPayment_form = false;
  address_fee: any = false;
  state_div: any = false;
  entity_div: any = false;
  EIN_div: any = false;

  your_address: any = false;
  t: any = 20;
  selected_filing_time: any;
  selected_filing_fee: any;
  summary: any[] = [];
  agent_fee: any = 0;
  agent_days: any = 0;
  amazon_fee: any = 0;
  amazon_days: any = 0;
  reseller_fee: any = 0;
  reseller_days: any = 0;
  bank_fee: number = 0;
  bank_days: any = 0;
  with_ssn_fee: any = 0;
  with_ssn_days: any = 0;
  without_ssn_fee: any = 0;
  without_ssn_days: any = 0;
  bank_id: any;
  individual_agent = false;
  company_agent = false;
  Agent_fee = false;

  Amazon_fee = false;
  EIN_card = false;
  Reseller_card = false;
  Bank_cardForReviewForm = false;
  Amazon_card = false;


  Reseller_fee = false;
  without_EIN_form = false;
  bank_fee_amount = false;
  //member form variables
  add_name1: any = 'Member';
  add_name2: any = 'Manager';
  // Summary variables End
  // Stepper Variables Start
  step_1 = false;
  step_2 = false;
  step_3 = false;
  step_4 = false;
  step_5 = false;
  step_6 = false;
  step_7 = false;
  step_8 = false;
  step_9 = false;
  step_10 = false;
  hideStatesDiv=false;
  bg_color = '#3C3CAA';
  bar: any = 10;
  img_endpoint: any;
  img_endpoint1: any;
  // Stepper Variables Start
  isAgentAddressInitialized = false;
  isSSNHolderInitialized = false;
  isClientAddressInitialized = false;
  selectedBanks: any[] = [];
  isMembersPanelRefExpanded = false;
  invalidClientBusinessAddress = false;
  agentTypeErrorDiv = false;
  whenMembersAreEmpty = false;
  whenManagersAreEmpty = false;
  whenBothMembersAndManagersAreEmpty = false;
  pkgIncludes: any[] = [];
serviceIncludedInPackage:any[]=[];
  constructor(
    private ser: OrderService,
    private getSer: GetApisService,
    private addressSer: BusinessAddressService,
    private getAllser: ServicesService,
    private userSer: UserService,
    private fb: FormBuilder,
    private rout: Router,
    private route: ActivatedRoute,
    private el: ElementRef, private cd: ChangeDetectorRef,
    private packageSer: PackageService,
    private otherSer:OtherService
  ) {
    this.order_id = localStorage.getItem('order_id');
  }

  order_form = new FormGroup({
    entity: new FormControl('', [Validators.required, Validators.minLength(1)]),
    formation_state: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
    ]),
    formation_Country: new FormControl('', [Validators.required, Validators.minLength(1),
    ]),
    bussiness_address_duration: new FormControl('', Validators.required),
    clientAddress_street: new FormControl('', Validators.required),
    clientAddress_state: new FormControl('', Validators.required),
    clientAddress_city: new FormControl('', Validators.required),
    clientAddress_country: new FormControl('', Validators.required),
    clientAddress_zipcode: new FormControl('', Validators.required),
    bussiness_address: new FormControl('', Validators.required),
    pkg_id: new FormControl('', [Validators.required,]),
    fname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    lname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    equity: new FormControl('', [Validators.required, Validators.minLength(3)]),

    Contact_email: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    Contact_phone: new FormControl('', [
      Validators.required,
      phoneValidator,
    ]),
    Contact_address: new FormControl('', [Validators.required]),
    Contact_city: new FormControl('', [Validators.required]),
    Contact_state: new FormControl('', [Validators.required]),
    Contact_zip: new FormControl('', [Validators.required]),
    Contact_country: new FormControl('', [Validators.required]),

    IsWantAgent: new FormControl(true, [Validators.required]),
    Agent_validation: new FormControl('', [Validators.required]),
    Amazon_validation: new FormControl('', [Validators.required]),
    Reseller_validation: new FormControl('', [Validators.required]),

    Agent_fname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    Agent_lname: new FormControl(''),
    Agent_address: new FormControl('', [Validators.required]),
    Agent_state: new FormControl('', [Validators.required]),
    Agent_city: new FormControl('', [Validators.required]),
    Agent_zip: new FormControl('', [Validators.required]),
    Agent_company_name: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),

    designator: new FormControl('', [Validators.required]),
    company_name_1: new FormControl('', [Validators.required, Validators.minLength(3)]),
    company_name_2: new FormControl('', [Validators.required, Validators.minLength(3)]),
    company_name_3: new FormControl('', [Validators.required, Validators.minLength(3)]),
    entityEndingPronunciation: new FormControl('', [Validators.required]),
    company_purpose: new FormControl('', [Validators.required]),
    company_category: new FormControl('',),
    company_members: this.fb.array([]),
    company_managers: this.fb.array([]),
    company_street: new FormControl('', [Validators.required]),
    company_state: new FormControl('', [Validators.required]),
    company_city: new FormControl('', [Validators.required]),
    company_zip: new FormControl('', [Validators.required]),
    tax__fname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    tax__lname: new FormControl('', [Validators.required]),
    tax_street: new FormControl('', [Validators.required]),
    tax_state: new FormControl('', [Validators.required]),
    tax_zip: new FormControl('', [Validators.required]),
    tax_city: new FormControl('', [Validators.required]),
    SSN: new FormControl('', Validators.required),
    SSN_holder_fname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    SSN_holder_lname: new FormControl(''),
    SSN_holder_city: new FormControl('', Validators.required),
    SSN_holder_address: new FormControl('', Validators.required),
    SSN_holder_DOB: new FormControl('', Validators.required),
    SSN_holder_state: new FormControl('', Validators.required),
    SSN_holder_zipcode: new FormControl('', Validators.required),
    SSN_validation: new FormControl('', [Validators.required]),
    bank_validation: new FormControl('', Validators.required),
    interested_tax_free_consultation: new FormControl('', [
      Validators.required,
    ]),
    front_Passport_picture: new FormControl(null),
    back_Passport_picture: new FormControl(null),
    front_cnic_picture: new FormControl(null),
    back_cnic_picture: new FormControl(null),
    front_driving_lic_picture: new FormControl(null),
    back_driving_lic_picture: new FormControl(null),
    utility_bill_image: new FormControl(null),
    bank_statement_image: new FormControl(null),
    pass_img_1: new FormControl(null),
    pass_img_2: new FormControl(null),
    cnic_1: new FormControl(null),
    cnic_2: new FormControl(null),
    driving_1: new FormControl(null),
    driving_2: new FormControl(null),
    utility_name: new FormControl(null),
    bank_statement: new FormControl(null),
    filing_time: new FormControl(''),
    order_id: new FormControl('',),
    uid: new FormControl(''),
    reasonOfAmendment: new FormControl(''),
    whatYouWantToAmend: new FormControl(''),
    taxFilingType: new FormControl(''),
    rtNumber: new FormControl(''),
    xtNumber: new FormControl(''),
    companyDoc: new FormControl(''),
    einDoc: new FormControl(''),
    amendmentLevel: new FormControl(''),
    companyStructure: new FormControl('', Validators.required),

  });
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.route.queryParams.subscribe(
      par => {
        this.isResumeOrder = par['isResumeOrder'];
        console.log('is resume is undefines');
        this.route.queryParams.subscribe(par => {
          this.order_form.patchValue({
            pkg_id: par['pkgId'],
            entity: par['entity'],
            formation_Country: par['country'],
          });
          this.formation_state_id = par['state']
        });
        // }
      }
    );
    this.getAllServices();
    this.get_order();
    this.invokeStripe();
    this.getBusinessAddressByStateId();
    if (!localStorage.getItem("order_id")) {
      this.getPackagesByCountry(this.order_form.controls.formation_Country.value);
     if(this.formation_state_id){
      this.getstatebyid();
     }
     if(this.order_form.value['entity']){
      this.getentitybyid();
     }
    }
    console.log('ngOninit', this.order_form.value);
  }

  isServiceTitleMatched(title: any): boolean {
    return this.addOnsArray.some(i => i.service_title === title);
  }

  onSelectPkgService(id: any, name: any) {
    var index:any;
    let arr: any[]=[];
    if(this.selectedPkg[0].addon_services.length>0){
          this.packageArray = this.selectedPkg[0].addon_services
    arr = this.packageArray.filter(p => p.tbl_service_id === id);
     index = this.addOnsArray.findIndex(i => i.service_title === arr[0].service_title)
    }

    if (index === -1) {
      this.addOnsArray.push(arr[0])
      this.isTakeAddOns = true;
      console.log('Add onsg', this.addOnsArray);
      switch (name) {
        case 'serviceMashrEINwithoutSSN':
          this.isEINinAddon = true;
          this.taxEIN('without SSN');
          break;
        case 'serviceMashrResellerCertificate':
          this.isResellerinAddon = true;
          this.select_reseller_certificate_option('want_reseller');
          break;
        case 'serviceMashrPayoneer':
          if (this.isBankinAddon) {
            this.want_payoneer = false;
            this.want_wise = false;
            const myarr = this.addOnsArray.filter((obj) => obj.service_title !== 'serviceMashrPayoneer');
            this.addOnsArray = myarr;
            this.select_Bank_option('not_want_bank');
            this.isBankinAddon = false;
          } else if (!this.isBankinAddon) {
            this.select_Bank_option('want_bank_ser');
            this.isBankinAddon = true;
          }
          break;
        case 'serviceMashrAmazon':
          this.isAmazoninAddon = true;
          this.select_amazon_option('want_amazon');
          break;
      }
    } else if (index !== -1) {
      this.addOnsArray.splice(index, 1)
      if (this.addOnsArray.length < 1) {
        this.isTakeAddOns = false;
      }
      switch (name) {
        case 'serviceMashrEINwithoutSSN':
          this.isEINinAddon = false;
          this.EIN_div = false;
          let index = this.push_services.findIndex(ser => ser.tbl_service_id == '4');
          if (index !== -1) {
            this.push_services.splice(index, 1)
          }
          let billIndex1 = this.allBills.findIndex(ser => ser.name === 'EINwithSSNFee'
            || ser.name === 'EINwithoutSSNFee')
          if (billIndex1 !== -1) {
            this.allBills.splice(billIndex1, 1)
            this.calculateTotalBill();
          }
          let index1 = this.push_services.findIndex(ser => ser.tbl_service_id == '5');
          if (index1 !== -1) {
            this.push_services.splice(index1, 1)
          }
          break;
        case 'serviceMashrResellerCertificate':
          this.isResellerinAddon = false;
          let index2 = this.push_services.findIndex(ser => ser.tbl_service_id == '6');
          if (index2 !== -1) {
            this.push_services.splice(index2, 1)
          }
          let billIndex2 = this.allBills.findIndex(ser => ser.name === 'resellerFee')
          if (billIndex2 !== -1) {
            this.allBills.splice(billIndex2, 1)
            this.calculateTotalBill();
          }
          break;
        case 'serviceMashrPayoneer':
          this.isBankinAddon = false;
          if (this.push_services.findIndex(ser => ser.tbl_service_id == '11') !== -1) {
            this.push_services.splice(this.push_services.findIndex(ser => ser.tbl_service_id == '11'), 1)
          }
          if (this.push_services.findIndex(ser => ser.tbl_service_id == '12') !== -1) {
            this.push_services.splice(this.push_services.findIndex(ser => ser.tbl_service_id == '12'), 1)
          }
          if (this.allBills.findIndex(ser => ser.name === 'bankFeePayoneer') !== -1) {
            this.allBills.splice(this.allBills.findIndex(ser => ser.name === 'bankFeePayoneer'), 1)
          }
          if (this.allBills.findIndex(ser => ser.name === 'bankFeeWise') !== -1) {
            this.allBills.splice(this.allBills.findIndex(ser => ser.name === 'bankFeeWise'), 1)
          }
          this.calculateTotalBill();
          break;
        case 'serviceMashrAmazon':
          this.isAmazoninAddon = false;
          let index4 = this.push_services.findIndex(ser => ser.tbl_service_id == '8');
          if (index4 !== -1) {
            this.push_services.splice(index4, 1)
          }
          let billIndex4 = this.allBills.findIndex(ser => ser.name === 'amazonFee')
          if (billIndex4 !== -1) {
            this.allBills.splice(billIndex4, 1)
            this.calculateTotalBill();
          }
          break;
      }
    }
    console.log('Add on array length', this.addOnsArray.length);

  }
  scrollToTop() {
    if (this.topDiv && this.topDiv.nativeElement) {
      this.topDiv.nativeElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.log('Div not found in the view');
    }
  }




  // GOOGLE PLACES START
  ngAfterViewInit() {
    setTimeout(() => {
      this.afterViewInitContactAddress();
    }, 5000);
  }

  loadSSNAutocomplete() {
    // setTimeout(() => {
    if (this.SSN_holder_addressField) {
      const autocomplete = new google.maps.places.Autocomplete(this.SSN_holder_addressField.nativeElement, {
        componentRestrictions: { country: ["us", "ca"] },
        fields: ["address_components", "geometry"],
        types: ["address"],
      });
      console.log('SSN autocomplete', autocomplete)

      // this.SSN_holder_addressField.nativeElement.focus();
      autocomplete.addListener("place_changed", () => {
        this.fillInAddress(autocomplete, 'SSN_holder_addressField');
      });
    }

    // }, 0);
  }


  afterViewInitClientAddress() {
    if (this.clientAddress_streetField?.nativeElement) {
      console.log('client address called');
      const autocomplete = new google.maps.places.Autocomplete(this.clientAddress_streetField.nativeElement, {
        componentRestrictions: { country: ["us", "ca"] },
        fields: ["address_components", "geometry"],
        types: ["address"],
      });
      // this.clientAddress_streetField.nativeElement.focus();
      autocomplete.addListener("place_changed", () => {
        this.fillInAddress(autocomplete, 'clientAddress_streetField');
      });
    }
  }


  afterViewInitContactAddress(): void {
    this.Contact_addressField.nativeElement.setAttribute('autocomplete', 'off');
    console.log('DDDDDDDDDD', this.clientAddress_streetField);
    if (this.Contact_addressField?.nativeElement) {
      const autocomplete = new google.maps.places.Autocomplete(this.Contact_addressField.nativeElement, {
        fields: ["address_components", "geometry"],
        types: ["address"],
      });
      autocomplete.addListener("place_changed", () => {
        this.fillInAddress(autocomplete, 'Contact_addressField');
      });
    }
  }
  afterViewInitAgentAddress() {
    const streetControl = this.order_form.controls['Agent_address'];
    const zipControl = this.order_form.controls['Agent_zip'];
    //  if(this.)
    const autocomplete = new google.maps.places.Autocomplete(streetControl, {
      // componentRestrictions: { country: ["us", ""] },
      fields: ["address_components", "geometry"],
      types: ["address"],
    });
    streetControl.valueChanges.subscribe(() => {
      if (!streetControl.value) {
        zipControl.setValue('');
      }
    });
    autocomplete.addListener('place_changed', () => {
      this.fillInAddress(autocomplete, 'Agent_address');
    });
  }
  loadAgentAutocomplete() {
    // setTimeout(() => {
    if (this.Agent_addressField) {
      const autocomplete = new google.maps.places.Autocomplete(this.Agent_addressField.nativeElement, {
        // componentRestrictions: { country: ["us", ""] },
        fields: ["address_components", "geometry"],
        types: ["address"],
      });
      console.log('load agent autocomplete', autocomplete)
      // this.Agent_addressField.nativeElement.focus();
      autocomplete.addListener("place_changed", () => {
        this.fillInAddress(autocomplete, 'Agent_addressField');
      });
    }

  }

  fillInAddress(autocomplete: any, hint: string) {
    const place = autocomplete.getPlace();
    let address1 = "";
    let postcode = "";
    for (const component of place.address_components) {
      const componentType = component.types[0];
      console.log('For loop', componentType)

      switch (componentType) {
        case "street_number": {
          address1 = `${component.long_name} ${address1}`;
          break;
        }
        case "route": {
          address1 += component.short_name;
          break;
        }
        case "postal_code": {
          postcode = `${component.long_name}${postcode}`;
          break;
        }
        case "postal_code_suffix": {
          postcode = `${postcode}-${component.long_name}`;
          break;
        }
        case "locality": {
          if (hint == 'clientAddress_streetField') {
            this.order_form.controls.clientAddress_city.setValue(component.long_name);
            this.cd.detectChanges();
            // this.elementRef.nativeElement.dispatchEvent(new Event('input'));
          } else if (hint == 'Contact_addressField') {
            this.order_form.controls.Contact_city.setValue(component.short_name);
            this.cd.detectChanges();
          } else
            if (hint == 'Agent_addressField') {
              this.order_form.controls.Agent_city.setValue(component.short_name);
              this.cd.detectChanges();
            } else if (hint == 'SSN_holder_addressField') {
              this.order_form.controls.SSN_holder_city.setValue(component.short_name);
              this.cd.detectChanges();

            }
          break;
        }
        case "administrative_area_level_1": {
          if (hint == 'clientAddress_streetField') {
            this.order_form.controls.clientAddress_state.setValue(component.short_name);
            this.cd.detectChanges();

          } else if (hint == 'Contact_addressField') {
            this.order_form.controls.Contact_state.setValue(component.short_name);
            this.cd.detectChanges();

          } else
            if (hint == 'Agent_addressField') {
              this.order_form.controls.Agent_state.setValue(component.short_name);
              this.cd.detectChanges();

            } else if (hint == 'SSN_holder_addressField') {
              this.order_form.controls.SSN_holder_state.setValue(component.short_name);
              this.cd.detectChanges();

            }

          break;
        }
        case "country": {
          if (hint == 'clientAddress_streetField') {
            this.order_form.controls.clientAddress_country.setValue(component.short_name);
            this.cd.detectChanges();

          } else if (hint == 'Contact_addressField') {
            this.order_form.controls.Contact_country.setValue(component.short_name);
            this.cd.detectChanges();

          } else
            if (hint == 'Agent_addressField') {
              this.order_form.controls.Agent_state.setValue(component.short_name);
              this.cd.detectChanges();

            } else if (hint == 'SSN_holder_addressField') {
              this.order_form.controls.SSN_holder_state.setValue(component.short_name);
              this.cd.detectChanges();

            }

          break;
        }
        case "postal_code": {
          if (hint == 'clientAddress_streetField') {
            this.order_form.controls.clientAddress_zipcode.setValue(component.short_name);
            this.cd.detectChanges();

          } else if (hint == 'Contact_addressField') {
            this.order_form.controls.Contact_zip.setValue(component.short_name);
            this.cd.detectChanges();

          } else
            if (hint == 'Agent_addressField') {
              this.order_form.controls.Agent_zip.setValue(component.short_name);
              this.cd.detectChanges();

            } else if (hint == 'SSN_holder_addressField') {
              this.order_form.controls.SSN_holder_zipcode.setValue(component.short_name);
              this.cd.detectChanges();

            }

          break;
        }
      }
    }
    if (hint == 'clientAddress_streetField') {
      this.order_form.controls.clientAddress_street.setValue(address1);
      this.order_form.controls.clientAddress_zipcode.setValue(postcode);
    }
    else if (hint == 'Contact_addressField') {
      this.order_form.controls.Contact_address.setValue(address1);
      this.order_form.controls.Contact_zip.setValue(postcode);

      // this.order_form.controls.Contact_zip.setValue(postcode);

    } else if (hint == 'Agent_addressField') {
      this.order_form.controls.Agent_address.setValue(address1);
      this.order_form.controls.Agent_zip.setValue(postcode);
    } else if (hint == 'SSN_holder_addressField') {
      this.order_form.controls.SSN_holder_address.setValue(address1);
      this.order_form.controls.SSN_holder_zipcode.setValue(postcode);
    }

  }
  // GOOGLE PLACES END


  onSearchStates(val: any) {
    let v = val.target.value
    this.filteredStates = this.all_formation_state.filter(state => state.state_name.toLowerCase().indexOf(v.toLowerCase()) !== -1);
  }



  getPackageById(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let data = {
        tbl_pkg_id: id,
      };

      this.packageSer.getPackageById(data).subscribe((res: any) => {
        console.log('getPackageById res',res);
        if (res !== 'dataNotFound') {
          this.selectedPkg = [res.package];
          this.packageArray = res.package.package_services;
          console.log('packageArray inside pkg by id', this.packageArray);
          resolve(this.packageArray); // Resolve the Promise with the package data
        } else if (res === 'dataNotFound') {
          reject(new Error('Package data not found'));
        }
      });
    });
  }

  getstatebyid() {

    let data = {
      tbl_state_id: this.formation_state_id,
    };

    console.log('state by id before', data);
    this.getSer.getstatebyid(data).subscribe((res) => {
      console.log('state by id', res);
      this.selected_state = [];
      this.selected_state = res;
      this.state_Name = this.selected_state[0].state_name;
      this.state_Fee = Number(this.selected_state[0].state_fee)
      this.allBills.splice(1, 0, { name: 'stateFee', value: this.state_Fee })
      this.calculateTotalBill();
      console.log('All bills', this.allBills)
      // this.total_bill = this.total_bill - this.state_Fee;
      // this.total_days = this.total_days - this.state_days;

      // this.total_bill = this.total_bill + this.state_Fee
      console.log('stte by uid', this.selected_state);
      this.order_form.controls.filing_time.patchValue(
        this.selected_state[0].tbl_state_id
      );
    });
  }
  getallContries() {
    this.getSer.getAllCountries().subscribe((res) => {
      let r = res;
      this.all_Contries = [];
      for (let i = 0; i < r.length; i++) {
        this.all_Contries.push(r[i]);
      }
      console.log('Contries==========', this.all_Contries);
    });
  }

  scrollToTarget() {
    this.duration.nativeElement.scrollIntoView();
  }
  getBusinessAddressDurationByAddressId(id: any, index: any) {
    this.selectedAddressIndex = index;
    this.invalidBusinessAddress = '';
    this.order_form.controls.bussiness_address.patchValue('ourAddress')
    let data = {
      tbl_address_id: 1,
    };
    this.addressSer
      .getBusinessAddressDurationByAddressId(data)
      .subscribe((res) => {
        console.log('get add by id', res);
        this.get_address_by_id = res;
      });
  }
  add_address_fee(fee: any, id: any) {
    this.invalidBusinessAddress = '';
    this.order_form.controls.bussiness_address_duration.patchValue(id)
    const index = this.allBills.findIndex(i => i.name === 'businessAddressFee');
    if (index !== -1) {
      this.allBills.splice(index, 1);
      this.allBills.push({ name: 'businessAddressFee', value: fee })
      this.calculateTotalBill();
    } else if (index === -1) {
      this.allBills.push({ name: 'businessAddressFee', value: fee });
      this.calculateTotalBill();
    }
  }

  our_Address() {
    this.invalidBusinessAddress = '';
    let index1 = this.push_services.findIndex((ser) => ser.tbl_service_id == '1');
    if (index1 !== -1) {
      this.push_services.splice(index1, 1)
    }
    let feeArray: any[] = this.get_all_services.filter(
      ser => ser.service_title === 'serviceMashrBusinessAddress'
    );
    let bussiness_address = {
      tbl_service_id: feeArray[0].tbl_service_id,
      service_title: feeArray[0].service_title,
      service_fee: feeArray[0].service_fee,
      bank_type: 'other',
    };
    this.push_services.push(bussiness_address);
    console.log('push address service', this.push_services);
    this.address_fee = true;
    this.your_address = false;
    this.order_form.controls.clientAddress_street.patchValue('ourAddress')
    this.order_form.controls.clientAddress_state.patchValue('ourAddress')
    this.order_form.controls.clientAddress_city.patchValue('ourAddress')
    this.order_form.controls.clientAddress_country.patchValue('ourAddress')
    this.order_form.controls.clientAddress_zipcode.patchValue('ourAddress')
    this.order_form.controls.bussiness_address.patchValue('ourAddress')
    console.log('form inside ourAddress', this.order_form.value)
    this.getBusinessAddressDurationByAddressId(1, 1);
  }
  own_Address() {
    setTimeout(() => {
      this.afterViewInitClientAddress();
    }, 2000);
    this.invalidBusinessAddress = '';
    this.accordion2.nativeElement.click();
    this.collapse2.nativeElement.classList.remove('show');
    if (this.order_form.controls.clientAddress_street.value === 'ourAddress') {
      this.order_form.controls.clientAddress_street.patchValue('');
      this.order_form.controls.clientAddress_state.patchValue('')
      this.order_form.controls.clientAddress_city.patchValue('')
      this.order_form.controls.clientAddress_country.patchValue('')
      this.order_form.controls.clientAddress_zipcode.patchValue('')
    }
    this.order_form.controls['bussiness_address_duration'].patchValue('');
    this.order_form.controls.bussiness_address.patchValue('ownAddress');
    let index1 = this.push_services.findIndex(
      (ser) => ser.tbl_service_id == '1'
    );

    if (index1 !== -1) {
      this.push_services.splice(index1, 1);
      this.address_ser_fee = 0;
      console.log('remove service address', this.push_services);
    }
    const index = this.allBills.findIndex((r) => r.name === 'businessAddressFee')
    if (index !== -1) {
      this.allBills.splice(index, 1);
      this.calculateTotalBill();
    }

    this.bussiness_address_fee = 0;
    this.address_fee = false;
    this.your_address = true;
    console.log('form inside ownAddress', this.order_form.value)
    this.get_address_by_id = [];
  }

  getallentity() {
    this.loading = true;

    this.getSer.getallentity().subscribe((res) => {
      this.loading = false;

      this.allentity = [];
      for (let i = 0; i < res.length; i++) {
        this.allentity.push(res[i]);
      }

      // console.log('All entity', this.allentity)
    });
  }

  get_order() {
    let tbl_service_order_id = localStorage.getItem('order_id');
    if (!tbl_service_order_id) {
      localStorage.removeItem('order_id');
      return;
    }
    let data = {
      tbl_order_id: tbl_service_order_id,
    };
    this.loading = true;
    this.ser.get_order_by_order_id(data).subscribe(async res => {
      this.loading = false;
      console.log('order RES', res);
      if (res != 'notFoundOrder') {
        this.order_form.controls['fname'].patchValue(res.order[0].contact_fname);
        this.order_form.controls['lname'].patchValue(res.order[0].contact_lname);
        if (res.order[0].SSN_holder_fname) {
          this.with_ssn_div = true;
          this.without_ssn_div = false;
          this.order_form.controls['SSN'].patchValue(res.order[0].company_EIN);
          this.order_form.controls['SSN_holder_fname'].patchValue(res.order[0].SSN_holder_fname);
          this.order_form.controls['SSN_holder_lname'].patchValue(res.order[0].SSN_holder_lname);
          this.order_form.controls['SSN_holder_city'].patchValue(res.order[0].SSN_holder_city);
          this.order_form.controls['SSN_holder_address'].patchValue(res.order[0].SSN_holder_address);
          this.order_form.controls['SSN_holder_DOB'].patchValue(res.order[0].SSN_holder_DOB);
          this.order_form.controls['SSN_holder_state'].patchValue(res.order[0].SSN_holder_state);
          this.order_form.controls['SSN_holder_zipcode'].patchValue(res.order[0].SSN_holder_zipcode);
          this.ssn_div = true
        }
        if (res.order[0].company_EIN == 'without SSN') {
          this.with_ssn_div = false;
          this.without_ssn_div = true;
          this.ssn_div = false
          this.order_form.controls['SSN'].patchValue(res.order[0].company_EIN);
        }
        if (res.order[0].clientAddress_street != '') {
          this.order_form.controls['clientAddress_street'].patchValue(
            res.order[0].clientAddress_street
          );
        }
        if (res.order[0].clientAddress_city != '') {
          this.order_form.controls['clientAddress_city'].patchValue(
            res.order[0].clientAddress_city
          );
        }
        if (res.order[0].clientAddress_zipcode != '') {
          this.order_form.controls['clientAddress_zipcode'].patchValue(
            res.order[0].clientAddress_zipcode
          );
        }
        if (res.order[0].clientAddress_state != '') {
          this.order_form.controls['clientAddress_state'].patchValue(
            res.order[0].clientAddress_state
          );
        }
        if (res.order[0].clientAddress_country != '') {
          this.order_form.controls['clientAddress_country'].patchValue(
            res.order[0].clientAddress_country
          );
        }
        if (res.order[0].contact_city != '') {
          this.order_form.controls['Contact_city'].patchValue(
            res.order[0].contact_city
          );
        }
        if (res.order[0].contact_email != '') {
          this.order_form.controls['Contact_email'].patchValue(
            res.order[0].contact_email
          );
        }
        if (res.order[0].contact_phonenumber != '') {
          this.order_form.controls['Contact_phone'].patchValue(
            res.order[0].contact_phonenumber
          );
        }
        if (res.order[0].contact_state != '') {
          this.order_form.controls['Contact_state'].patchValue(
            res.order[0].contact_state
          );
        }
        if (res.order[0].contact_street_address != '') {
          this.order_form.controls['Contact_address'].patchValue(
            res.order[0].contact_street_address
          );
        }
        if (res.order[0].contact_zipcode != '') {
          this.order_form.controls['Contact_zip'].patchValue(
            res.order[0].contact_zipcode
          );
        }
        if (res.order[0].contact_country != '') {
          this.order_form.controls['Contact_country'].patchValue(
            res.order[0].contact_country
          );
        }
        if (res.order[0].company_name_1 != '') {
          this.order_form.controls['company_name_1'].patchValue(
            res.order[0].company_name_1
          );
        }
        if (res.order[0].company_name_2 != '') {
          this.order_form.controls['company_name_2'].patchValue(
            res.order[0].company_name_2
          );
        }
        if (res.order[0].company_name_3 != '') {
          this.order_form.controls['company_name_3'].patchValue(
            res.order[0].company_name_3
          );
        }
        if (res.order[0].companyStructure != '') {
          this.order_form.controls['companyStructure'].patchValue(
            res.order[0].companyStructure
          );
        }
        if (res.order[0].entityEndingPronunciation != '') {
          this.order_form.controls['entityEndingPronunciation'].patchValue(
            res.order[0].entityEndingPronunciation
          );
        }
        if (res.order[0].agent_city != '') {
          this.order_form.controls['Agent_city'].patchValue(
            res.order[0].agent_city
          );
        }
        if (res.order[0].agent_company_name != '') {
          this.order_form.controls['Agent_company_name'].patchValue(
            res.order[0].agent_company_name
          );
          this.agentIsCompany = true;
          this.agentIsIndividual = false;
        }
        if (res.order[0].agent_fname != '') {
          this.agentIsCompany = false;
          this.agentIsIndividual = true;
          this.order_form.controls['Agent_fname'].patchValue(
            res.order[0].agent_fname
          );
        }

        if (res.order[0].agent_lname != '') {
          this.order_form.controls['Agent_lname'].patchValue(
            res.order[0].agent_lname
          );
        }

        if (res.order[0].agent_state != '') {
          this.order_form.controls['Agent_state'].patchValue(
            res.order[0].agent_state
          );
        }

        if (res.order[0].agent_street_address != '') {
          this.order_form.controls['Agent_address'].patchValue(
            res.order[0].agent_street_address
          );
        }

        if (res.order[0].agent_zipcode != '') {
          this.order_form.controls['Agent_zip'].patchValue(
            res.order[0].agent_zipcode
          );
        }
        if (res.order[0].tbl_entity_id != '') {
          this.order_form.controls['entity'].patchValue(
            res.order[0].tbl_entity_id
          );
        }

        if (res.order[0].tbl_state_id != '') {
          this.formation_state_id = res.order[0].tbl_state_id
        }
        if (res.order[0].tbl_order_id != '') {
          this.order_form.controls['order_id'].patchValue(
            res.order[0].tbl_order_id
          );
        }
        if (res.order[0].tbl_user_id != '') {
          this.order_form.controls['uid'].patchValue(res.order[0].tbl_user_id);
        }
        if (res.order[0].passport_image_1 != '') {
          this.order_form.controls['pass_img_1'].patchValue(
            res.order[0].passport_image_1
          );
        }
        if (res.order[0].passport_image_2 != '') {
          this.order_form.controls['pass_img_2'].patchValue(
            res.order[0].passport_image_2
          );
        }
        if (res.order[0].cnic_front_image != '') {
          this.order_form.controls['cnic_1'].patchValue(
            res.order[0].cnic_front_image
          );
        }
        if (res.order[0].cnic_back_image != '') {
          this.order_form.controls['cnic_2'].patchValue(
            res.order[0].cnic_back_image
          );
        }
        if (res.order[0].driving_license_image_1 != '') {
          this.order_form.controls['driving_1'].patchValue(
            res.order[0].driving_license_image_1
          );
        }
        if (res.order[0].driving_license_image_2 != '') {
          this.order_form.controls['driving_2'].patchValue(
            res.order[0].driving_license_image_2
          );
        }
        if (res.order[0].utility_bill_image != '') {
          this.order_form.controls['utility_name'].patchValue(
            res.order[0].utility_bill_image
          );
        }

        if (res.order[0].company_address != '') {
          this.order_form.controls['company_street'].patchValue(
            res.order[0].company_address
          );
        }
        if (res.order[0].company_address == '') {
          this.order_form.controls['company_street'].patchValue(
            this.order_form.controls['Contact_address'].value
          );
        }
        if (res.order[0].address_duration_id != '') {
          this.order_form.controls['bussiness_address_duration'].patchValue(
            res.order[0].address_duration_id
          );
        }
        if (res.order[0].address_fee != '') {
          this.bussiness_address_fee = res.order[0].address_fee;
        }
        if (res.order[0].temp_status != '') {
          this.temp_status = res.order[0].temp_status;
          console.log('------------', this.temp_status)
        }
        if (res.order[0].tbl_country_id != '') {
          this.order_form.controls.formation_Country.patchValue(res.order[0].tbl_country_id);
        }
        if (res.order[0].tbl_pkg_id != '') {
          this.order_form.controls['pkg_id'].patchValue(
            res.order[0].tbl_pkg_id
          );
          try {
            const packageData = await this.getPackageById(res.order[0].tbl_pkg_id);
            console.log('array-----', this.packageArray, packageData);
            if (packageData) {
              if (res.order_service.length != 0) {
                this.selectedBankName = res.order_service[0].bank_type;
                this.push_services = [];

                for (let i = 0; i < res.order_service.length; i++) {
                  this.push_services.push({
                    tbl_service_id: res.order_service[i].tbl_service_id,
                    service_title: res.order_service[i].service_title,
                    service_fee: res.order_service[i].service_fee,
                    bank_type: 'other',
                  });

                  switch (res.order_service[i].service_title) {
                    case 'serviceMashrBusinessAddress':
                      this.allBills.push({ name: 'businessAddressFee', value: res.order[0].address_fee })
                      this.order_form.controls.bussiness_address_duration.patchValue(res.order[0].address_duration_id);
                      this.order_form.controls.bussiness_address.patchValue(res.order[0].tbl_address_id);

                      break;
                    case 'serviceMashrRegisteredAgent':
                      this.allBills.push({ name: 'registeredAgent', value: res.order_service[i].service_fee });
                      this.our_agent_div = true;
                      this.want_agent = true;
                      this.Agent_fee = true;
                      this.order_form.controls.Agent_validation.patchValue('agent');
                      break;
                    case 'serviceMashrEINwithSSN':
                      this.allBills.push({ name: 'EINwithSSNFee', value: res.order_service[i].service_fee })
                      let arr: any[] = this.packageArray.filter(p => p.service_title === 'serviceMashrEINwithoutSSN');
                      if (this.addOnsArray.findIndex(i => i.service_title === arr[0].service_title) === -1) {
                        this.addOnsArray.push(arr[0]);
                        this.isEINinAddon = true;
                        this.EIN_card = true;
                      }
                      this.order_form.controls.SSN_validation.patchValue('With SSN');
                      break;
                    case 'serviceMashrEINwithoutSSN':
                      this.allBills.push({ name: 'EINwithoutSSNFee', value: res.order_service[i].service_fee })
                      let arr1: any[] = this.packageArray.filter(p => p.service_title === 'serviceMashrEINwithoutSSN');
                      if (this.addOnsArray.findIndex(i => i.service_title === arr1[0].service_title) === -1) {
                        this.addOnsArray.push(arr1[0]);
                        this.isEINinAddon = true;
                        this.EIN_card = true;
                      }
                      this.order_form.controls.SSN_validation.patchValue('Without SSN');
                      break;
                    case 'serviceMashrResellerCertificate':
                      if (res.order[0].pkg_title == 'Silver') {
                        this.allBills.push({ name: 'resellerFee', value: res.order_service[i].service_fee })
                        let arrRC: any[] = this.packageArray.filter(p => p.service_title === 'serviceMashrResellerCertificate');
                        if (this.addOnsArray.findIndex(i => i.service_title === arrRC[0].service_title) === -1) {
                          this.addOnsArray.push(arrRC[0]);
                          this.isResellerinAddon = true;
                          this.Reseller_card = true;
                        }
                      }
                      break;
                    case 'serviceMashrPayoneer':
                    case 'serviceMashrWise':
                      if (res.order_service[i].service_title === 'serviceMashrPayoneer') {
                        if (this.allBills.findIndex(p => p.name === 'bankFeePayoneer') === -1) {
                          this.allBills.push({ name: 'bankFeePayoneer', value: res.order_service[i].service_fee });
                          this.want_payoneer = true;
                        }
                      }
                      if (res.order_service[i].service_title === 'serviceMashrWise') {
                        if (this.allBills.findIndex(p => p.name === 'bankFeeWise') === -1) {
                          this.allBills.push({ name: 'bankFeeWise', value: res.order_service[i].service_fee });
                        }
                        this.want_wise = true;
                      }
                      // NOTE: Adding payoneer because bank service card in addons set on payoneer
                      let arrWise: any[] = this.packageArray.filter(p => p.service_title === 'serviceMashrPayoneer'
                        || p.service_title === 'serviceMashrWise');
                      if (this.addOnsArray.findIndex(i => i.service_title === arrWise[0].service_title) === -1) {
                        this.addOnsArray.push(arrWise[0]);
                        // this.want_wise = true;
                        this.want_payoneer=true
                        this.isBankinAddon = true;
                      }
                      this.Bank_cardForReviewForm = true;

                      break;
                    case 'serviceMashrAmazon':
                      this.allBills.push({ name: 'amazonFee', value: res.order_service[i].service_fee })
                      let arrAmazon: any[] = this.packageArray.filter(p => p.service_title === 'serviceMashrAmazon');
                      if (this.addOnsArray.findIndex(i => i.service_title === arrAmazon[0].service_title) === -1) {
                        this.addOnsArray.push(arrAmazon[0]);
                        this.isAmazoninAddon = true;
                        this.Amazon_card = true;
                      }
                      break;
                    default:
                      if (res.order[0].agent_fname) {
                        this.agentIsCompany = false;
                        this.agentIsIndividual = true;
                      }
                      if (res.order[0].agent_company_name) {
                        this.agentIsCompany = true;
                        this.agentIsIndividual = false;
                      }

                  }
                }
                const foundItem = this.push_services.find(obj => obj.service_title === 'serviceMashrRegisteredAgent');
                if (foundItem) {
                  this.want_agent = true;
                } else {
                  this.want_agent = undefined;
                }
              }
            }
          } catch (error) {
            console.log('Error');
          }
        }
        this.package_Name = res.order[0].pkg_title;
        this.package_Fee = res.order[0].pkg_fee;


        if (res.company_members.length > 0) {
          this.control = '';
          this.managerControls = '';
          let company_members: any[] = [];
          for (let i = 0; i < res.company_members.length; i++) {
            company_members.push(res.company_members[i]);
          }
          console.log('all members', company_members)
          var temp_allmembers: any[] = company_members.filter(ser => ser.member_type === "Member")
          var temp_allmanagers: any[] = company_members.filter(ser => ser.member_type === "Manager");
          if (temp_allmembers.length > 0 || temp_allmanagers.length > 0) {
            this.order_form.controls['companyStructure'].patchValue(
              res.order[0].companyStructure
            );
          }
          for (let i = 0; i < temp_allmembers.length; i++) {
            this.control = <FormArray>this.order_form.controls['company_members'];
            let newMemberControl = this.company_members();
            newMemberControl.patchValue({
              member_type: this.add_name1,
              fname: temp_allmembers[i].fname,
              lname: temp_allmembers[i].lname,
              street: temp_allmembers[i].street,
              city: temp_allmembers[i].city,
              state: temp_allmembers[i].state,
              country: temp_allmembers[i].country,
              zipcode: temp_allmembers[i].zipcode,
              equity: temp_allmembers[i].equity,
              active: false
            });
            this.control.push(newMemberControl);
            console.log('this.controls', this.control);
            this.allmembers = temp_allmembers
            console.log('All member after', this.allmembers);
          }
          for (let i = 0; i < temp_allmanagers.length; i++) {
            this.managerControls = <FormArray>this.order_form.controls['company_managers'];
            let newManagerControl = this.company_members();
            newManagerControl.patchValue({
              member_type: this.add_name2,
              fname: temp_allmanagers[i].fname,
              lname: temp_allmanagers[i].lname,
              street: temp_allmanagers[i].street,
              city: temp_allmanagers[i].city,
              state: temp_allmanagers[i].state,
              country: temp_allmanagers[i].country,
              zipcode: temp_allmanagers[i].zipcode,
              active: false
            });
            this.managerControls.push(newManagerControl);
            console.log('this.controls', this.managerControls);
            this.managerControls.push(this.company_managers());
            let len = this.order_form.controls['company_managers'].controls.length;
            console.log('Lemn', len);
            this.allmanagers = temp_allmanagers
            console.log('this.All manager after', this.allmanagers);
          }
        }
        if(this.selectedPkg[0]){
           this.calculateTotalBill();
        }
        this.show_swal_if_order_exist();
        if(this.order_form.value['entity']){
          this.getentitybyid();
         }
   if(this.formation_state_id){
      this.getstatebyid();
     }
        this.getPackagesByCountry(res.order[0].tbl_country_id);
        console.log('form values', this.order_form.value);
      }
      else if (res == 'notFoundOrder') {
        localStorage.removeItem('order_id');
      }
    });
    console.log('package by id inside get order', this.selectedPkg);
  }


  getSelectedBanks() {
    let selectedBanks: any[] = this.push_services;

    const bankPayoneer = selectedBanks.find(s =>
      s.service_title === 'serviceMashrPayoneer');

    const bankWise = selectedBanks.find(s =>
      s.service_title === 'serviceMashrWise');
    console.log('selected banks', bankPayoneer, bankWise);

    if (bankPayoneer && bankWise) {
      return 'Payoneer,Wise';
    } else if (bankPayoneer) {
      return 'Payoneer';
    } else if (bankWise) {
      return 'Wise';
    }

    // Return null or an appropriate value if no bank is found
    return null;
  }

  getWiseOrPayoneerForSummary() {
    let selectedBanks: any[] = this.push_services;
    const bankTypes = selectedBanks.find(s =>
      s.bank_type === 'Wise,Payoneer'
    );
    console.log('---', bankTypes);
    return bankTypes
  }
  getAllServices() {
    this.loading = true;
    this.getAllser.getAllServices().subscribe((res) => {
      this.loading = false;
      console.log('All servicesssssssssssss', res);
      for (let i = 0; i < res.length; i++) {
        this.get_all_services.push(res[i]);
      }
      console.log('ALLL', this.push_services)
      let feeArray: any[] = this.get_all_services.filter((ser) => ser.service_title === "serviceMashrCompanyFormation")
      this.formation_fee = +feeArray[0].service_fee;
      this.formation_days = +feeArray[0].business_days;
      this.total_days = this.total_days + this.formation_days;
      this.total_bill = this.total_bill + this.formation_fee;
      let LLC_service = {
        tbl_service_id: feeArray[0].tbl_service_id,
        service_title: feeArray[0].service_title,
        service_fee: feeArray[0].service_fee,
        bank_type: 'other',

      }
      console.log('conditionFFFFFFFFF', this.push_services)
      if (this.order_id == null || this.order_id == undefined || this.order_id == '') {
        this.push_services.push(LLC_service);
        console.log('by default push service LLC', this.push_services)
      }
    });

  }


  getentitybyid() {
    this.entity_div = true;
    let data = {
      entity_id: this.order_form.value['entity'],
    };
    this.getSer.getEntityById(data).subscribe((res) => {
      console.log('entity by id', res);
      this.selected_entity = [];
      this.selected_entity = res;
      this.Entity_name = this.selected_entity[0].entity_name;
      console.log('entity', this.selected_entity);
    });
  }

  getUser() {
    this.loading = true;
    let id = localStorage.getItem('user_id');
    if (id) {
      this.order_form.controls.uid.patchValue(id);
      let data = {
        user_id: id,
      };
      this.userSer.getUser(data).subscribe((res) => {
        this.loading = false;
        console.log('uuuuuuuuuu', res);
        if (res != 'datanotfound') {
          let res1: any = res;
          this.user_detail = [];
          for (let i = 0; i < res1.length; i++) {
            this.user_detail.push(res1[i]);
          }
          console.log('user', this.user_detail);
          this.set_use_existing_user_detail();
        }
        else if (res == 'datanotfound') {
          localStorage.removeItem('user_id');
        }
      });
    } else {
      this.use_existing_user_detail_contact_person = false;
      this.use_existing_user_detail_mailing_address = false;
      this.existing_detail_check_box = false;
    }
  }


  getPackagesByCountry(id: any) {
    let data = { country: id }
    console.log('pkg before', data)
    return
    // this.packageSer.getPackagesByCountry(data).subscribe(res => {
    //   console.log('pkg', res)
    //   if (res != 'dataNotFound') {
    //     this.allpkg = [];
    //     this.allpkg = res.packages;
    //     this.selectedPkg = this.allpkg.filter(o => o.tbl_pkg_id == Number(this.order_form.controls.pkg_id.value));
    //     console.log('pkg by cpountry', this.selectedPkg);
    //     this.package_Name = this.selectedPkg[0].pkg_title;
    //     this.package_Fee = this.selectedPkg[0].pkg_fee;
    //     this.allBills.splice(0, 0, { name: 'pkgFee', value: this.package_Fee })
    //     console.log('All bills-------------', this.allBills)
    //     console.log('All bills', this.selectedPkg)
    //     this.calculateTotalBill();
    //   }
    // });
  }

  updatePkg() {

    let feeArray: any[] = this.get_all_services.filter(
      ser => ser.service_title === 'serviceMashrResellerCertificate'
        || ser.service_title === 'serviceMashrEINwithoutSSN'
    );
    console.log('fee arr', feeArray);
    let index1 = this.push_services.findIndex((ser) => ser.tbl_service_id == feeArray[0].tbl_service_id);
    let index2 = this.push_services.findIndex((ser) => ser.tbl_service_id == feeArray[1].tbl_service_id);
    if (index1 === -1) {
      let resellerCertificate = {
        tbl_service_id: feeArray[0].tbl_service_id,
        service_title: feeArray[0].service_title,
        service_fee: feeArray[0].service_fee,
        bank_type: 'other',
      };
      this.push_services.push(resellerCertificate);
    }
    if (index2 === -1) {
      let ein = {
        tbl_service_id: feeArray[1].tbl_service_id,
        service_title: feeArray[1].service_title,
        service_fee: feeArray[1].service_fee,
        bank_type: 'other',
      };
      this.push_services.push(ein);
    }
    console.log('Pushed services after upgrade', this.push_services)
    let name = this.selectedPkg[0].pkg_title;
    switch (name) {
      case 'Silver':
        this.selectedPkg = this.allpkg.filter(pkg => pkg.pkg_title === 'Gold')
        this.package_Fee = this.selectedPkg[0].pkg_fee;
        this.package_Name = this.selectedPkg[0].pkg_title;

        const index = this.allBills.findIndex(i => i.name === 'pkgFee')
        if (index !== -1) {
          this.allBills.splice(index, 1)
        }
        this.allBills.splice(0, 0, { name: 'pkgFee', value: this.package_Fee })
        console.log('All bills', this.allBills);
        this.order_form.controls.pkg_id.patchValue(this.selectedPkg[0].tbl_pkg_id);
        this.calculateTotalBill();
        break;
      case 'Gold':
        this.selectedPkg = this.allpkg.filter(pkg => pkg.pkg_title === 'Platinum')
        this.package_Fee = this.selectedPkg[0].pkg_fee;
        this.package_Name = this.selectedPkg[0].pkg_title;

        const index1 = this.allBills.findIndex(i => i.name === 'pkgFee')
        if (index1 !== -1) {
          this.allBills.splice(index1, 1)
        }
        this.allBills.splice(0, 0, { name: 'pkgFee', value: this.package_Fee })
        console.log('All bills', this.allBills)
        this.calculateTotalBill();
        break;
    }
    console.log('updated pkg', this.selectedPkg)
    console.log('updated pkg services', this.selectedPkg[0].addon_services)
    this.isUpgradePkgTaxForm = true
    this.upgrade_service_pkg_form = false
    this.addOnsArray=[];
    this.timelineStep = 4;

  }
  removeFilledServiceFromAddOnsArray(title: string) {
    const lastItem = this.addOnsArray.slice(-1)[0];
    // Check if the last item's service_title is equal to 'serviceMashrAmazon'
    if (lastItem && lastItem.service_title === title) {
      // Do something
      this.review_form = true
      this.addOnsArrayForm = false;
      this.payment_btn = true;
      this.continue_btn = false;
      this.upgrade_btn = false;
    }
  }
  onSubmit() {
    if (this.temp_status == '') {
      this.temp_status = 'contact_form';
    }
    if (this.contact_form == true) {
      if (
        this.order_form.controls.fname.status == 'INVALID' ||
        this.order_form.controls.lname.status == 'INVALID' ||
        this.order_form.controls.Contact_phone.status == 'INVALID' ||
        this.order_form.controls.Contact_email.status == 'INVALID' ||
        this.order_form.controls.Contact_address.status == 'INVALID' ||
        this.order_form.controls.Contact_city.status == 'INVALID' ||
        this.order_form.controls.Contact_state.status == 'INVALID' ||
        this.order_form.controls.Contact_zip.status == 'INVALID' ||
        this.order_form.controls.Contact_country.status == 'INVALID'
      ) {
        const invalidControls = [
          'fname',
          'lname',
          'Contact_phone',
          'Contact_email',
          'Contact_address',
          'Contact_city',
          'Contact_state',
          'Contact_zip',
          'Contact_country'
        ];
        invalidControls.forEach(controlName => {
          const control = this.order_form.get(controlName);
          if (control) {
            control.markAsTouched();
          }
        });
        let id = document.getElementById('account_details') as HTMLInputElement;
        this.scroll(id);
        return;
      }
      if (this.btn_title == 'Continue') {
        this.temp_status = 'contact_form';
        this.company_form = true;
        this.isUpgradePkgTaxForm = false
        this.contact_form = false;
        this.bar = 25;
        this.timelineStep = 2;
        this.step_1 = true;
        this.isPersonal_form = true;
        this.isCompany_form = false;
        this.back_btn = true;
        this.company_div = false;
        this.account_datails_div = false;
        this.mailling_address_div = false;
      } else if (this.btn_title == 'Upgrade') {
        this.review_form = true;
        this.contact_form = false;
        this.btn_title = 'Continue';
        this.continue_btn = false;
        this.upgrade_btn = false;
        this.payment_btn = true;
      }
    }
    else if (this.company_form == true) {

      if (
        this.order_form.controls.company_name_1.status == 'INVALID' ||
        this.order_form.controls.company_name_2.status == 'INVALID' ||
        this.order_form.controls.company_name_3.status == 'INVALID' ||
        this.order_form.controls.entityEndingPronunciation.status == 'INVALID'
      ) {
        let invalidControls = [
          'company_name_1',
          'company_name_2',
          'company_name_3',
          'entityEndingPronunciation'
        ];
        invalidControls.forEach(controlName => {
          const control = this.order_form.get(controlName);
          if (control) {
            control.markAsTouched();
          }
        })
        let id = document.getElementById('Company_Information') as HTMLInputElement;
        this.scroll(id);
        return;
      }
      if (this.order_form.controls.bussiness_address.value === '') {
        let id = document.getElementById('businessAddress') as HTMLInputElement;
        this.invalidBusinessAddress = "Business address is required";
        this.scroll(id);
        return;
      }
      if (
        this.order_form.controls.clientAddress_street.status == 'INVALID' ||
        this.order_form.controls.clientAddress_state.status == 'INVALID' ||
        this.order_form.controls.clientAddress_city.status == 'INVALID' ||
        this.order_form.controls.clientAddress_country.status == 'INVALID' ||
        this.order_form.controls.clientAddress_zipcode.status == 'INVALID' &&
        this.order_form.controls.bussiness_address.value === 'ownAddress'
      ) {
        const controls = [
          'clientAddress_street',
          'clientAddress_state',
          'clientAddress_city',
          'clientAddress_country',
          'clientAddress_zipcode',
          'bussiness_address'
        ];
        controls.forEach(controlName => {
          const control = this.order_form.get(controlName);
          if (control) {
            control.markAsTouched();
          }
        });
        let id = document.getElementById('businessAddress') as HTMLInputElement;
        this.scroll(id);
        this.accordion2.nativeElement.click();
        this.invalidClientBusinessAddress = true;
        // this.invalidBusinessAddress = "Pls fill all address fields.";
        return;
      }
      if (this.order_form.controls.bussiness_address_duration.value === '' &&
        this.order_form.controls.bussiness_address.value === 'ourAddress') {
        let id = document.getElementById('businessAddress') as HTMLInputElement;
        this.invalidBusinessAddress = 'Pls select address duration.';
        this.scroll(id);
        return;
      }
      this.invalidBusinessAddress = '';
      if (this.btn_title == 'Continue') {
        this.temp_status = 'company_form';
        this.company_form = false;
        this.second_form = true;
        this.bar = 50;
        this.timelineStep = 3;
        this.isUpgradePkgTaxForm = false
        this.step_1 = true;
        this.isPersonal_form = true;
        this.isCompany_form = true;
        this.back_btn = true;
        this.company_div = false;
        this.account_datails_div = false;
        this.mailling_address_div = false;
      } else if (this.btn_title == 'Upgrade') {
        this.review_form = true;
        this.company_form = false;
        this.btn_title = 'Continue';
        this.continue_btn = false;
        this.payment_btn = true;
      }

    }
    else if (this.second_form == true) {
            // Agent validation
            if (this.want_agent === false) {
              if (this.agent_type_individual) {
                if (
                  this.order_form.controls.Agent_fname.status == 'INVALID' ||
                  this.order_form.controls.Agent_lname.status == 'INVALID' ||
                  this.order_form.controls.Agent_address.status == 'INVALID' ||
                  this.order_form.controls.Agent_state.status == 'INVALID' ||
                  this.order_form.controls.Agent_city.status == 'INVALID' ||
                  this.order_form.controls.Agent_zip.status == 'INVALID'
                ) {
                  const controls = [
                    'Agent_fname',
                    'Agent_lname',
                    'Agent_address',
                    'Agent_state',
                    'Agent_city',
                    'Agent_zip'
                  ];
                  controls.forEach(controlName => {
                    const control = this.order_form.get(controlName);
                    if (control) {
                      control.markAsTouched();
                    }
                  });
                  let id = document.getElementById('register_agent') as HTMLInputElement;
                  this.scroll(id);
                  return;
                }
                this.agentTypeErrorDiv = false;
              } else if (this.agentIsCompany) {
                if (
                  this.order_form.controls.Agent_company_name.status ==
                  'INVALID' ||
                  this.order_form.controls.Agent_address.status == 'INVALID' ||
                  this.order_form.controls.Agent_state.status == 'INVALID' ||
                  this.order_form.controls.Agent_city.status == 'INVALID' ||
                  this.order_form.controls.Agent_zip.status == 'INVALID'
                ) {
                  const controls = [
                    'Agent_address',
                    'Agent_state',
                    'Agent_city',
                    'Agent_zip',
                    'Agent_company_name'
                  ];
                  controls.forEach(controlName => {
                    const control = this.order_form.get(controlName);
                    if (control) {
                      control.markAsTouched();
                    }
                  });
                  let id = document.getElementById('register_agent') as HTMLInputElement;
                  this.scroll(id);
                  return;
                }
                this.agentTypeErrorDiv = false;
              }
              if (!this.agent_type_individual && !this.agentIsCompany) {
                this.agentTypeErrorDiv = true;
                return
              }
            } else if (this.want_agent !== true) {
              let id = document.getElementById('register_agent') as HTMLInputElement;
              this.scroll(id);
              this.agent_div = true;
              return
            }
            if (this.order_form.controls.Agent_validation.status == 'INVALID') {
              let id = document.getElementById('register_agent') as HTMLInputElement;
              this.scroll(id);
              this.agent_div = true;
              return;
            } else {
              this.agent_div = false;
            }
      let members = [];
      let managers = [];
      if (!this.order_form.controls.companyStructure.value) {
        this.order_form.controls.companyStructure.markAsTouched();
        return
      }
      if (this.order_form.controls.companyStructure.value == 'Member Managed') {
        members = this.allmembers.filter(m => m.fname);
      }
      else if (this.order_form.controls.companyStructure.value == 'Manager Managed') {
        managers = this.allmanagers.filter(m => m.fname);
      }
      else if (this.order_form.controls.companyStructure.value == 'Both Managed') {
        members = this.allmembers.filter(m => m.fname);
        managers = this.allmanagers.filter(m => m.fname);
      }
      if (this.order_form.controls.companyStructure.value === 'Manager Managed'
        && managers.length < 1) {
        this.whenManagersAreEmpty = true;
        this.whenMembersAreEmpty = false;
        this.whenBothMembersAndManagersAreEmpty = false;
        return
      }
      if (this.order_form.controls.companyStructure.value === 'Member Managed'
        && members.length < 1) {
        this.whenMembersAreEmpty = true;
        this.whenManagersAreEmpty = false;
        this.whenBothMembersAndManagersAreEmpty = false;
        return
      }
      if (this.order_form.controls.companyStructure.value === 'Both Managed'
        && (managers.length < 1 || members.length < 1)) {
        this.whenBothMembersAndManagersAreEmpty = true;
        this.whenMembersAreEmpty = false;
        this.whenManagersAreEmpty = false;
        return
      }
      if (this.order_form.controls.companyStructure.value === 'Both Managed'||
      this.order_form.controls.companyStructure.value === 'Member Managed') {
    let totalEquity = this.allmembers.reduce((total, member) => {
      // Check if the member has a valid equity value and add it to the total
      if (member.equity) {
        return total + parseInt(member.equity);
      }
      // If the member doesn't have a valid equity value, return the current total unchanged
      return total;
    }, 0); // The initial value of the total is 0

    console.log('total equity', totalEquity);
    if(totalEquity>100){
  this.invalidEquity=true;
  return
    }
    else if(totalEquity<100){
      this.invalidEquity=true;
      return
        }
    else if(totalEquity == 100){
    this.invalidEquity=false;
        }
  }
      if (this.btn_title == 'Continue') {
        this.temp_status = 'second_form';
        this.second_form = false;
        if (this.package_Name !== 'Platinum') {
          this.upgrade_service_pkg_form = true;
          this.upgrade_btn = true;
          this.continue_btn = false;
        }
        else if (this.package_Name === 'Platinum') {
          this.isUpgradePkgTaxForm = true
          this.upgrade_btn = false;
          this.continue_btn = true;
        }
        this.timelineStep = 4;
        this.bar = 60;
        this.step_3 = true;
        this.agent_div = false;
        this.amazon_div = false;
      }
      else if (this.btn_title == 'Upgrade') {
        this.review_form = true;
        this.second_form = false;
        this.btn_title = 'Continue';
        this.upgrade_btn = false;
        this.continue_btn = false;
        this.payment_btn = true;
      }
    }
    else if (this.upgrade_service_pkg_form == true) {
      if (this.btn_title == 'Continue') {
        this.temp_status = 'upgrade_service_pkg_form';
        this.upgrade_btn = false;
        this.continue_btn = true;
        this.isUpgradePkg = true;
        this.timelineStep = 3;
        this.upgrade_service_pkg_form = false;
        this.updatePkg();
        this.bar = 60;
        this.step_1 = true;
        this.isPersonal_form = true;
        this.isCompany_form = true;
        this.back_btn = true;
        this.company_div = false;
        this.account_datails_div = false;
        this.mailling_address_div = false;
      } else if (this.btn_title == 'Upgrade') {
        this.review_form = true;
        this.company_form = false;
        this.btn_title = 'Continue';
        this.continue_btn = false;
        this.payment_btn = true;
      }
    }
    else if (this.isUpgradePkgTaxForm == true) {
      if(this.order_form.controls.SSN_validation.invalid){
this.tax_ssn_div = true;
return
      }

else if (this.order_form.controls.SSN_validation.value === 'With SSN' && this.order_form.controls.SSN.invalid
|| this.order_form.controls.SSN_holder_fname.invalid || this.order_form.controls.SSN_holder_city.invalid ||
this.order_form.controls.SSN_holder_state.invalid ||
this.order_form.controls.SSN_holder_zipcode.invalid || this.order_form.controls.SSN_holder_address.invalid ||
this.order_form.controls.SSN_holder_DOB.invalid) {
this.tax_ssn_div = true;
        return
      }

      if (this.btn_title == 'Continue') {
        this.temp_status = 'upgrade_service_pkg_form';
        if(this.package_Name!=='Platinum'){
             this.isUpgradePkgTaxForm = false;
        this.addOnsForm = true;
        }
        else if(this.package_Name === 'Platinum'){
          this.isUpgradePkgTaxForm = false;
     this.addOnsForm = false;
     this.review_form=true;
     }

        this.upgrade_btn = false;
        this.continue_btn = true;
        this.timelineStep = 5;
        this.upgrade_service_pkg_form = false;
        this.bar = 60;
        this.step_1 = true;
        this.isPersonal_form = true;
        this.isCompany_form = true;
        this.back_btn = true;
        this.company_div = false;
        this.account_datails_div = false;
        this.mailling_address_div = false;
      } else if (this.btn_title == 'Upgrade') {
        this.review_form = true;
        this.company_form = false;
        this.btn_title = 'Continue';
        this.continue_btn = false;
        this.payment_btn = true;
      }
    }
    else if (this.addOnsForm == true) {
      if (this.btn_title == 'Continue') {
        this.temp_status = 'addOnsForm';
        if (this.addOnsArray.length != 0) {
          this.addOnsArrayForm = true
          this.addOnsForm = false;
          this.isUpgradePkgTaxForm = false
          if (
            this.addOnsArray.some(item => item.service_title === 'serviceMashrEINwithoutSSN' ||
              this.addOnsArray.some(item => item.service_title === 'serviceMashrEINwithSSN')
            ) && this.tax_form == false) {
            this.tax_form = true
          }
          else if (
            this.addOnsArray.some(item => item.service_title === 'serviceMashrPayoneer')
            && this.bank_form == false
          ) {
            this.bank_form = true
          }
          else if (
            this.addOnsArray.some(item => item.service_title === 'serviceMashrAmazon')
          ) {
            this.addOnsArrayForm=false;
            this.review_form = true;
          }
          else if (
            this.addOnsArray.some(item => item.service_title === 'serviceMashrResellerCertificate')
          ) {
            this.addOnsArrayForm=false;
            this.review_form = true;
          }
        }
        else if (this.addOnsArray.length == 0) {
          this.review_form = true;
          this.addOnsForm = false;
          this.payment_btn = true;
          this.continue_btn = false;
          this.timelineStep = 6;
        }
        this.bar = 80;
        this.step_1 = true;
        this.isUpgradePkgTaxForm = false
        this.isPersonal_form = true;
        this.isCompany_form = true;
        this.back_btn = true;
        this.company_div = false;
        this.account_datails_div = false;
        this.mailling_address_div = false;
      } else if (this.btn_title == 'Upgrade') {
        this.review_form = true;
        this.company_form = false;
        this.btn_title = 'Continue';
        this.continue_btn = false;
        this.payment_btn = true;
      }
    }
    else if (this.addOnsArrayForm == true) {

      if (
        this.addOnsArray.some(item => item.service_title === 'serviceMashrEINwithoutSSN' ||
          this.addOnsArray.some(item => item.service_title === 'serviceMashrEINwithSSN')
        ) && this.tax_form == true) {
        if (this.order_form.controls.SSN_validation.value==='Without SSN') {
          this.tax_form = false;
          this.removeFilledServiceFromAddOnsArray('serviceMashrEINwithoutSSN');
          this.addOnsArray = this.addOnsArray.filter(item => item.service_title !== 'serviceMashrEINwithoutSSN');
          if (this.addOnsArray.some(item => item.service_title === 'serviceMashrPayoneer')) {
            this.bank_form = true;
            this.tax_form = false;
          }
          else { this.review_form = true; this.addOnsArrayForm = false; }
        } else if (this.order_form.controls.SSN_validation.invalid) {
          this.tax_ssn_div = true;
          return
        }
 else if (this.order_form.controls.SSN_validation.value === 'With SSN' && this.order_form.controls.SSN.invalid
  || this.order_form.controls.SSN_holder_fname.invalid || this.order_form.controls.SSN_holder_city.invalid || this.order_form.controls.SSN_holder_state.invalid ||
  this.order_form.controls.SSN_holder_zipcode.invalid || this.order_form.controls.SSN_holder_address.invalid || this.order_form.controls.SSN_holder_DOB.invalid) {
  this.tax_ssn_div = true;
          return
        }
        if (this.order_form.controls.SSN_validation.value==='With SSN') {
          this.tax_form = false;
          this.removeFilledServiceFromAddOnsArray('serviceMashrEINwithoutSSN');
          this.addOnsArray = this.addOnsArray.filter(item => item.service_title !== 'serviceMashrEINwithoutSSN');
          if (this.addOnsArray.some(item => item.service_title === 'serviceMashrPayoneer')) {
            this.bank_form = true;
            this.tax_form = false;
          }
          else { this.review_form = true; this.addOnsArrayForm = false; }
        }
      }
      else if (
        this.addOnsArray.some(item => item.service_title === 'serviceMashrResellerCertificate'
        ) && this.resellerForm == true) {
        this.resellerForm = false
        this.removeFilledServiceFromAddOnsArray('serviceMashrResellerCertificate');
        this.addOnsArray = this.addOnsArray.filter(item => item.service_title
          !== 'serviceMashrResellerCertificate');
        if (this.addOnsArray.some(item => item.service_title === 'serviceMashrEINwithoutSSN')) { this.tax_form = true; this.bank_form = false; }
        else if (this.addOnsArray.some(item => item.service_title === 'serviceMashrPayoneer')) { this.bank_form = true; this.tax_form = false; }
        // else if (this.addOnsArray.some(item => item.service_title === 'serviceMashrAmazon')) { this.ecommerceForm = true; }
        else { this.review_form = true; this.addOnsArrayForm = false; }

      }
      else if (
        this.addOnsArray.some(item => item.service_title === 'serviceMashrPayoneer'
        ) && this.bank_form == true) {
        let index = this.push_services.findIndex(
          (ser) => ser.service_title === 'serviceMashrPayoneer' ||
            ser.service_title === 'serviceMashrWise'
        );
        if (index === -1) {
          this.bank_div = true
          return
        }

        if (index !== -1) {
          this.bank_form = false;
          this.bank_div = false
          this.removeFilledServiceFromAddOnsArray('serviceMashrPayoneer');
          this.removeFilledServiceFromAddOnsArray('serviceMashrWise');
          this.addOnsArray = this.addOnsArray.filter(item => item.service_title !== 'serviceMashrPayoneer');
          if (this.addOnsArray.some(item => item.service_title === 'serviceMashrEINwithoutSSN')) { this.tax_form = true; this.bank_form = false; }
          else { this.review_form = true; this.addOnsArrayForm = false; }
        }
      }
      else if (
        this.addOnsArray.some(item => item.service_title === 'serviceMashrAmazon'
        ) && this.ecommerceForm == true) {
        this.ecommerceForm = false
        this.removeFilledServiceFromAddOnsArray('serviceMashrAmazon');
        this.addOnsArray = this.addOnsArray.filter(item => item.service_title !== 'serviceMashrAmazon');
        if (this.addOnsArray.some(item => item.service_title === 'serviceMashrEINwithoutSSN')) { this.tax_form = true; this.bank_form = false; }
        // else if (this.addOnsArray.some(item => item.service_title === 'serviceMashrResellerCertificate')) { this.resellerForm = true; }
        else if (this.addOnsArray.some(item => item.service_title === 'serviceMashrPayoneer' || item.service_title === 'serviceMashrWise')) { this.bank_form = true; this.tax_form = false; }
        else { this.review_form = true; this.addOnsArrayForm = false; }
      }
      this.bar = 99;
      this.timelineStep = 6;
    }

    else if (this.review_form == true) {
      this.temp_status = 'billing_form';
      this.payment_btn = true;
      this.continue_btn = false;
      this.upgrade_btn = false;
      this.step_5 = true;
      this.isUpgradePkgTaxForm = false
      this.bar = 90;
      this.timelineStep = 6;
    } else if
      (this.billing_form == true) {
      this.temp_status = 'Compelete';
      this.step_6 = true;
      // this.isPayment_form = true;
    }
    let employees = [];
    if (this.order_form.controls.companyStructure.value == 'Member Managed') {
      employees = this.allmembers.filter(m => m.fname);
    }
    else if (this.order_form.controls.companyStructure.value == 'Manager Managed') {
      employees = this.allmanagers.filter(m => m.fname);
    }
    else if (this.order_form.controls.companyStructure.value == 'Both Managed') {
      employees = this.allmembers.filter(m => m.fname).concat(this.allmanagers.filter(m => m.fname))
    }
    let data = {
      tbl_entity_id: this.order_form.value['entity'],
      tbl_country_id: this.order_form.controls.formation_Country.value,
      tbl_state_id: this.formation_state_id,
      contact_fname: this.order_form.value['fname'],
      contact_lname: this.order_form.value['lname'],
      contact_email: this.order_form.value['Contact_email'],
      attonry_email: this.order_form.value['Contact_email'],
      passport_image_1: '',
      passport_image_2: '',
      contact_phonenumber: this.order_form.value['Contact_phone'],
      contact_street_address: this.order_form.value['Contact_address'],
      contact_city: this.order_form.value['Contact_city'],
      contact_state: this.order_form.value['Contact_state'],
      contact_zipcode: this.order_form.value['Contact_zip'],
      contact_country: this.order_form.value['Contact_country'],
      address_duration_id: this.order_form.value['bussiness_address_duration'],
      company_name_1: this.order_form.value['company_name_1'],
      company_name_2: this.order_form.value['company_name_2'],
      company_name_3: this.order_form.value['company_name_3'],
      clientAddress_street: this.order_form.value['clientAddress_street'],
      clientAddress_state: this.order_form.value['clientAddress_state'],
      clientAddress_city: this.order_form.value['clientAddress_city'],
      clientAddress_country: this.order_form.value['clientAddress_country'],
      clientAddress_zipcode: this.order_form.value['clientAddress_zipcode'],
      company_registration_documents: null,
      number_of_llc_owners: null,
      business_type_id: this.order_form.value['company_category'],
      company_EIN: this.order_form.value['SSN'],
      SSN_holder_fname: this.order_form.value['SSN_holder_fname'],
      SSN_holder_lname: this.order_form.value['SSN_holder_lname'],
      SSN_holder_address: this.order_form.value['SSN_holder_city'],
      SSN_holder_DOB: this.order_form.value['SSN_holder_DOB'],
      SSN_holder_city: this.order_form.value['SSN_holder_address'],
      SSN_holder_zipcode: this.order_form.value['SSN_holder_state'],
      SSN_holder_state: this.order_form.value['SSN_holder_zipcode'],
      bank_type: this.getSelectedBanks(),
      usa_contact_number: null,
      resale_certificate: null,
      server_ram: null,
      region: null,
      vps_country: null,
      cnic_front_image: '',
      cnic_back_image: '',
      driving_license_image_1: '',
      driving_license_image_2: '',
      utility_bill_image: '',
      agent_company_name: this.order_form.value['Agent_company_name'],
      agent_fname: this.order_form.value['Agent_fname'],
      agent_lname: this.order_form.value['Agent_lname'],
      agent_street_address: this.order_form.value['Agent_address'],
      agent_city: this.order_form.value['Agent_city'],
      agent_state: this.order_form.value['Agent_state'],
      agent_zipcode: this.order_form.value['Agent_zip'],
      total_days: this.total_days,
      total_amount: this.Newtotal_bill,
      tbl_user_id: this.order_form.value['uid'],
      row_id: this.order_form.value['order_id'],
      services: this.push_services,
      temp_status: this.temp_status,
      company_employers: employees,
      tbl_pkg_id: this.order_form.controls.pkg_id.value,
      reasonOfAmendment: this.order_form.controls.reasonOfAmendment.value,
      whatYouWantToAmend: this.order_form.controls.whatYouWantToAmend.value,
      taxFilingType: this.order_form.controls.taxFilingType.value,
      rtNumber: this.order_form.controls.rtNumber.value,
      xtNumber: this.order_form.controls.xtNumber.value,
      companyDoc: this.order_form.controls.companyDoc.value,
      einDoc: this.order_form.controls.einDoc.value,
      amendmentLevel: this.order_form.controls.amendmentLevel.value,
      entityEndingPronunciation: this.order_form.controls.entityEndingPronunciation.value,
      companyStructure: this.order_form.controls.companyStructure.value,
    };
    this.loading = true;
    console.log('before submit', data);
    this.ser.addOrder(data).subscribe((res: any) => {
      this.loading = false;
      console.log('After submit', res);
      this.order_id = res;
      if (res == 'email_already_exists') {
        this.company_form = false;
        this.contact_form = true;
        Swal.fire({
          icon: 'error',
          title: 'Email Already Exist.',
          text: 'You cannot use single email for more than one LLC formation.',
        });
        this.temp_status = '';
        return;
      } else {
        // if (localStorage.getItem("user_id") == null) {
        //   localStorage.setItem('user_id', res.order[0].tbl_user_id);
        // }
        if(res.order[0].tbl_user_id){
          localStorage.setItem('user_id', res.order[0].tbl_user_id);
        }
        localStorage.setItem('order_id', res.order[0].tbl_order_id);
        if (res.order[0].contact_fname != '') {
          this.order_form.controls['fname'].patchValue(res.order[0].contact_fname);
        }
        if (res.order[0].contact_lname != '') {
          this.order_form.controls['lname'].patchValue(res.order[0].contact_lname);
        }
        if (res.order[0].company_EIN != '') {
          this.order_form.controls['SSN'].patchValue(res.order[0].company_EIN);
        }
        if (res.order[0].company_purpose != '') {
          this.order_form.controls['company_purpose'].patchValue(
            res.order[0].company_purpose
          );
        }
        if (res.order[0].contact_city != '') {
          this.order_form.controls['Contact_city'].patchValue(
            res.order[0].contact_city
          );
        }
        if (res.order[0].contact_email != '') {
          this.order_form.controls['Contact_email'].patchValue(
            res.order[0].contact_email
          );
        }
        if (res.order[0].contact_phonenumber != '') {
          this.order_form.controls['Contact_phone'].patchValue(
            res.order[0].contact_phonenumber
          );
        }
        if (res.order[0].contact_state != '') {
          this.order_form.controls['Contact_state'].patchValue(
            res.order[0].contact_state
          );
        }
        if (res.order[0].contact_street_address != '') {
          this.order_form.controls['Contact_address'].patchValue(
            res.order[0].contact_street_address
          );
        }
        if (res.order[0].contact_zipcode != '') {
          this.order_form.controls['Contact_zip'].patchValue(
            res.order[0].contact_zipcode
          );
        }
        if (res.order[0].designator != '') {
          this.order_form.controls['designator'].patchValue(res.order[0].designator);
        }
        if (res.order[0].tbl_company_category_id != '') {
          this.order_form.controls['company_category'].patchValue(
            res.order[0].business_type_id
          );
        }
        if (res.order[0].company_name_1 != '') {
          this.order_form.controls['company_name_1'].patchValue(
            res.order[0].company_name_1
          );
        }
        if (res.order[0].company_name_2 != '') {
          this.order_form.controls['company_name_2'].patchValue(
            res.order[0].company_name_2
          );
        }
        if (res.order[0].company_name_3 != '') {
          this.order_form.controls['company_name_3'].patchValue(
            res.order[0].company_name_3
          );
        }
        if (res.order[0].agent_city != '') {
          this.order_form.controls['Agent_city'].patchValue(res.order[0].agent_city);
        }
        if (res.order[0].agent_company_name != '') {
          this.order_form.controls['Agent_company_name'].patchValue(
            res.order[0].agent_company_name
          );
        }
        if (res.order[0].agent_fname != '') {
          this.order_form.controls['Agent_fname'].patchValue(
            res.order[0].agent_fname
          );
        }

        if (res.order[0].agent_lname != '') {
          this.order_form.controls['Agent_lname'].patchValue(
            res.order[0].agent_lname
          );
        }

        if (res.order[0].agent_state != '') {
          this.order_form.controls['Agent_state'].patchValue(
            res.order[0].agent_state
          );
        }

        if (res.order[0].agent_street_address != '') {
          this.order_form.controls['Agent_address'].patchValue(
            res.order[0].agent_street_address
          );
        }

        if (res.order[0].agent_zipcode != '') {
          this.order_form.controls['Agent_zip'].patchValue(
            res.order[0].agent_zipcode
          );
        }


        if (res.order[0].tbl_entity_id != '') {
          this.order_form.controls['entity'].patchValue(res.order[0].tbl_entity_id);
        }

        if (res.order[0].tbl_country_id != '') {
          this.order_form.controls['formation_Country'].patchValue(
            res.order[0].tbl_country_id
          );
        }
        if (res.order[0].tbl_order_id != '') {
          this.order_form.controls['order_id'].patchValue(res.order[0].tbl_order_id);
        }
        if (res.order[0].tbl_user_id != '') {
          this.order_form.controls['uid'].patchValue(res.order[0].tbl_user_id);
        }

        if (res.order[0].passport_image_1 != '') {
          this.order_form.controls['pass_img_1'].patchValue(
            res.order[0].passport_image_1
          );
        }
        if (res.order[0].passport_image_2 != '') {
          this.order_form.controls['pass_img_2'].patchValue(
            res.order[0].passport_image_2
          );
        }
        if (res.order[0].cnic_front_image != '') {
          this.order_form.controls['cnic_1'].patchValue(
            res.order[0].cnic_front_image
          );
        }
        if (res.order[0].cnic_back_image != '') {
          this.order_form.controls['cnic_2'].patchValue(
            res.order[0].cnic_back_image
          );
        }
        if (res.order[0].driving_license_image_1 != '') {
          this.order_form.controls['driving_1'].patchValue(
            res.order[0].driving_license_image_1
          );
        }
        if (res.order[0].driving_license_image_2 != '') {
          this.order_form.controls['driving_2'].patchValue(
            res.order[0].driving_license_image_2
          );
        }
        if (res.order[0].utility_bill_image != '') {
          this.order_form.controls['utility_name'].patchValue(
            res.order[0].utility_bill_image
          );
        }

        if (res.order[0].company_address != '') {
          this.order_form.controls['company_street'].patchValue(
            res.order[0].company_address
          );
        }
        if (res.order[0].company_address == '') {
          this.order_form.controls['company_street'].patchValue(
            this.order_form.controls['Contact_address'].value
          );
        }

        if (res.company_members.length > 0) {

          this.control = '';
          this.managerControls = '';
          let company_members: any[] = [];
          for (let i = 0; i < res.company_members.length; i++) {
            company_members.push(res.company_members[i]);
          }
          console.log('all members', company_members)
          var temp_allmembers: any[] = company_members.filter(ser => ser.member_type === "Member")
          var temp_allmanagers: any[] = company_members.filter(ser => ser.member_type === "Manager")
          for (let i = 0; i < temp_allmembers.length; i++) {
            this.control = <FormArray>this.order_form.controls['company_members'];
            this.allmembers = temp_allmembers
            console.log('All member after', this.allmembers);
          }
          for (let i = 0; i < temp_allmanagers.length; i++) {
            this.managerControls = <FormArray>this.order_form.controls['company_managers'];
            this.allmanagers = temp_allmanagers
            console.log('this.All manager after', this.allmanagers);
          }
        }
        console.log('ORDER FORM', this.order_form.value);
      }
    },
      (error: any) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Oops..',
          text: 'Please Reload the page and continue',
        });
        console.error('An error occurred:', error);
      }
    );
  }
  openExpensionPanel(panelRef: MatExpansionPanel) {
    panelRef.open()
  }
  show_swal_if_order_exist() {
    console.log('INSIDE SWAL', this.temp_status);
    if (localStorage.getItem('order_id')) {
      console.log('OID', localStorage.getItem('order_id'));
      switch (this.temp_status) {
        case 'contact_form':
          this.contact_form = true;
          this.timelineStep = 1;
          this.company_form = false;
          this.second_form = false;
          this.upgrade_service_pkg_form = false;
          this.addOnsForm = false;
          this.addOnsArrayForm = false;
          this.review_form = false;
          break;
        case 'company_form':
          this.contact_form = false;
          this.company_form = true;
          this.timelineStep = 2;

          this.second_form = false;
          this.upgrade_service_pkg_form = false;
          this.addOnsForm = false;
          this.addOnsArrayForm = false;
          this.review_form = false;
          break;
        case 'second_form':
          this.contact_form = false;
          this.company_form = false;
          this.second_form = true;
          this.timelineStep = 3;
          this.upgrade_service_pkg_form = false;
          this.addOnsForm = false;
          this.addOnsArrayForm = false;
          this.review_form = false;
          this.bar = 20;
          this.step_1 = true;
          this.back_btn = true;
          break;

        case 'upgrade_service_pkg_form':
          this.contact_form = false;
          this.company_form = false;
          this.second_form = false;
          this.timelineStep = 3;
          this.upgrade_service_pkg_form = true;
          this.addOnsForm = false;
          this.addOnsArrayForm = false;
          this.review_form = false;
          this.upgrade_btn = true;
          this.continue_btn = false
          this.bar = 40;
          this.step_1 = true;
          this.step_2 = true;
          this.back_btn = true;
          break;

        case 'addOnsForm':

          this.contact_form = false;
          this.company_form = false;
          this.second_form = false;
          this.upgrade_service_pkg_form = false;
          this.addOnsForm = true;
          this.addOnsArrayForm = false;
          this.review_form = false;
          this.bar = 60;
          this.timelineStep = 5;

          this.step_1 = true;
          this.step_2 = true;
          this.step_3 = true;

          this.back_btn = true;
          break;

        case 'addOnsArrayForm':
          this.contact_form = false;
          this.company_form = false;
          this.second_form = false;
          this.upgrade_service_pkg_form = false;
          this.addOnsForm = false;
          this.addOnsArrayForm = true;
          this.review_form = false;
          this.bar = 80;
          this.timelineStep = 5;

          this.step_1 = true;
          this.step_2 = true;
          this.step_3 = true;
          this.step_4 = true;

          this.payment_btn = true;
          this.continue_btn = false
          this.back_btn = true;
          break;
        case 'review_form':
        case 'billing_form':
          this.contact_form = false;
          this.company_form = false;
          this.second_form = false;
          this.upgrade_service_pkg_form = false;
          this.addOnsForm = false;
          this.addOnsArrayForm = false;
          this.review_form = true;
          this.timelineStep = 6;
          this.bar = 99;
          this.step_1 = true;
          this.step_2 = true;
          this.step_3 = true;
          this.step_4 = true;
          this.step_5 = true;

          this.payment_btn = true;
          this.continue_btn = false
          this.back_btn = true;
          break;
      }
      // end
      if (
        this.bussiness_address_fee == 0 ||
        this.bussiness_address_fee == null
      ) {
        this.address_fee = false;
        this.your_address = true;
      }
      if (this.temp_status != '') {
        this.isPersonal_form = true;
        this.isCompany_form = true;
      }
      this.isMember_form = true;
      if (
        this.temp_status != ''
      ) {
        let feeArray: any[] = this.push_services.filter(
          (ser) => ser.tbl_service_id == '1'
        );
        if (feeArray.length != 0) {
          this.order_form.controls.bussiness_address.patchValue(
            'ourAddress'
          );
          this.address_fee = true
          this.total_bill = this.total_bill + this.bussiness_address_fee * 1;
          this.address_ser_fee = +feeArray[0].service_fee
          this.address_ser_days = +feeArray[0].business_days
          this.total_bill = this.total_bill + this.address_ser_fee
          this.total_days = this.total_days + this.address_ser_days
        } else {
          this.order_form.controls.bussiness_address.patchValue(
            'ownAddress'
          );
        }
      }
      if (
        this.temp_status != ''
      ) {
        this;
        let feeArray: any[] = this.push_services.filter(
          (ser) => ser.tbl_service_id == '2'
        );
        if (this.agent_fee == 0 && feeArray.length != 0) {
          this.agent_fee = +feeArray[0].service_fee;
          this.agent_days = +feeArray[0].business_days;
          this.total_bill = this.total_bill + this.agent_fee;
          this.total_days = this.total_days + this.agent_days;
          this.our_agent_div = true;
          this.Agent_fee = true;
          this.want_agent = true;
          this.isAgent_form = false;
          this.order_form.controls.Agent_validation.patchValue('agent');
        } else if (feeArray.length == 0) {
          this.want_agent = undefined;
          this.our_agent_div = false;
          this.isAgent_form = true;
          this.Agent_fee = false;
          this.order_form.controls.Agent_validation.patchValue('not_agent');
        }
      }
      if (
        this.temp_status != ''
      ) {
        this;
        let feeArray: any[] = this.push_services.filter(
          (ser) => ser.tbl_service_id == "8"
        );
        if (this.amazon_fee == 0 && feeArray.length != 0) {
          this.amazon_fee = +feeArray[0].service_fee;
          this.amazon_days = +feeArray[0].business_days;
          this.total_bill = this.total_bill + this.amazon_fee;
          this.total_days = this.total_days + this.amazon_days;
          this.Amazon_card = true;
          this.Amazon_fee = true;
          this.isAmazon_form = false;
          this.order_form.controls.Amazon_validation.patchValue('valid');
          this.want_amazon = true;
        } else if (this.amazon_fee != 0 && feeArray.length == 0) {
          this.Amazon_card = false;
          this.isAmazon_form = true;
          this.Amazon_fee = false;
          this.want_amazon = false;
          this.order_form.controls.Amazon_validation.patchValue('valid');
        }
      }
      if (
        this.temp_status != ''
      ) {
        let feeArray: any[] = this.push_services.filter(
          (ser) => ser.service_title === '4'
        );

        if (this.with_ssn_fee == 0 && feeArray.length != 0) {
          this.order_form.controls.SSN_validation.patchValue('With SSN');
          this.with_ssn_fee = +feeArray[0].service_fee;
          this.with_ssn_days = +feeArray[0].business_days;
          this.total_bill = this.total_bill + this.with_ssn_fee;
          this.total_days = this.total_days + this.with_ssn_days;
          this.EIN_div = true
          this.isEIN_form = true;
          this.without_EIN_form = false;
        }
      }
      if (
        this.temp_status != ''
      ) {
        let feeArray: any[] = this.push_services.filter(
          (ser) => ser.service_title === '5'
        );
        if (this.without_ssn_fee == 0 && feeArray.length != 0) {
          this.order_form.controls.SSN_validation.patchValue('Without SSN');
          this.without_ssn_fee = +feeArray[0].service_fee;
          this.without_ssn_days = +feeArray[0].business_days;
          this.total_bill = this.total_bill + this.without_ssn_fee;
          this.total_days = this.total_days + this.without_ssn_days;
          this.EIN_div = true
          this.isEIN_form = false;
          this.without_EIN_form = true;
        }
      }
      if (
        this.temp_status != ''
      ) {
        let feeArray: any[] = this.push_services.filter(
          (ser) => ser.service_title === '7'
        );

        // if (this.bank_fee == 0 && feeArray.length != 0) {
        //   this.bank_fee = +feeArray[0].service_fee;
        //   this.bank_days = +feeArray[0].business_days;
        //   this.total_bill = this.total_bill + this.bank_fee;
        //   this.total_days = this.total_days + this.bank_days;
        //   this.bank_fee_amount = true;
        //   this.isBank_form = false;
        //   this.want_bank = true;
        //   this.order_form.controls.bank_validation.patchValue('valid');
        //   if (feeArray[0].bank_type == 'Payoneer') {
        //     this.want_payoneer = true;
        //     this.bank_statment_div = true;
        //   } else if (feeArray[0].bank_type == 'Wise') {
        //     this.want_wise = true;
        //     this.bank_statment_div = true;
        //   }
        // } else {
        //   this.bank_statment_div = false;
        //   this.isBank_form = true;
        //   this.bank_fee_amount = false;
        //   this.want_bank = false;
        //   this.order_form.controls.bank_validation.patchValue('valid');
        // }
      }

    } else {
      console.log('last');
      return;
    }
  }

  company_members(): FormGroup {
    return this.fb.group({
      member_type: [this.add_name1],
      fname: ['', Validators.required],
      lname: [''],
      street: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      zipcode: ['', Validators.required],
      equity: ['', Validators.required],
      active: true,
    });
  }
  company_managers(): FormGroup {
    let i = this.allmanagers.length;
    return this.fb.group({
      member_type: [this.add_name2],
      fname: ['', [Validators.required]],
      lname: [''],
      street: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      zipcode: ['', Validators.required],
      equity: [''],
      active: true,
    });
  }
  add_members() {
    this.whenMembersAreEmpty = false;
    this.whenBothMembersAndManagersAreEmpty = false;
    this.whenManagersAreEmpty = false;
    this.control = <FormArray>this.order_form.controls['company_members'];
    let len = this.order_form.controls['company_members'].controls.length;
    this.control.push(this.company_members());
    console.log('Lemn', len);
    this.allmembers = [];
    for (let i = 0; i <= len; i++) {
      this.allmembers.push(this.order_form.controls['company_members'].value[i]);
    }
    for (let j = 0; j < this.allmembers.length - 1; j++) {
      this.allmembers[j].active = false
    }
    console.log('All members inside add member', this.allmembers);
    this.membersPanelRef.open();
  }
  add_managers() {
    this.whenMembersAreEmpty = false;
    this.whenBothMembersAndManagersAreEmpty = false;
    this.whenManagersAreEmpty = false;
    this.control = <FormArray>this.order_form.controls['company_managers'];
    let len = this.order_form.controls['company_managers'].controls.length;
    this.control.push(this.company_managers());
    console.log('Lemn', len);
    this.allmanagers = [];
    for (let i = 0; i <= len; i++) {
      this.allmanagers.push(this.order_form.controls['company_managers'].value[i]);
    }
    for (let j = 0; j < this.allmanagers.length - 1; j++) {
      this.allmanagers[j].active = false
    }
    console.log('All managers inside add managers', this.allmanagers);
    this.managersPanelRef.open();
  }

  editMember(i: any) {
    this.allmembers.forEach(mem => {
      mem.active = false
    });
    this.allmembers[i]['active'] = true;
    console.log('edit mem', this.allmembers);
    this.membersPanelRef.open();
  }
  editManager(i: any) {
    this.allmanagers.forEach(mem => {
      mem.active = false;
    })
    this.allmanagers[i]['active'] = true;
    console.log('edit manager', this.allmanagers);
    this.managersPanelRef.open();
  }

  edit(id: any) {
    this.continue_btn = true;
    this.payment_btn = false
    this.btn_title = 'Upgrade';
    this.isEditClicked = true;
    this.review_form = false;
    switch (id) {
      case 'contact_form':
        this.contact_form = true;
        break;
      case 'company_form':
        this.company_form = true;
        break;
      case 'second_form':
        this.second_form = true;
        break;

      case 'tax_form':
        this.tax_form = true;
        this.addOnsArrayForm = true
        break;
      case 'bank_form':
        this.bank_form = true;
        this.addOnsArrayForm = true
        break;
    }
  }
  getNonEmptyMembers(): any[] {
    return this.allmembers.filter(mem => mem.fname);
  }
  getNonEmptyManagers(): any[] {
    return this.allmanagers.filter(mem => mem.fname);
  }

  save_members(index: any, panelRef: MatExpansionPanel) {
    if (this.order_form.controls.company_members.controls[index].status === 'INVALID') {
      const invalidControls = [
        'fname',
        'city',
        'state',
        'zipcode',
        'equity',
        'country'
      ];
      invalidControls.forEach(controlName => {
        const control = this.order_form.controls.company_members.controls[index].get(controlName);
        if (control) {
          control.markAsTouched();
        }
      });
      return
    }
    let len = (<FormArray>this.order_form.get('company_members')).controls.length;
    this.allmembers = [];
    for (let i = 0; i < len; i++) {
      this.allmembers.push(
        this.order_form.controls['company_members'].at(i).value);
      this.allmembers[i].active = false;
    }
    console.warn('Saved members', this.allmembers);
    panelRef.close();
  }
  save_managers(index: any, panelRef: MatExpansionPanel) {
    console.log('before empty', this.allmanagers);
    if (this.order_form.controls.company_managers.controls[index].status === 'INVALID') {
      const invalidControls = [
        'fname',
        'city',
        'state',
        'zipcode',
        'country'
      ];
      invalidControls.forEach(controlName => {
        const control = this.order_form.controls.company_managers.controls[index].get(controlName);
        if (control) {
          control.markAsTouched();
        }
      });
      return
    }
    let len = (<FormArray>this.order_form.get('company_managers')).controls.length;
    console.log('Lemn', len);
    this.allmanagers = [];
    for (let i = 0; i < len; i++) {
      this.allmanagers.push(
        this.order_form.controls['company_managers'].at(i).value);
      this.allmanagers[i].active = false;
    }
    console.warn('After empty', this.allmanagers);
    panelRef.close();
  }

  delete_member(i: any) {
    const companyMembersControl = this.order_form.get('company_members') as FormArray;
    companyMembersControl.removeAt(i);
    this.allmembers.splice(i, 1);
  }

  delete_manager(i: any) {
    const companyManagersControl = this.order_form.get('company_managers') as FormArray;
    companyManagersControl.removeAt(i);
    this.allmanagers.splice(i, 1);
  }
  cancel_manager(i: any, panelRef: MatExpansionPanel) {
    const companyManagersControl = this.order_form.get('company_managers') as FormArray;
    companyManagersControl.removeAt(i);
    this.allmanagers.splice(i, 1);
    this.managersPanelRef.close();
  }
  cancel_member(i: any, panelRef: MatExpansionPanel) {
    const companyMembersControl = this.order_form.get('company_members') as FormArray;
    companyMembersControl.removeAt(i);
    this.allmembers.splice(i, 1);
    this.membersPanelRef.close();
  }

  // Agent Service



  select_agent_option(id: any) {
    this.agent_div = false;
    if (id == 'not_want_agent') {
      this.want_agent = false;
      let index = this.push_services.findIndex(
        (ser) => ser.tbl_service_id == 2
      );
      if (index !== -1) {
        this.push_services.splice(index, 1);
        this.agent_fee = 0;
        let index1 = this.allBills.findIndex(item => item.name === 'registeredAgent');
        if (index1 !== -1) {
          this.allBills.splice(index1, 1);
          console.log('after removing RA from bills', this.allBills);
          this.calculateTotalBill();
        }
      }
      this.isAgentAddressInitialized = true;
      this.agent_div = false;
      this.our_agent_div = false;
      this.isAgent_form = true;
      this.Agent_fee = false;
      this.order_form.controls.Agent_validation.patchValue('not_agent');
      this.order_form.controls.IsWantAgent.patchValue(false);
      this.order_form.controls['Agent_fname'].patchValue(
        this.order_form.controls['fname'].value
      );
      this.order_form.controls['Agent_lname'].patchValue(
        this.order_form.controls['lname'].value
      );
      this.order_form.controls['Agent_address'].patchValue(
        this.order_form.controls['Contact_address'].value
      );
      this.order_form.controls['Agent_city'].patchValue(
        this.order_form.controls['Contact_city'].value
      );
      this.order_form.controls['Agent_state'].patchValue(
        this.order_form.controls['Contact_state'].value
      );
      this.order_form.controls['Agent_zip'].patchValue(
        this.order_form.controls['Contact_zip'].value
      );
      console.log('After removing RA', this.push_services);
    } else if (id == 'want_agent') {
      this.agent_div = false;
      let index = this.push_services.findIndex(
        (ser) => ser.tbl_service_id == '2'
      );
      if (index === -1) {
        let feeArray: any[] = this.get_all_services.filter(
          (ser) => ser.service_title === 'serviceMashrRegisteredAgent'
        );
        let agent_id = {
          tbl_service_id: feeArray[0].tbl_service_id,
          service_title: feeArray[0].service_title,
          service_fee: feeArray[0].service_fee,
          bank_type: 'other',
        };
        this.push_services.push(agent_id);
        this.agent_fee = +feeArray[0].service_fee;
        if (this.allBills.findIndex(item => item.name === 'registeredAgent') === -1) {
          this.allBills.push({ name: 'registeredAgent', value: this.agent_fee });
          this.calculateTotalBill();
        }
      }
      this.our_agent_div = true;
      this.want_agent = true;
      this.Agent_fee = true;
      this.isAgent_form = false;
      this.order_form.controls.IsWantAgent.patchValue(true);
      this.order_form.controls.Agent_validation.patchValue('agent');
      this.order_form.controls['Agent_company_name'].patchValue('');
      this.order_form.controls['Agent_fname'].patchValue('');
      this.order_form.controls['Agent_lname'].patchValue('');
      this.order_form.controls['Agent_address'].patchValue('');
      this.order_form.controls['Agent_city'].patchValue('');
      this.order_form.controls['Agent_state'].patchValue('');
      this.order_form.controls['Agent_zip'].patchValue('');
      console.log('After pushing RA', this.push_services);
    }
  }

  // amazon service
  select_amazon_option(id: any) {
    if (id == 'not_want_amazon') {
      this.want_amazon = false;
      this.amazon_div = false;
      this.Amazon_card = false;
      let index = this.push_services.findIndex(
        (ser) => ser.tbl_service_id == '8'
      );
      if (index !== -1) {
        this.push_services.splice(index, 1);
        this.amazon_fee = 0;
      }
      const index1 = this.allBills.findIndex((r) => r.name === 'amazonFee')
      if (index1 !== -1) {
        this.allBills.splice(index1, 1);
        this.calculateTotalBill();
      }

      this.isAmazon_form = true;
      this.Amazon_fee = false;
      this.order_form.controls.Amazon_validation.patchValue('valid');
    } else if (id == 'want_amazon') {
      this.want_amazon = true;
      this.amazon_div = false;
      this.Amazon_card = true
      let feeArray: any[] = this.get_all_services.filter(
        (ser) => ser.service_title === 'serviceMashrAmazon'
      );

      let index = this.push_services.findIndex(
        (ser) => ser.tbl_service_id == '8'
      );

      console.log(index, '===============');
      if (index === -1) {
        let amazon = {
          tbl_service_id: feeArray[0].tbl_service_id,
          service_title: feeArray[0].service_title,
          service_fee: feeArray[0].service_fee,
          bank_type: 'other',

        };
        this.push_services.push(amazon);
        this.amazon_days = 0;
      }

      this.amazon_fee = feeArray[0].service_fee;
      const index1 = this.allBills.findIndex((r) => r.name === 'amazonFee');
      console.log('INDEX 111', index1);

      if (this.allBills.findIndex(item => item.name === 'amazonFee') === -1) {
        this.allBills.push({ name: 'amazonFee', value: this.amazon_fee });
        this.calculateTotalBill();
      }

      this.Amazon_fee = true;
      this.isAmazon_form = false;
      this.order_form.controls.Amazon_validation.patchValue('valid');
    }
  }
  // end
  // reseller certificate
  select_reseller_certificate_option(id: any) {
    if (id == 'not_want_reseller') {
      this.want_reseller = false;
      console.log('not want reseller')
      const index = this.allBills.findIndex(i => i.name === 'resellerFee')
      if (index !== -1) {
        this.allBills.splice(index, 1)
        this.calculateTotalBill();
      }
      let index1 = this.push_services.findIndex(
        (ser) => ser.tbl_service_id == '6'
      );
      console.log(index1, '===============');
      if (index1 !== -1) {
        this.push_services.splice(index1, 1);
        this.reseller_fee = 0;
      }
      this.reseller_div = false;
      this.Reseller_card = false;
      this.isReseller_form = true;
      this.Reseller_fee = false;
      this.order_form.controls.Reseller_validation.patchValue('valid');
    }
    else if (id == 'want_reseller') {
      console.log(' want reseller')
      this.want_reseller = true;
      let arrFee: any[] = this.get_all_services.filter((ser) =>
        ser.service_title === 'serviceMashrResellerCertificate');
      let index3 = this.push_services.findIndex(
        (ser) => ser.tbl_service_id == '6'
      );
      if (index3 === -1) {
        let reseller_fee = {
          tbl_service_id: arrFee[0].tbl_service_id,
          service_title: arrFee[0].service_title,
          service_fee: arrFee[0].service_fee,
          bank_type: 'other',

        };
        this.push_services.push(reseller_fee);
      }
      console.log('Arr fee', arrFee);
      const index1 = this.allBills.findIndex((i) => i.name === 'resellerFee')
      if (index1 !== -1) {
        this.allBills.splice(index1, 1);
        this.calculateTotalBill();
      }
      if (this.allBills.findIndex(i => i.name === 'resellerFee') === -1) {
        this.allBills.push({ name: 'resellerFee', value: arrFee[0].service_fee })
        this.calculateTotalBill();
      }
      this.reseller_div = false;
      this.Reseller_card = true
      this.Reseller_fee = true;
      this.isReseller_form = false;
      this.order_form.controls.Reseller_validation.patchValue('valid');
    }
  }
  // end

  // Tax EIN services

  taxEIN(id: any) {
    this.tax_ssn_div=false;
    if (id == 'without SSN') {
      let feeArray: any[] = this.get_all_services.filter(
        (ser) => ser.service_title === 'serviceMashrEINwithoutSSN'
      );

      if(this.order_form.controls.SSN_holder_fname.value === ''){
      this.order_form.controls.SSN.patchValue('without SSN')
      this.order_form.controls.SSN.patchValue('without SSN')
      this.order_form.controls.SSN_holder_fname.patchValue('without SSN')
      this.order_form.controls.SSN_holder_lname.patchValue('without SSN')
      this.order_form.controls.SSN_holder_city.patchValue('without SSN')
      this.order_form.controls.SSN_holder_address.patchValue('without SSN')
      this.order_form.controls.SSN_holder_DOB.patchValue('without SSN')
      this.order_form.controls.SSN_holder_state.patchValue('without SSN')
      this.order_form.controls.SSN_holder_zipcode.patchValue('without SSN')
      }


      let index = this.push_services.findIndex(
        (ser) => ser.tbl_service_id == '5'
      );
      if (index === -1) {
        let without_ssn_id = {
          tbl_service_id: feeArray[0].tbl_service_id,
          service_title: feeArray[0].service_title,
          service_fee: feeArray[0].service_fee,
          bank_type: 'other',

        };
        this.push_services.push(without_ssn_id);
        let index1 = this.push_services.findIndex(
          (ser) => ser.tbl_service_id == '4'
        );
        if (index1 !== -1) {
          this.push_services.splice(index1, 1);
        }
        console.log(index1, '===============');
      }

      const index1 = this.allBills.findIndex((i) => i.name === 'EINwithSSNFee');

      console.log('INDEX----', index1)
      if (index1 !== -1) {
        this.allBills.splice(index1, 1)
        this.calculateTotalBill();
      }
      if (this.allBills.findIndex(item => item.name === 'EINwithoutSSNFee') === -1) {
        this.allBills.push({ name: 'EINwithoutSSNFee', value: feeArray[0].service_fee });
        this.calculateTotalBill();
      }
    }
    else if (id == 'with SSN') {
      setTimeout(() => {
        this.loadSSNAutocomplete();
      }, 2000);
      let feeArray: any[] = this.get_all_services.filter(
        (ser) => ser.service_title === 'serviceMashrEINwithSSN'
      );
      let index3 = this.push_services.findIndex(
        (ser) => ser.tbl_service_id == '4'
      );
      if (index3 === -1) {
        let with_ssn_fee = {
          tbl_service_id: feeArray[0].tbl_service_id,
          service_title: feeArray[0].service_title,
          service_fee: feeArray[0].service_fee,
          bank_type: 'other',

        };
        this.push_services.push(with_ssn_fee);
        let index1 = this.push_services.findIndex(
          (ser) => ser.tbl_service_id == '5'
        );
        console.log(index1, '===============');
        if (index1 !== -1) {
          this.push_services.splice(index1, 1);
        }
      }

      this.isSSNHolderInitialized = true;
      if (this.order_form.controls.SSN_holder_fname.value === 'without SSN') {
        this.order_form.controls.SSN.patchValue('')
        this.order_form.controls.SSN_holder_fname.patchValue('')
        this.order_form.controls.SSN_holder_lname.patchValue('')
        this.order_form.controls.SSN_holder_city.patchValue('')
        this.order_form.controls.SSN_holder_address.patchValue('')
        this.order_form.controls.SSN_holder_DOB.patchValue('')
        this.order_form.controls.SSN_holder_state.patchValue('')
        this.order_form.controls.SSN_holder_zipcode.patchValue('')
      }

      const index = this.allBills.findIndex((i) => i.name === 'EINwithoutSSNFee')
      if (index !== -1) {
        this.allBills.splice(index, 1)
        this.calculateTotalBill();
      }
      if (this.allBills.findIndex(item => item.name === 'EINwithSSNFee') === -1) {
        this.allBills.push({ name: 'EINwithSSNFee', value: feeArray[0].service_fee });
        this.calculateTotalBill();
      }
    }
  }

  addBanks(name: string) {
    if (name === 'Payoneer') {
      let feeArray: any[] = this.get_all_services.filter(
        (ser) => ser.service_title === 'serviceMashrPayoneer'
      );
      if (this.push_services.findIndex(ser => ser.service_title === 'serviceMashrPayoneer') === -1) {
        this.want_payoneer = true;
        let payoneer = {
          tbl_service_id: feeArray[0].tbl_service_id,
          service_title: feeArray[0].service_title,
          service_fee: feeArray[0].service_fee,
          bank_type: 'payoneer',
        };
        this.push_services.push(payoneer);
        if (this.allBills.findIndex(item => item.name === 'bankFeePayoneer') === -1) {
          this.allBills.push({ name: 'bankFeePayoneer', value: feeArray[0].service_fee });
        }
        this.bank_div = false;
      }
      else if (this.push_services.findIndex(ser => ser.service_title === 'serviceMashrPayoneer') !== -1) {
        this.allBills.splice(this.allBills.findIndex((r) => r.name === 'bankFeePayoneer'), 1);
        this.want_payoneer = false;
        let indexRemove = this.push_services.findIndex(
          (ser) => ser.service_title == 'serviceMashrPayoneer');
        if (indexRemove !== -1) {
          this.push_services.splice(indexRemove, 1);
        }
      }
    } else if (name === 'Wise') {
      let feeArray: any[] = this.get_all_services.filter(
        (ser) => ser.service_title === 'serviceMashrWise'
      );
      if (this.push_services.findIndex(ser => ser.service_title === 'serviceMashrWise') === -1) {
        this.want_wise = true;
        let wise = {
          tbl_service_id: feeArray[0].tbl_service_id,
          service_title: feeArray[0].service_title,
          service_fee: feeArray[0].service_fee,
          bank_type: 'wise',
        };
        this.push_services.push(wise);
        if (this.allBills.findIndex(item => item.name === 'bankFeeWise') === -1) {
          this.allBills.push({ name: 'bankFeeWise', value: feeArray[0].service_fee });
        }
        this.bank_div = false;
      }
      else if (this.push_services.findIndex(ser => ser.service_title === 'serviceMashrWise') !== -1) {
        this.allBills.splice(this.allBills.findIndex((r) => r.name === 'bankFeeWise'), 1);
        this.want_wise = false;
        let indexRemove = this.push_services.findIndex(
          (ser) => ser.service_title == 'serviceMashrWise');
        if (indexRemove !== -1) {
          this.push_services.splice(indexRemove, 1);
        }
      }
    }
    console.log('services after addBanks', this.push_services);
    this.calculateTotalBill();
  }

  // bank services
  select_Bank_option(id: any) {
    if (id == 'not_want_bank') {
      this.allBills.splice(this.allBills.findIndex((r) => r.name === 'bankFeePayoneer'), 1);
      this.allBills.splice(this.allBills.findIndex((r) => r.name === 'bankFeeWise'), 1);
      let indexRemove = this.push_services.findIndex(
        (ser) => ser.service_title == 'serviceMashrPayoneer');
      if (indexRemove !== -1) {
        this.push_services.splice(indexRemove, 1);
      }
      let indexRemove1 = this.push_services.findIndex(
        (ser) => ser.service_title == 'serviceMashrWise');
      if (indexRemove1 !== -1) {
        this.push_services.splice(indexRemove1, 1);
      }
      this.bank_div = false;
      this.order_form.controls.bank_validation.patchValue('valid');
      this.Bank_cardForReviewForm = false;
      this.isBankinAddon = false;
      this.calculateTotalBill();
    } else if (id == 'want_bank_ser') {
      this.bank_div = false;
      this.order_form.controls.bank_validation.patchValue('');
      this.Bank_cardForReviewForm = true;
      this.addBanks('Payoneer');
    }
    else if (id == 'Payoneer') {
      this.bank_div = false;
      this.want_payoneer = true;
      this.want_wise = false;
      this.selectedBankName = id;
      let index = this.push_services.findIndex((ser) => ser.bank_type === 'Wise');
      console.log(index, '===============');
      if (index !== -1) {
        this.push_services.splice(index, 1);
      }
      this.total_bill = this.total_bill - this.bank_fee;
      this.total_days = this.total_days - this.bank_days;
      this.bank_fee = 0;
      this.bank_days = 0;
      let feeArray: any[] = this.get_all_services.filter(
        (ser) => ser.service_title === 'serviceMashrPayoneer'
      );
      this.bank_fee = +feeArray[0].service_fee;
      this.bank_days = +feeArray[0].business_days;
      this.total_bill = this.total_bill + this.bank_fee;
      this.total_days = this.total_days + this.bank_days;
      let index2 = this.push_services.findIndex((ser) => ser.bank_type === 'Payoneer');
      if (index2 === -1) {
        this.bank_id = {
          tbl_service_id: feeArray[0].tbl_service_id,
          service_title: feeArray[0].service_title,
          service_fee: feeArray[0].service_fee,
          bank_type: id,
        };
        this.push_services.push(this.bank_id);
        console.log('push again bank service', this.push_services);
      }
      this.order_form.controls.bank_validation.patchValue('valid');
      this.bank_statment_div = true
      this.isBank_form = false;
      this.bank_fee_amount = true;
    } else if (id == 'Wise') {
      this.bank_div = false;

      this.want_payoneer = false;
      this.want_wise = true;
      this.selectedBankName = id;
      if (this.bank_fee != 0) {
        let index = this.push_services.findIndex(
          (ser) => ser.bank_type === 'Payoneer'
        );
        console.log(index, '===============');
        if (index !== -1) {
          this.push_services.splice(index, 1);
        }
        this.total_bill = this.total_bill - this.bank_fee;
        this.total_days = this.total_days - this.bank_days;
        this.bank_fee = 0;
        this.bank_days = 0;
      }
      let feeArray: any[] = this.get_all_services.filter(
        (ser) => ser.service_title === 'serviceMashrPayoneer'
      );

      if (this.bank_fee == 0) {
        this.bank_fee = +feeArray[0].service_fee;
        this.bank_days = +feeArray[0].business_days;
        this.total_bill = this.total_bill + this.bank_fee;
        this.total_days = this.total_days + this.bank_days;
        let index2 = this.push_services.findIndex((ser) => ser.bank_type === 'Wise');
        if (index2 === -1) {
          this.bank_id = {
            tbl_service_id: feeArray[0].tbl_service_id,
            service_title: feeArray[0].service_title,
            service_fee: feeArray[0].service_fee,
            bank_type: id,
          };
          this.push_services.push(this.bank_id);
          console.log('push again bank service', this.push_services);
        }
      }
      this.order_form.controls.bank_validation.patchValue('valid');
      this.bank_statment_div = true
      this.isBank_form = false;
      this.bank_fee_amount = true;
    }
  }
  select_agent_type(e: any) {
    this.agentTypeErrorDiv = false;
    setTimeout(() => {
      this.loadAgentAutocomplete();
    }, 3000);
    if (e == 'individual') {
      this.order_form.controls['Agent_fname'].patchValue(
        this.order_form.controls['fname'].value
      );
      this.order_form.controls['Agent_lname'].patchValue(
        this.order_form.controls['lname'].value
      );
      this.order_form.controls['Agent_company_name'].patchValue('');
      this.individual_agent = true;
      this.agent_type_individual = true;
      this.agentIsIndividual = true;
      this.agentIsCompany = false;
    } else if (e == 'company') {
      this.order_form.controls['Agent_fname'].patchValue('');
      this.order_form.controls['Agent_lname'].patchValue('');
      this.individual_agent = false;
      this.agent_type_individual = false;
      this.agentIsIndividual = false;
      this.agentIsCompany = true;
    }
  }

  set_use_existing_user_detail() {
    console.log('inside set user existing');
    this.order_form.controls['fname'].patchValue(this.user_detail[0].fname);
    console.log(
      'inside set user existing update',
      this.order_form.controls['fname'].value
    );

    this.order_form.controls['lname'].patchValue(this.user_detail[0].lname);
    this.order_form.controls['Contact_email'].patchValue(
      this.user_detail[0].email
    );
    this.order_form.controls['Contact_phone'].patchValue(
      this.user_detail[0].phone_number
    );
    this.order_form.controls['Contact_address'].patchValue(
      this.user_detail[0].street_address
    );
    this.order_form.controls['Contact_city'].patchValue(
      this.user_detail[0].city
    );
    this.order_form.controls['Contact_state'].patchValue(
      this.user_detail[0].tbl_state_id
    );
    this.order_form.controls['Contact_zip'].patchValue(
      this.user_detail[0].zip_code
    );
    this.order_form.controls['Contact_country'].patchValue(
      this.user_detail[0].country
    );
    this.order_form.controls['company_street'].patchValue(
      this.user_detail[0].street_address
    );
    this.order_form.controls['company_city'].patchValue(
      this.user_detail[0].city
    );
    this.order_form.controls['company_state'].patchValue(
      this.user_detail[0].tbl_state_id
    );
    this.order_form.controls['company_zip'].patchValue(
      this.user_detail[0].zip_code
    );

    this.order_form.controls['tax__fname'].patchValue(
      this.user_detail[0].fname
    );
    this.order_form.controls['tax__lname'].patchValue(
      this.user_detail[0].lname
    );
    this.order_form.controls['tax_street'].patchValue(
      this.user_detail[0].street_address
    );
    this.order_form.controls['tax_city'].patchValue(this.user_detail[0].city);
    this.order_form.controls['tax_state'].patchValue(
      this.user_detail[0].tbl_state_id
    );
    this.order_form.controls['tax_zip'].patchValue(
      this.user_detail[0].zip_code
    );
    console.log('inside set', this.order_form.value);
  }

  click_on_use_existing_user_detail(hint: any) {
    switch (hint) {
      case 'contact_person':
        // console.log(hint);
        this.use_existing_user_detail_contact_person =
          !this.use_existing_user_detail_contact_person;
        break;
      case 'mailing_address':
        this.use_existing_user_detail_mailing_address =
          !this.use_existing_user_detail_mailing_address;
        break;
      case 'agent_info':
        this.use_existing_user_detail_agent =
          !this.use_existing_user_detail_agent;
        break;
      case 'company_info':
        this.use_existing_user_detail_company =
          !this.use_existing_user_detail_company;
        break;
      case 'tax_info':
        this.use_existing_user_detail_tax = !this.use_existing_user_detail_tax;
        break;
      case 'physical_address':
        this.use_existing_user_detail_tax_address =
          !this.use_existing_user_detail_tax_address;
        break;
      case 'physical_address':
        this.use_existing_user_detail_card_holder =
          !this.use_existing_user_detail_card_holder;
        break;
    }

    if (
      hint == 'contact_person' &&
      this.use_existing_user_detail_contact_person == false
    ) {
      // this.use_existing_user_detail_contact_person = !this.use_existing_user_detail_contact_person;
      this.order_form.controls['fname'].patchValue('');
      this.order_form.controls['lname'].patchValue('');
      this.order_form.controls['Contact_email'].patchValue('');
      this.order_form.controls['Contact_phone'].patchValue('');
    } else if (
      hint == 'contact_person' &&
      this.use_existing_user_detail_contact_person == true
    ) {
      // this.use_existing_user_detail_contact_person = !this.use_existing_user_detail_contact_person;
      this.order_form.controls['fname'].patchValue(this.user_detail[0].fname);
      this.order_form.controls['lname'].patchValue(this.user_detail[0].lname);
      this.order_form.controls['Contact_email'].patchValue(
        this.user_detail[0].email
      );
      this.order_form.controls['Contact_phone'].patchValue(
        this.user_detail[0].phone_number
      );
    } else if (
      hint == 'mailing_address' &&
      this.use_existing_user_detail_mailing_address == true
    ) {
      this.order_form.controls['Contact_address'].patchValue(
        this.user_detail[0].street_address
      );
      this.order_form.controls['Contact_city'].patchValue(
        this.user_detail[0].city
      );
      this.order_form.controls['Contact_state'].patchValue(
        this.user_detail[0].tbl_state_id
      );
      this.order_form.controls['Contact_zip'].patchValue(
        this.user_detail[0].zip_code
      );
    } else if (
      hint == 'mailing_address' &&
      this.use_existing_user_detail_mailing_address == false
    ) {
      this.order_form.controls['Contact_address'].patchValue('');
      this.order_form.controls['Contact_city'].patchValue('');
      this.order_form.controls['Contact_state'].patchValue('');
      this.order_form.controls['Contact_zip'].patchValue('');
    } else if (
      hint == 'agent_info' &&
      this.use_existing_user_detail_agent == true
    ) {
      this.order_form.controls['Agent_fname'].patchValue(
        this.order_form.controls['fname'].value
      );
      this.order_form.controls['Agent_lname'].patchValue(
        this.order_form.controls['lname'].value
      );
      this.order_form.controls['Agent_address'].patchValue(
        this.order_form.controls['Contact_address'].value
      );
      this.order_form.controls['Agent_city'].patchValue(
        this.order_form.controls['Contact_city'].value
      );
      this.order_form.controls['Agent_state'].patchValue(
        this.order_form.controls['Contact_state'].value
      );
      this.order_form.controls['Agent_zip'].patchValue(
        this.order_form.controls['Contact_zip'].value
      );
    } else if (
      hint == 'agent_info' &&
      this.use_existing_user_detail_agent == false
    ) {
      this.order_form.controls['Agent_fname'].patchValue('');
      this.order_form.controls['Agent_lname'].patchValue('');
      this.order_form.controls['Agent_address'].patchValue('');
      this.order_form.controls['Agent_city'].patchValue('');
      this.order_form.controls['Agent_state'].patchValue('');
      this.order_form.controls['Agent_zip'].patchValue('');
    } else if (
      hint == 'company_info' &&
      this.use_existing_user_detail_company == true
    ) {
      this.order_form.controls['company_street'].patchValue(
        this.order_form.controls['Contact_address'].value
      );
      this.order_form.controls['company_city'].patchValue(
        this.order_form.controls['Contact_city'].value
      );
      this.order_form.controls['company_state'].patchValue(
        this.order_form.controls['Contact_state'].value
      );
      this.order_form.controls['company_zip'].patchValue(
        this.order_form.controls['Contact_zip'].value
      );
    } else if (
      hint == 'company_info' &&
      this.use_existing_user_detail_company == false
    ) {
      this.order_form.controls['company_street'].patchValue('');
      this.order_form.controls['company_city'].patchValue('');
      this.order_form.controls['company_state'].patchValue('');
      this.order_form.controls['company_zip'].patchValue('');
    } else if (
      hint == 'tax_info' &&
      this.use_existing_user_detail_tax == false
    ) {
      this.order_form.controls['tax__fname'].patchValue('');
      this.order_form.controls['tax__lname'].patchValue('');
    } else if (
      hint == 'tax_info' &&
      this.use_existing_user_detail_tax == true
    ) {
      this.order_form.controls['tax__fname'].patchValue(
        this.order_form.controls['fname'].value
      );
      this.order_form.controls['tax__lname'].patchValue(
        this.order_form.controls['lname'].value
      );
    } else if (
      hint == 'physical_address' &&
      this.use_existing_user_detail_tax_address == false
    ) {
      this.order_form.controls['tax_street'].patchValue('');
      this.order_form.controls['tax_city'].patchValue('');
      this.order_form.controls['tax_state'].patchValue('');
      this.order_form.controls['tax_zip'].patchValue('');
    } else if (
      hint == 'physical_address' &&
      this.use_existing_user_detail_tax_address == true
    ) {
      this.order_form.controls['tax_street'].patchValue(
        this.order_form.controls['Contact_address'].value
      );
      this.order_form.controls['tax_city'].patchValue(
        this.order_form.controls['Contact_city'].value
      );
      this.order_form.controls['tax_state'].patchValue(
        this.order_form.controls['Contact_state'].value
      );
      this.order_form.controls['tax_zip'].patchValue(
        this.order_form.controls['Contact_zip'].value
      );
    }


  }

  click_on_use_existing_members(i: any) {
    this.use_existing_user_detail_members =
      !this.use_existing_user_detail_members;

    if (this.use_existing_user_detail_members == true) {
      this.order_form.controls['company_members'].controls[i].patchValue({
        fname: this.order_form.controls['fname'].value,
        lname: this.order_form.controls['lname'].value,
        street: this.order_form.controls['Contact_address'].value,
        city: this.order_form.controls['Contact_city'].value,
        state: this.order_form.controls['Contact_state'].value,
        zip: this.order_form.controls['Contact_zip'].value,
      });
    } else if (this.use_existing_user_detail_members == false) {
      this.order_form.controls['company_members'].controls[i].patchValue({
        fname: '',
        lname: '',
        street: '',
        city: '',
        state: '',
        zip: '',
      });
    }
    // this.order_form.controls.company_members.controls['fname']='';
  }
  click_on_use_existing_managers(i: any) {
    this.use_existing_user_detail_managers =
      !this.use_existing_user_detail_managers;

    if (this.use_existing_user_detail_managers == true) {
      this.order_form.controls['company_managers'].controls[i].patchValue({
        fname: this.order_form.controls['fname'].value,
        lname: this.order_form.controls['lname'].value,
        street: this.order_form.controls['Contact_address'].value,
        city: this.order_form.controls['Contact_city'].value,
        state: this.order_form.controls['Contact_state'].value,
        zip: this.order_form.controls['Contact_zip'].value,
      });
    } else if (this.use_existing_user_detail_managers == false) {
      this.order_form.controls['company_managers'].controls[i].patchValue({
        fname: '',
        lname: '',
        street: '',
        city: '',
        state: '',
        zip: '',
      });
    }
    // this.order_form.controls.company_members.controls['fname']='';
  }

  initializePayment(amount: number) {
    let first_name: any = this.order_form.controls['fname'].value;
    let lname: any = this.order_form.controls['lname'].value;
    let capitalized_name = `${first_name.charAt(0).toUpperCase()}${first_name.slice(1)} ${lname.charAt(0).toUpperCase()}${lname.slice(1)}`;
    Swal.fire({
      title: `Thank you, ${capitalized_name}`,
      text: "Do you want to view live updates of you LLC?",
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#28a0a2',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Why not!'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("order_id");
        let id=localStorage.getItem('user_id');
        // window.location.href = 'https://themashr.com/client-dashboard/?userid=${id}'

        const userId = localStorage.getItem('user_id'); // Replace this with your actual userId or fetch it from your data source
        const destinationURL = `https://themashr.com/client-dashboard/#/?userid=${userId}`;
        // const destinationURL = `http://localhost:4200/#/?userid=${userId}`;
        window.location.href = destinationURL;
      }
      else {
        // window.location.reload();
      }
    })
  }

  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51M7fbpJ9xcOh7OslquBEjq0VeMpYOsP3ue7Okvs5CsL2k8EE3NUY6hG8FdsNUrOHcr9Zl87rFB5VA42mOlIMg4oH00d3NCEI13',
          locale: 'auto',
          token: function (stripeToken: any) {
            console.log(stripeToken);
          },
        });
      };
      window.document.body.appendChild(script);
    }
  }
  scrolltotop(el: HTMLElement) {
    el.scrollIntoView();
  }
  scroll(el: HTMLElement) {
    if (el) {
      return el.scrollIntoView();
    }
  }


  back() {
    if (this.isBankinAddon) {
      let arr: any[] = this.packageArray.filter(p => p.service_title === 'serviceMashrPayoneer');
      const index = this.addOnsArray.findIndex(i => i.service_title === arr[0].service_title)
      if (index === -1) {
        this.addOnsArray.push(arr[0])
      }
    }
    if (this.isEINinAddon) {
      let arr: any[] = this.packageArray.filter(p => p.service_title === 'serviceMashrEINwithoutSSN');
      const index = this.addOnsArray.findIndex(i => i.service_title === arr[0].service_title)
      if (index === -1) {
        this.addOnsArray.push(arr[0])
      }
    }
    if (this.isResellerinAddon) {
      let arr: any[] = this.packageArray.filter(p => p.service_title === 'serviceMashrResellerCertificate');
      const index = this.addOnsArray.findIndex(i => i.service_title === arr[0].service_title)
      if (index === -1) {
        this.addOnsArray.push(arr[0])
      }
    }
    if (this.isAmazoninAddon) {
      let arr: any[] = this.packageArray.filter(p => p.service_title === 'serviceMashrAmazon');
      const index = this.addOnsArray.findIndex(i => i.service_title === arr[0].service_title)
      if (index === -1) {
        this.addOnsArray.push(arr[0])
      }
    }
    this.order_form.get('front_Passport_picture')?.setValue(null);
    this.order_form.get('back_Passport_picture')?.setValue(null);
    this.order_form.get('front_cnic_picture')?.setValue(null);
    this.order_form.get('back_cnic_picture')?.setValue(null);
    this.order_form.patchValue({
      front_driving_lic_picture: null, back_driving_lic_picture: null, utility_bill_image: null,
      bank_statement_image: null
    })

    this.upgrade_btn = false;
    this.continue_btn = true;

    this.getUser();
    if (this.contact_form == true) {
      localStorage.removeItem('order_id');
      this.rout.navigate(['/start-registration'])
      return;
    }

    if (this.company_form == true) {
      this.company_form = false;
      this.contact_form = true;
      this.back_btn = false;
      this.bar = 10;
      this.step_1 = false;
      this.upgrade_btn = false;
      this.continue_btn = true;
      return;
    } else if (this.second_form == true) {
      this.second_form = false;
      this.company_form = true;
      this.bar = 20;
      this.step_2 = false;

      return;
    } else if (this.upgrade_service_pkg_form == true) {
      this.upgrade_service_pkg_form = false;
      this.second_form = true;
      this.bar = 40;
      this.step_3 = false;

      return;
    }
    else if (this.isUpgradePkgTaxForm == true) {
      if(this.package_Name!=='Platinum'){
      this.upgrade_service_pkg_form = true;
      this.upgrade_btn = true;
      this.continue_btn = false;
      this.isUpgradePkgTaxForm = false;
      } else  if(this.package_Name === 'Platinum'){
        this.second_form = true;
        this.upgrade_btn = false;
        this.continue_btn = true;
        this.isUpgradePkgTaxForm = false;
        this.upgrade_service_pkg_form=false;
        }
    }
    else if (this.addOnsForm == true) {
      this.addOnsForm = false;
      this.upgrade_service_pkg_form = true;
      this.isEINinAddon = false;
      this.isResellerinAddon = false;
      this.isBankinAddon = false;
      this.isAmazoninAddon = false;
      // this.getPackagesByCountry(this.order_form.controls.formation_Country.value);
      this.upgrade_btn = true;
      this.continue_btn = false;
    }
    else if (this.addOnsArrayForm == true) {
      this.addOnsArrayForm = false;
      this.addOnsForm = true;
      this.addOnsArray = [];
      this.isEINinAddon = false;
      this.isResellerinAddon = false;
      this.isBankinAddon = false;
      this.isAmazoninAddon = false;
      this.isTakeAddOns = false;
    }
    else if (this.review_form == true) {
      this.review_form = false;
      if(this.package_Name==='Platinum'){
        this.second_form=true;
        this.review_form=false;
      }
      if(this.package_Name !== 'Platinum'){
      this.addOnsForm = true;
        this.review_form=false;
      }
      // this.addOnsForm = true;
      this.bar = 60;
      this.step_4 = false;

      this.continue_btn = true;
      this.payment_btn = false;
      this.step_5 = false;

      return;
    } else if (this.billing_form == true) {
      this.billing_form = false;
      this.review_form = true;
      this.bar = 80;
      this.step_5 = false;

      return;
    }

  }
  onChangeCompanyStructure() {
    this.whenManagersAreEmpty = false;
    this.whenBothMembersAndManagersAreEmpty = false;
    this.whenMembersAreEmpty = false;
    switch (this.order_form.controls.companyStructure.value) {
      case 'Member Managed':
        this.add_members();
        break;
      case 'Both Managed':
        this.add_members();
        this.add_managers();
        break;
      case 'Manager Managed':
        this.add_managers();
        break;
    }
  }

  getBusinessAddressByStateId() {
    this.loading = true;
    let con = this.order_form.controls.formation_Country.value;

    if (con === 'uk') {
      let data = {
        tbl_country_id: con
      }
      this.addressSer.getBusinessAddressByCountryId(data).subscribe(res => {
        console.log('UK address', res)
        this.loading = false;
        this.all_address_by_state = [];
        if (res != 'datanotfound') {
          this.all_address_by_state = res;
          console.log(this.all_address_by_state, 'getaddressbyid in process form');
        } else {
          console.log(this.all_address_by_state, 'res')
        }
      })
    }
    else if (con === 'usa') {
      let data = {
        tbl_state_id: this.formation_state_id
      };
      console.log('getaddressbyid before', data)
      this.addressSer.getBusinessAddressByStateId(data).subscribe((res) => {
        this.loading = false;
        this.all_address_by_state = [];
        if (res != 'datanotfound') {
          this.all_address_by_state = res;
          console.log(this.all_address_by_state, 'getaddressbyid in process form');
        } else {
          console.log(this.all_address_by_state, 'res')
        }
      });
    }
  }

  skip() {
    this.isUpgradePkg = false;
    this.upgrade_service_pkg_form = false;
    this.tax_form = false;
    this.addOnsForm = true;
    this.continue_btn = true;
    this.upgrade_btn = false;
    console.log(
      'before splice in skip', this.push_services)
    let feeArray: any[] = this.get_all_services.filter(
      ser => ser.tbl_service_id == 5 || ser.tbl_service_id == 6
    );
    console.log('YYYYYYYYY', feeArray)
    let indexEIN = this.push_services.findIndex((ser) => ser.tbl_service_id == 5);
    let indexReseller = this.push_services.findIndex((ser) => ser.tbl_service_id == 6);

    if (indexEIN !== -1) {
      this.push_services.splice(indexEIN, 1)
    }
    if (indexReseller !== -1) {
      this.push_services.splice(indexReseller, 1)
    }
    console.log('After splice in skip', this.push_services)

  }
  selectAddOns() {
    this.addOnsForm = false;
  }

  calculateTotalBill() {
    this.Newtotal_bill = 0;
    let isEINwithSSNFeeFound = false;
    let isResellerFeeFound = false;
    let isBankFeeFound = false;
    let isAmazonFeeFound = false;
    let isBusinessAddressFeeFound = false;
    let isRegisteredAgentFeeFound = false;
    let isEINwithoutSSNFeeFound = false;
    console.log('All bills', this.allBills);

    // Dont add prices those services which are included in package
let inc:any[]=[];
if(this.selectedPkg[0].included_services.length>0){
  inc=this.selectedPkg[0].included_services;
  this.serviceIncludedInPackage=this.selectedPkg[0].included_services;
}
this.pkgIncludes = this.selectedPkg[0].pkg_includes.split(',')

console.log('included', inc);
    this.allBills.forEach(service => {
      switch (service.name) {
        case 'pkgFee':
          this.package_Fee = service.value;
          this.Newtotal_bill = this.Newtotal_bill + Number(service.value);
          break;
        case 'stateFee':
          this.state_Fee = service.value;
      this.Newtotal_bill = this.Newtotal_bill + Number(service.value);
          break;
        case 'businessAddressFee':
           const hasBusinessAddress= inc.find(obj => obj.service_title == 'serviceMashrBusinessAddress')
          if(hasBusinessAddress){
            this.agent_fee = 'includedInPackage';
            isBusinessAddressFeeFound = false;
          } else if(!hasBusinessAddress){
            this.bussiness_address_fee = service.value;
      this.Newtotal_bill = this.Newtotal_bill + Number(service.value);
            isBusinessAddressFeeFound = true;
          }
          this.address_fee = true;
          this.your_address = false;

          break;
        case 'registeredAgent':
          const hasRegisteredAgent= inc.find(obj => obj.service_title == 'serviceMashrRegisteredAgent')
          if(hasRegisteredAgent){
            this.agent_fee = 'includedInPackage';
          isRegisteredAgentFeeFound = false;
          } else if(!hasRegisteredAgent){
            this.agent_fee = service.value;
          isRegisteredAgentFeeFound = true;
      this.Newtotal_bill = this.Newtotal_bill + Number(service.value);
          }
          this.Agent_fee = true;
          this.isAgent_form = false;
          break;
        case 'EINwithoutSSNFee':
          const hasEINwithoutSSN= inc.find(obj => obj.service_title == 'serviceMashrEINwithoutSSN')
          if(hasEINwithoutSSN){
            this.without_ssn_fee = 'includedInPackage';
            isEINwithoutSSNFeeFound = false;
          } else if(!hasEINwithoutSSN){
            this.without_ssn_fee = service.value;
      this.Newtotal_bill = this.Newtotal_bill + Number(service.value);
            isEINwithoutSSNFeeFound = true;
          }
          this.ssn_div = false;
          this.EIN_div = true;
          this.without_EIN_form = true;
          this.EIN_card = true;
          this.with_ssn_fee = 1;
          isEINwithSSNFeeFound = false;
          break;
        case 'EINwithSSNFee':
          const hasEINwithSSN= inc.find(obj => obj.service_title == 'serviceMashrEINwithSSN')
          if(hasEINwithSSN){
            this.with_ssn_fee = 'includedInPackage';
            isEINwithSSNFeeFound = false;
          } else if(!hasEINwithSSN){
            this.with_ssn_fee = service.value;
      this.Newtotal_bill = this.Newtotal_bill + Number(service.value);
            isEINwithSSNFeeFound = true;
          }
          this.ssn_div = true;
          this.without_EIN_form = false;
          this.EIN_card = true;
          this.EIN_div = true;
          this.without_ssn_fee = 2;
          isEINwithoutSSNFeeFound = false;
          break;
        case 'resellerFee':
          const hasReseller= inc.find(obj => obj.service_title == 'serviceMashrResellerCertificate')
          if(hasReseller){
            this.reseller_fee = 'includedInPackage';
            isResellerFeeFound = false;
          } else if(!hasReseller){
            this.reseller_fee = service.value;
      this.Newtotal_bill = this.Newtotal_bill + Number(service.value);
            isResellerFeeFound = true;
          }
          this.Reseller_fee = true;
          this.isReseller_form = false;
          break;
        case 'bankFeePayoneer':
        case 'bankFeeWise':
          const hasPayoneer= inc.find(obj => obj.service_title == 'serviceMashrPayoneer')
          if(hasPayoneer){
            this.bank_fee = this.bank_fee + 0;
            isBankFeeFound = false;
          } else if(!hasPayoneer){
            this.bank_fee = this.bank_fee + Number(service.value);
      this.Newtotal_bill = this.Newtotal_bill + Number(service.value);
            isBankFeeFound = true;
          }
          this.bank_fee_amount = true;
          this.isBank_form = false;
          break;
        case 'amazonFee':
          const hasAmazon= inc.find(obj => obj.service_title == 'serviceMashrAmazon')
          if(hasAmazon){
            this.amazon_fee = 'includedInPackage';
            isAmazonFeeFound = false;
          } else if(!hasAmazon){
            this.amazon_fee = service.value;
      this.Newtotal_bill = this.Newtotal_bill + Number(service.value);
            isAmazonFeeFound = true;
          }
          this.Amazon_fee = true;
          this.isAmazon_form = false;
          break;
      }

      if (!isBusinessAddressFeeFound) {
        this.bussiness_address_fee = 0;
        this.address_fee = true;
        this.your_address = false;
      }
      if (!isRegisteredAgentFeeFound) {
        this.Agent_fee = false;
        this.agent_fee = 0;
        this.isAgent_form = true;
      }
      if (!isEINwithoutSSNFeeFound) {
        this.without_ssn_fee = 0;
        this.without_EIN_form = false;
      }
      if (!isEINwithSSNFeeFound) {
        this.without_EIN_form = true;
        this.with_ssn_fee = 0;
      }
      if (!isResellerFeeFound) {
        this.Reseller_fee = false;
        this.reseller_fee = 0;
        this.isReseller_form = true;
      }
      if (!isBankFeeFound) {
        this.bank_fee_amount = false;
        this.bank_fee = 0;
        this.isBank_form = true;
      }

      if (!isAmazonFeeFound) {
        this.Amazon_fee = false;
        this.amazon_fee = 0;
        this.isAmazon_form = true;
      }
    });
  }

  get entity() {
    return this.order_form.get('entity');
  }
  get country() {
    return this.order_form.get('formation_Country');
  }
  get state() {
    return this.order_form.get('formation_state');
  }
  get category() {
    return this.order_form.get('company_category');
  }

  get fname() {
    return this.order_form.get('fname');
  }
  get SSN_holder_fname() {
    return this.order_form.get('SSN_holder_fname');
  }
  get SSN_holder_lname() {
    return this.order_form.get('SSN_holder_lname');
  }
  get SSN_holder_city() {
    return this.order_form.get('SSN_holder_city');
  }
  get SSN_holder_address() {
    return this.order_form.get('SSN_holder_address');
  }
  get SSN_holder_DOB() {
    return this.order_form.get('SSN_holder_DOB');
  }
  get SSN_holder_state() {
    return this.order_form.get('SSN_holder_state');
  }
  get SSN_holder_zipcode() {
    return this.order_form.get('SSN_holder_zipcode');
  }
  get clientAddress_street() {
    return this.order_form.get('clientAddress_street');
  }
  get clientAddress_country() {
    return this.order_form.get('clientAddress_country');
  }
  get clientAddress_state() {
    return this.order_form.get('clientAddress_state');
  }
  get clientAddress_city() {
    return this.order_form.get('clientAddress_city');
  }
  get clientAddress_zipcode() {
    return this.order_form.get('clientAddress_zipcode');
  }
  get lname() {
    return this.order_form.get('lname');
  }
  get company_address() {
    return this.order_form.get('company_address');
  }
  get Contact_email() {
    return this.order_form.get('Contact_email');
  }
  get Contact_phone() {
    return this.order_form.get('Contact_phone');
  }
  get Contact_address() {
    return this.order_form.get('Contact_address');
  }
  get Contact_city() {
    return this.order_form.get('Contact_city');
  }
  get Contact_state() {
    return this.order_form.get('Contact_state');
  }
  get Contact_zip() {
    return this.order_form.get('Contact_zip');
  }
  get Agent_fname() {
    return this.order_form.get('Agent_fname');
  }
  get Agent_lname() {
    return this.order_form.get('Agent_lname');
  }
  get Agent_address() {
    return this.order_form.get('Agent_address');
  }
  get Agent_state() {
    return this.order_form.get('Agent_state');
  }

  get Agent_city() {
    return this.order_form.get('Agent_city');
  }
  get Agent_zip() {
    return this.order_form.get('Agent_zip');
  }
  get Contact_country() {
    return this.order_form.get('Contact_country');
  }
  get Agent_company_name() {
    return this.order_form.get('Agent_company_name');
  }
  get designator() {
    return this.order_form.get('designator');
  }
  get company_name_1() {
    return this.order_form.get('company_name_1');
  }
  get company_name_2() {
    return this.order_form.get('company_name_2');
  }
  get company_name_3() {
    return this.order_form.get('company_name_3');
  }
  get company_purpose() {
    return this.order_form.get('company_purpose');
  }

  get company_street() {
    return this.order_form.get('company_street');
  }
  get company_state() {
    return this.order_form.get('fname');
  }
  get company_city() {
    return this.order_form.get('fname');
  }
  get company_zip() {
    return this.order_form.get('fname');
  }
  get tax__fname() {
    return this.order_form.get('fname');
  }
  get tax__lname() {
    return this.order_form.get('tax__lname');
  }
  get tax_street() {
    return this.order_form.get('tax_street');
  }
  get tax_state() {
    return this.order_form.get('tax_state');
  }
  get tax_city() {
    return this.order_form.get('tax_city');
  }
  get tax_zip() {
    return this.order_form.get('tax_zip');
  }
  get SSN() {
    return this.order_form.get('SSN');
  }

  get filing_time() {
    return this.order_form.get('filing_time');
  }
  get Passport_picture() {
    return this.order_form.get('Passport_picture');
  }
  get company_name() {
    return this.order_form.get('company_name');
  }
  get street() {
    return this.order_form.get('street');
  }
  get city() {
    return this.order_form.get('city');
  }
  // get state() { return this.order_form.get('state') }
  get zip() {
    return this.order_form.get('zip');
  }
  get shares() {
    return this.order_form.get('shares');
  }

  get entityEndingPronunciation() {
    return this.order_form.get('entityEndingPronunciation');
  }

  getaddress() {
    let rr = this.order_form.controls.bussiness_address_duration.value;
    console.log('selected address', rr)
  }
  getBanksForOrderSummary() {
    let banks:any[]= this.push_services.filter(obj => obj.service_title == 'serviceMashrPayoneer'
      || obj.service_title == 'serviceMashrWise');
      // if(banks.forEach(p=>{
      //   p.service_title==='serviceMashrPayoneer'
      // }))

// let p=banks.findIndex(o=>o.service_title==='serviceMashrPayoneer')
// console.log('ppppp', p);
// if(p !== -1){
// this.want_payoneer=true;
// }
      return banks
  }
  getBusinessAddressForReviewForm() {
    return this.push_services.filter(obj => obj.service_title == 'serviceMashrBusinessAddress')
  }


  isResellerinPackage(){
    if(this.selectedPkg[0].included_services.length>0){
      this.serviceIncludedInPackage=this.selectedPkg[0].included_services;
    }
  const hasReseller= this.serviceIncludedInPackage.find(obj => obj.service_title == 'serviceMashrResellerCertificate')
return hasReseller;
  }
  isRegisterAgentinPackage(){
    if(this.selectedPkg[0].included_services.length>0){
      this.serviceIncludedInPackage=this.selectedPkg[0].included_services;
    }
    const has= this.serviceIncludedInPackage.find(obj => obj.service_title == 'serviceMashrRegisteredAgent')
  return has;
    }
    isEINinPackage(){
      if(this.selectedPkg[0].included_services.length>0){
        this.serviceIncludedInPackage=this.selectedPkg[0].included_services;
      }
      const has= this.serviceIncludedInPackage.find(obj => obj.service_title == 'serviceMashrEINwithoutSSN')
    return has;
      }
      isBusinessAddressinPackage(){
      //   if(this.selectedPkg[0].included_services.length>0){
      //     this.serviceIncludedInPackage=this.selectedPkg[0].included_services;
      //   }
      //   const has= this.serviceIncludedInPackage.find(obj => obj.service_title == 'serviceMashrBusinessAddress')
      return undefined;
        }
        isAmazoninPackage(){
          if(this.selectedPkg[0].included_services.length>0){
            this.serviceIncludedInPackage=this.selectedPkg[0].included_services;
          }
          const has= this.serviceIncludedInPackage.find(obj => obj.service_title == 'serviceMashrAmazon')
        return has;
          }
          isPayoneerinPackage(){
            if(this.selectedPkg[0].included_services.length>0){
              this.serviceIncludedInPackage=this.selectedPkg[0].included_services;
            }
            const has= this.serviceIncludedInPackage.find(obj => obj.service_title == 'serviceMashrPayoneer')
          return has;
            }
            isWiseinPackage(){
              if(this.selectedPkg[0].included_services.length>0){
                this.serviceIncludedInPackage=this.selectedPkg[0].included_services;
              }
              const has= this.serviceIncludedInPackage.find(obj => obj.service_title == 'serviceMashrWise')
            return has;
              }
              find_state_id(name: any) {
                let arr = [] = this.all_formation_state.filter(ser => ser.state_name === name)
                console.log(arr, 'state name and id =================');
                this.formation_state_id = arr[0].tbl_state_id;
                this.getPackagesByCountry(this.order_form.controls.formation_Country.value);
              }



              countryChange() {
                let n = this.order_form.controls.formation_Country.value;
                console.log('Country11', n)
                if (n === 'uk') {
                  this.order_form.controls.entity.patchValue('5');
                  this.order_form.controls.formation_state.patchValue('uk');
                  this.getPackagesByCountry(n);
                  let myArr: any[] = this.allentity.filter(o => o.entity_name === 'LTD')
                  console.log('myArry UK', myArr)
                  this.allentity = [];
                  this.allentity = myArr;
                  console.log('filtered entity after', this.allentity)
                } else if (n === 'usa') {
                  this.order_form.controls.entity.patchValue('');
                  this.order_form.controls.formation_state.patchValue('');
                  this.hideStatesDiv = false;
                  let data = {
                    country_name: n
                  }
                  this.getallentity();
                  this.otherSer.getStateByCountry(data).subscribe(res => {
                    console.log('states by usa', res)
                    let r = res;
                    this.all_formation_state = [];
                    this.all_formation_state = res;
                    this.filteredStates = this.all_formation_state;
                    console.log('state==========', this.filteredStates);
                    let myArr: any[] = this.allentity.filter(o => o.entity_name !== 'LTD')
                    console.log('myArr USA', myArr)
                    this.allentity = [];
                    this.allentity = myArr;
                    console.log('filtered entity', this.allentity)
                  })
                }
              }
}
