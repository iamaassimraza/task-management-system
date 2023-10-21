
import { Directive, Component, OnInit, HostListener, ViewChild, ChangeDetectorRef, Input, ElementRef } from '@angular/core';
import {
  FormBuilder, FormGroupDirective, FormGroup, FormArray, NgForm, Validators, FormControl,
  FormControlName, FormArrayName,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TodoService } from '../Apis/todo.service';
import { OtherService } from '../Apis/other.service';
import { EmployeeService } from '../Apis/employee.service';
import { OrderService } from '../Apis/order.service';
import { NgpImagePickerModule } from 'ngp-image-picker';
import { BusinessAddressService } from '../Apis/business-address.service';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import Swal from 'sweetalert2';
import { ErrorStateMatcher } from '@angular/material/core';

import { RegisteredAgentsService } from '../Apis/registered-agents.service';
import { BottomSheetforRejectionsComponent } from '../bottom-sheetfor-rejections/bottom-sheetfor-rejections.component';
import { ServiceDetailComponent } from '../service-detail/service-detail.component';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { UserService } from '../Apis/user.service';
declare var require: any
const FileSaver = require('file-saver');
/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})

export class TodoComponent {
  matcher = new MyErrorStateMatcher();
  // image variables
  loadingPassport1 = false;
	loadingPassport2 = false;
	loadingCNICFront = false;
	loadingCNICBack = false;
	loadingDriving1 = false;
	loadingDriving2 = false;
	loadingUtilityBills = false;
	loadingBankStatement = false;
  userid:any;
  img_div = false;
  img_div1 = false;
  img_div2 = false;
  img_div3 = false;
  img_div4 = false;
  img_div5 = false;
  img_div6 = false;
  img_div7 = false;
  icon_1 = true;
  icon_2 = true;
  icon_3 = true;
  icon_4 = true;
  icon_5 = true;
  icon_6 = true;
  icon_7 = true;
  icon_8 = true;
  fileName: any = '1';
  fileName1: any = '1';
  order_id: any = '';
  errorMsg = '';
  // end image variables
  selectedStatus = 'all';
  selectedManager = 'none';

  // Arrays
  allTODO: any[] = [];
  filteredOrders: any[] = [];
  allStatus: any[] = [];
  allBusinessAddress: any[] = [];
  orderServices: any[] = [];
  images: any[] = [];
  fileNames: string[] = [];
  companyNames: any[] = [];
  Documents: any[] = [];
  allAgents: any[] = [];
  // Variables
  assignerID: any;
  assignerName: any;
  p: number = 1;
  totallength: number = 0;
  hidepagination = true;
  imgBasePathForCompanyImages: string;
  imgBasePath: string;
  expandContent = false;
  type: any = '';
  hidepaginatoin = true;
  no_record = false;
  initial: any;
  display = 'none';
  showCompanyList = false;
  panelOpenState = false;
  panelOpenStateserviceMashrBankAccount = false;
  panelOpenStateserviceMashrResellerCertificate = false;
  panelOpenStateserviceMashrRegisteredAgent = false;
  panelOpenStateserviceMashrEINwithSSN = false;
  panelOpenStateserviceMashrBusinessAddress = false;
  panelOpenStateserviceMashrAmazon = false;
  orderID: any;
  activeFilter = false
  CFID: any;
  userDetail:any[]=[];
  constructor(public userSer:UserService, public dialog: MatDialog, private bottomSheet: MatBottomSheet, private ser: TodoService, private regAgentSer: RegisteredAgentsService, private businessAddressSer: BusinessAddressService, private fb: FormBuilder, private otherSer: OtherService, private orderSer: OrderService,
    private employeeSer: EmployeeService, private toast: ToastrService) {
  }

  myForm = new FormGroup({
    status: new FormControl(),
    service_name: new FormControl(),
    detail: new FormControl(),
    documents: this.fb.array([]),
    tbl_order_service_id: new FormControl(),
    tbl_order_id: new FormControl(''),
    empID: new FormControl(),
    email: new FormControl('', Validators.required),
    userName: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    ip: new FormControl(),
    meeting_link: new FormControl(),
    file: new FormControl('', []),
    fileSource: new FormControl('', []),
    businessAddress: new FormControl('', []),
    address_duration_id: new FormControl('', []),
    tbl_state_id: new FormControl('', []),
    company_final_name: new FormControl('', Validators.required),
    tbl_agent_id: new FormControl('', Validators.required),
    IsAgent: new FormControl(),
    agentType: new FormControl(),
    emailByManager: new FormControl('', Validators.required),
    passwordByManager: new FormControl('', Validators.required),
    front_Passport_picture: new FormControl(null),
    back_Passport_picture: new FormControl(null),
    front_cnic_picture: new FormControl(null),
    back_cnic_picture: new FormControl(null),
    front_driving_lic_picture: new FormControl(null),
    back_driving_lic_picture: new FormControl(null),
    utility_bill_image: new FormControl(null),
    bank_statement_image: new FormControl(''),
    pass_img_1: new FormControl(''),
    pass_img_2: new FormControl(''),
    cnic_1: new FormControl(''),
    cnic_2: new FormControl(''),
    driving_1: new FormControl(''),
    driving_2: new FormControl(''),
    utility_name: new FormControl(''),
    bank_statement: new FormControl(''),
    ein_for_individual_service: new FormControl(''),
    company_image_for_individual_service: new FormControl(''),
    useTheseCredentialsForAllServices: new FormControl('', Validators.required),
    purchasedBusinessAddress: new FormControl('', Validators.required)
  })



  onFileSelected_OrderServiceDocs(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.img_div = true;
      this.icon_1 = false
      console.log('ID before---------', this.myForm.controls.tbl_order_id.value);
      console.log('DATA', file);
    const  hint=this.myForm.controls.service_name.value;
      this.otherSer.image1(file, this.myForm.controls.tbl_order_id.value, hint).subscribe(res => {
        this.images.push(res);
        console.log('GERE---------', this.images);
      })
    }
  }
  onBlur() {
    this.activeFilter = !this.activeFilter;
  }
  ngOnInit(): void {
    var empID = this.otherSer.sessionStorage.retrieve('empId');
    this.getAllTodoOfEmployer(empID);
    this.getAllRegisterAgents();
    console.log('image', this.myForm.controls.pass_img_1.value);

  }
  openBottomSheet(id: any): void {
    let data1 = {
      tbl_order_service_id: id
    }
    this.orderSer.getOrderServiceRejectionsById(data1).subscribe(res => {
      console.log('REJECTIONS', res);
      if (res != 'fail') {
        this.orderSer.allRejections = res;
        console.log('All rejects updated', this.orderSer.allRejections)
        this.bottomSheet.open(BottomSheetforRejectionsComponent)
      }
      else if (res == 'fail') {
        this.bottomSheet.open(BottomSheetforRejectionsComponent)
        // return
      }
    })
  }
  searchByCFID(e: any) {
    const searchValue = e.target.value.toLowerCase();
    this.filteredOrders = this.allTODO.filter(order => order.order_services[0]?.customId.toLowerCase().includes(searchValue)
    );
  }
  onFocusIn() {
    this.showCompanyList = true
    console.log('focuses');
  }

  onFocusOut() {
    this.showCompanyList = false
    console.log('focus out');

  }

  onClickofCompany(c: any) {
    this.myForm.controls.company_final_name.patchValue(c);
    this.showCompanyList = false
    return
  }

  removeImage(index: any) {
    this.images.splice(index, 1);
  }
  getAllTodoOfEmployer(id: any) {
    let data = {
      tbl_employee_id: id
    }
    this.employeeSer.getAllTodoOfEmployer(data).subscribe(res => {
      console.log('Manager todo', res)
      if (res != "fail") {
        this.filteredOrders = [];
        this.allTODO = res;
        this.filteredOrders = this.allTODO;
        console.log('todo res', this.allTODO);
        console.log('before for each filetered todo', this.filteredOrders);
        this.myForm.patchValue({
          tbl_order_id: res[0].tbl_order_id,
          pass_img_1: res[0].order_services[0].passport_image_1,
          pass_img_2: res[0].order_services[0].passport_image_2,
          cnic_1: res[0].order_services[0].cnic_front_image,
          cnic_2: res[0].order_services[0].cnic_back_image,
          driving_1: res[0].order_services[0].driving_license_image_1,
          driving_2: res[0].order_services[0].driving_license_image_2,
          utility_name: res[0].order_services[0].utility_bill_image,
          bank_statement_image: res[0].order_services[0].bank_statement
        });
        this.companyNames = [];
        this.companyNames.push(res[0].order_services[0].company_name_1,
          res[0].order_services[0].company_name_2,
          res[0].order_services[0].company_name_3)
        console.log('filetered todo', this.filteredOrders);
    }
    })
  }
getRemainingDays(deadline_date1:any){
  const currentDate = new Date();
  const deadline_date = new Date(deadline_date1);
  currentDate.setHours(0, 0, 0, 0);
  deadline_date.setHours(0, 0, 0, 0);
  const timeDifference = deadline_date.getTime() - currentDate.getTime();
  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  if (daysDifference > 0 || daysDifference == 0) {
    if (daysDifference === 0) {
    return "Today";
    } else if (daysDifference === 1) {
      return "Tmrw";
    } else {
return daysDifference;
    }
} else{
  return daysDifference.toString();
}
}
  getTooltipServices(id: any): string {
    let services: any[];
    let names: any[] = [];
    const allorder = this.allTODO.filter(o => o.tbl_order_id === id)
    services = allorder[0].order_services;
    for (let i = 0; i < services.length; i++) {
      switch (services[i].service_title) {
        case 'serviceMashrBusinessAddress':
          names.push('Business Address');
          break;
        case 'serviceMashrRegisteredAgent':
          names.push('Registered Agent');
          break; case 'serviceMashrCompanyFormation':
          names.push('LLC Filing');
          break; case 'serviceMashrEINwithSSN':
          names.push('EIN With SSN');
          break; case 'serviceMashrEINwithoutSSN':
          names.push('EIN Without SSN');
          break; case 'serviceMashrPayoneer':
          names.push('Payoneer Bank');
          break; case 'serviceMashrAmazon':
          names.push('Amazon');
          break;
        case 'serviceMashrResellerCertificate':
          names.push('Reseller Certificate');
          break;
        case 'serviceMashrTaxFiling':
          names.push('Tax Filing');
          break; case 'serviceMashrAmendment':
          names.push('Amendment');
          break; case 'serviceMashrWise':
          names.push('Wise Bank');
          break;
      }
    }
    return names.join(', ');
  }
  getProgressBarBackground(progress: number): string {
    const filledColor = '#174994';
    const emptyColor = 'white';
    const background = `linear-gradient(to right, ${filledColor} ${progress.toString()}%, ${emptyColor} ${progress.toString()}%)`;
    return background;
  }

  getBusinessAddressByStateId(id: any, address_time_period: any) {
    let data = {
      tbl_state_id: id
    }
    console.log('DATA---', address_time_period, id);
    this.businessAddressSer.getBusinessAddressByStateId(data).subscribe(res => {
      console.log('Address', res);
      this.allBusinessAddress = [];
      let temArray: any[] = res;
      console.log('TEMP', temArray);
      this.allBusinessAddress = temArray.filter(tem => tem.address_time_period === address_time_period);
      console.log('All busniess Filtered', this.allBusinessAddress);

    })
  }

  submit() {
    console.log('formmmmm', this.myForm.value)
    if (this.myForm.controls.service_name.value === 'serviceMashrBusinessAddress' &&
      (this.myForm.controls.purchasedBusinessAddress.invalid
        || this.myForm.controls.email.invalid || this.myForm.controls.password.invalid)) {
      this.myForm.controls.purchasedBusinessAddress.markAsTouched();
      this.myForm.controls.email.markAsTouched();
      this.myForm.controls.password.markAsTouched();
      return
    }
    else if (this.myForm.controls.service_name.value === 'serviceMashrRegisteredAgent' &&
      (this.myForm.controls.tbl_agent_id.invalid
        || this.myForm.controls.email.invalid || this.myForm.controls.password.invalid)) {
      this.myForm.controls.tbl_agent_id.markAsTouched();
      this.myForm.controls.email.markAsTouched();
      this.myForm.controls.password.markAsTouched();
      return
    }
    else if (this.myForm.controls.service_name.value === 'serviceMashrCompanyFormation' &&
      (this.myForm.controls.company_final_name.invalid
        || this.myForm.controls.email.invalid || this.myForm.controls.password.invalid)) {
      this.myForm.controls.company_final_name.markAsTouched();
      this.myForm.controls.email.markAsTouched();
      this.myForm.controls.password.markAsTouched();
      return
    }
    else if (this.myForm.controls.service_name.value === 'serviceMashrPayoneer' &&
      (this.myForm.controls.email.invalid || this.myForm.controls.password.invalid)) {
      this.myForm.controls.email.markAsTouched();
      this.myForm.controls.password.markAsTouched();
      return
    }
    else if (this.myForm.controls.service_name.value === 'serviceMashrWise' &&
      (this.myForm.controls.email.invalid || this.myForm.controls.password.invalid)) {
      this.myForm.controls.email.markAsTouched();
      this.myForm.controls.password.markAsTouched();
      return
    }
    // else if (this.myForm.controls.service_name.value === 'serviceMashrEINwithSSN' &&
    //   (this.myForm.controls.email.invalid || this.myForm.controls.password.invalid)) {
    //   this.myForm.controls.email.markAsTouched();
    //   this.myForm.controls.password.markAsTouched();
    //   return
    // }
    // else if (this.myForm.controls.service_name.value === 'serviceMashrEINwithoutSSN' &&
    //   (this.myForm.controls.email.invalid || this.myForm.controls.password.invalid)) {
    //   this.myForm.controls.email.markAsTouched();
    //   this.myForm.controls.password.markAsTouched();
    //   return
    // }
    else if (this.myForm.controls.service_name.value === 'serviceMashrAmazon' &&
      (this.myForm.controls.password.invalid || this.myForm.controls.email.invalid)) {
      this.myForm.controls.password.markAsTouched();
      this.myForm.controls.userName.markAsTouched();
      return
    }
    else if (this.myForm.controls.service_name.value === 'serviceMashrResellerCertificate' &&
      (this.myForm.controls.password.invalid || this.myForm.controls.userName.invalid)) {
      this.myForm.controls.password.markAsTouched();
      this.myForm.controls.email.markAsTouched();
      return
    }


    let allDocs: any = '';
    console.log('Images', this.images);
    let len = this.images.length;
    len = len - 1;
    for (let i = 0; i < this.images.length; i++) {
      let comma = ',';
      if (i != len) {
        allDocs += this.images[i] + comma
      }
      else if (i == len) 
      {allDocs += this.images[i]}
    }
    console.log('Docs', allDocs);
    let data = {
      status: 'pending',
      service_name: this.myForm.controls.service_name.value,
      detail: this.myForm.controls.detail.value,
      documents: allDocs,
      tbl_order_service_id: this.myForm.controls.tbl_order_service_id.value,
      tbl_order_id: this.myForm.controls.tbl_order_id.value,
      username: this.myForm.controls.userName.value,
      password: this.myForm.controls.password.value,
      tbl_agent_id: this.myForm.controls.tbl_agent_id.value,
      company_final_name: this.myForm.controls.company_final_name.value,
      ip: this.myForm.controls.ip.value,
      meeting_link: this.myForm.controls.meeting_link.value,
      email: this.myForm.controls.email.value,
      purchasedBusinessAddress: this.myForm.controls.purchasedBusinessAddress.value,
    }
    console.log('RESPONSE before ', data)

    this.ser.updateOrderServiceById(data).subscribe(res => {
      console.log('RESPONSE ', res)
      if (res == "orderServiceUpdate") {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1500
        })
        window.location.reload();
      }
    })
  }
  edit(e: any, p: any) {
    console.log('e', e, 'p', p)
    if (p != null || p != '' || p != undefined) {
      this.myForm.controls.emailByManager.patchValue(e);
      this.myForm.controls.passwordByManager.patchValue(p);
    }
  }

  sortData(sort: Sort) {
    console.log(sort.active)
    this.filteredOrders.sort((a, b) => {
      const customIdA = a.order_services[0]?.customId || 0;
      const customIdB = b.order_services[0]?.customId || 0;
      let sortOrder = 1;

      if (sort.direction === 'desc') {
        sortOrder = -1;
      }

      if (customIdA < customIdB) {
        return -1 * sortOrder;
      } else if (customIdA > customIdB) {
        return 1 * sortOrder;
      } else {
        return 0;
      }
    });
  }
  addOperationEmailPassword(e: any, p: any, id: any) {
    console.log(e, p, id)
    if (p === null || p === '' || p === undefined) {
      let data = {
        emailByManager: this.myForm.controls.emailByManager.value,
        tbl_order_id: id,
        passwordByManager: this.myForm.controls.passwordByManager.value,
      }
      console.log('data e==null', data)
      this.orderSer.updateOrderById(data).subscribe(res => {
        console.log('Update order', res);
        if (res == 'success') {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Your work has been saved',
            showConfirmButton: false,
            timer: 1500
          })
          window.location.reload()
        }
        else {
          alert('Something went wrong! Pls try again.')
        }
      })
      return
    }
    else if (p != null || p != '' || p != undefined) {
      console.log('Email password', e, p)


      Swal.fire({
        title: 'Seems you already have created Email and password. Are you sure you want to Regenrate?',
        showDenyButton: true,
        confirmButtonText: 'Yes I want to do it.',
        denyButtonText: `Cancel`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          let data = {
            emailByManager: this.myForm.controls.emailByManager.value,
            tbl_order_id: id,
            passwordByManager: this.myForm.controls.passwordByManager.value,
          }
          console.log('data e!=null', data)

          this.orderSer.updateOrderById(data).subscribe(res => {
            console.log('Update order', res);
            if (res == 'success') {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Your work has been saved',
                showConfirmButton: false,
                timer: 1500
              })
              window.location.reload();
            }
            else {
              alert('Something went wrong! Pls try again.')
            }
          })
        } else if (result.isDenied) {
        }
      })
      return
    }
  }
  serviceSelected(id: any, oid: any) {
    this.myForm.controls.tbl_order_service_id.patchValue(id);
    this.myForm.controls.tbl_order_id.patchValue(oid);
    this.myForm.controls.emailByManager.setValidators([Validators.required, Validators.minLength(5)]);
    this.myForm.controls.passwordByManager.setValidators([Validators.required, Validators.minLength(2)]);
    this.myForm.controls.useTheseCredentialsForAllServices.setValidators(Validators.required);
  }

  updateOrderServiceCredentials() {

    this.errorMsg = '';
    let data = {
      email: this.myForm.controls.emailByManager.value,
      password: this.myForm.controls.passwordByManager.value,
      tbl_order_services: this.myForm.controls.tbl_order_service_id.value,
      tbl_order_id: this.myForm.controls.tbl_order_id.value,
      useTheseCredentialsForAllServices: this.myForm.controls.useTheseCredentialsForAllServices.value
    }
    console.log('addOperationEmailPasswordByService', data)
    this.orderSer.updateOrderServiceCredentials(data).subscribe(res => {
      console.log('Update order', res);
      if (res === "success") {
        // this.toast.success('Credentials Created Successfully');
        // window.location.reload();
      }
      else if (res === "fail") {
        alert('Something went wrong! Pls try again.')
      }
    })
  }


  openServiceDetailDialog(detail: any, docs: any, serName: any, customId:any) {
    this.otherSer.serviceDetail = detail;
    this.otherSer.serviceDocs = docs;
    this.otherSer.serviceName = serName;
    this.otherSer.customId = customId;


    // setTimeout(() => {

    // }, 2000);
    console.log(`Dialog result:`, this.otherSer.serviceDetail);

    const dialogRef = this.dialog.open(ServiceDetailComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  onServiceSelect(tbl_order_id: any, tbl_order_service_id: any
    , serviceTtile: string, tbl_state_id: any, address_duration_id: any, address_time_period: any, customId: any) {
    let myArray: any[] = this.filteredOrders.filter(o => o.tbl_order_id === tbl_order_id);
    var arr: any[] = [];
    for (let i = 0; i < myArray[0].order_services.length; i++) {
      arr.push(myArray[0].order_services[i])
    }
    console.log('arr', arr)
    let myArray1: any[] = arr.filter(o => o.tbl_order_service_id === tbl_order_service_id);
    console.log('RES----!!!!!!!!!!!!', myArray1);
    this.myForm.patchValue({
      tbl_order_id: tbl_order_id, tbl_order_service_id: tbl_order_service_id,
      service_name: myArray1[0].service_title, tbl_state_id: myArray1[0].tbl_state_id, address_duration_id: myArray1[0].address_duration_id,
      detail: myArray1[0].detail, userName: myArray1[0].username, company_final_name: myArray1[0].company_final_name, tbl_agent_id: myArray1[0].tbl_agent_id,
      email: myArray1[0].email, password: myArray1[0].password, ip: myArray1[0].ip, meeting_link: myArray1[0].meeting_link, purchasedBusinessAddress: myArray1[0].purchasedBusinessAddress
    })
    // this.images = myArray1[0].documents;
    console.log('Form', this.myForm.value);
    this.myForm.patchValue({
      emailByManager: 'empty',
      passwordByManager: 'empty',
      useTheseCredentialsForAllServices: 'no'
    })
    this.CFID = customId;
    this.imgBasePathForCompanyImages = this.otherSer.imgUrl + 'companyDocuments/' + this.CFID
    console.log('My formmmmm', this.myForm.controls);
  }
  getAllRegisterAgents() {
    this.regAgentSer.getAllRegisterAgents().subscribe(res => {
      console.log('RES Registered Agentssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss', res);
      this.allAgents = res;
    })
  }

  expand(id: any) {
    let myarr: any[] = this.allTODO.filter(o => o.order_services)
    this.orderServices = myarr[0].order_services;
    let uid=this.orderServices[0].tbl_user_id;
    this.userid=uid;
		if(uid){
			this.getuserbyid(uid);
		}
    console.log('order services', this.orderServices);
    this.Documents.push();
    return this.orderServices;
  }


  filterOrders(val: any) {
    if (val == 'all') {
      this.filteredOrders = this.allTODO;
      return
    }
    return this.filteredOrders = this.allTODO.filter(order => order.task_status === val);
  }



  // image upload code
  // upload_docs(event: any, id: any, hint: any) {
  //   const file: File = event.target.files[0];
  //   console.log('Upload before', file, id, hint)
  //   if (file) {
  //     this.otherSer
  //       .image1(file, id, hint)
  //       .subscribe((res) => {
  //         console.log('GERE---------11', res);
  //         switch (hint) {
  //           case 'passport_images_1':
  //             this.myForm.controls.pass_img_1.patchValue(res);
  //             break;
  //           case 'passport_images_2':
  //             this.myForm.controls.pass_img_2.patchValue(res);
  //             break;
  //           case 'cnic_front_images':
  //             this.myForm.controls.cnic_1.patchValue(res);
  //             break;
  //           case 'cnic_back_images':
  //             this.myForm.controls.cnic_2.patchValue(res);
  //             break;
  //           case 'driving_license_images_1':
  //             this.myForm.controls.driving_1.patchValue(res);
  //             break;
  //           case 'driving_license_images_2':
  //             this.myForm.controls.driving_2.patchValue(res);
  //             break;
  //           case 'utility_bills':
  //             this.myForm.controls.utility_name.patchValue(res);
  //             break;
  //           case 'bank_statement':
  //             this.myForm.controls.bank_statement.patchValue(res);
  //             this.myForm.controls.bank_statement_image.patchValue(res);
  //             break;
  //           case 'ein_for_individual_service':
  //             this.myForm.controls.ein_for_individual_service.patchValue(res);
  //             break;
  //           case 'company_image_for_individual_service':
  //             this.myForm.controls.company_image_for_individual_service.patchValue(res);
  //             break;
  //         }
  //         this.submit1(id);
  //       });


  //   }
  // }
  upload_docs(event: any,  hint: any) {
		console.log('EVENT', event)
		const file: File = event.target.files[0];
		if (file) {
			// this.loading=true;
			// this.imageLoading = true
			switch (hint) {
				case 'passport_images_1':
					this.loadingPassport1 = true;
					break;
				case 'passport_images_2':
					this.loadingPassport2 = true;
					break;
				case 'cnic_front_images':
					this.loadingCNICFront = true;
					break;
				case 'cnic_back_images':
					this.loadingCNICBack = true;
					break;
				case 'driving_license_images_1':
					this.loadingDriving1 = true;
					break;
				case 'driving_license_images_2':
					this.loadingDriving2 = true;
					break;
				case 'utility_bills':
					this.loadingUtilityBills = true;
					break;
				case 'bank_statement':
					this.loadingBankStatement = true;
					break;
			}
			this.otherSer
				.image(file, this.userid, hint)
				.subscribe((res) => {
					// this.imageLoading = false
					console.log('GERE---------11', res);
					if(res !='Fail'){
							switch (hint) {
						case 'passport_images_1':
							this.loadingPassport1 = false;
						this.myForm.controls.pass_img_1.patchValue(res + '?t=' + Date.now());
							break;
						case 'passport_images_2':
							this.myForm.controls.pass_img_2.patchValue(res + '?t=' + Date.now());
							this.loadingPassport2 = false;
							break;
						case 'cnic_front_images':
							this.myForm.controls.cnic_1.patchValue(res + '?t=' + Date.now());
							this.loadingCNICFront = false;
							break;
						case 'cnic_back_images':
							this.myForm.controls.cnic_2.patchValue(res + '?t=' + Date.now());
							this.loadingCNICBack = false;
							break;
						case 'driving_license_images_1':
							this.myForm.controls.driving_1.patchValue(res + '?t=' + Date.now());
							this.loadingDriving1 = false;
							break;
						case 'driving_license_images_2':
							this.myForm.controls.driving_2.patchValue(res + '?t=' + Date.now());
							this.loadingDriving2 = false;
							break;
						case 'utility_bills':
							this.myForm.controls.utility_name.patchValue(res + '?t=' + Date.now());
							this.loadingUtilityBills = false;
							break;
						case 'bank_statement':
							this.myForm.controls.bank_statement.patchValue(res + '?t=' + Date.now());
							this.loadingBankStatement = false;
							break;
					}
					this.updateClientImages(this.userid);
					}
				
				});


		}
	}
  updateClientImages(id: any) {
		let data = {
			passport_image_1: this.myForm.controls['pass_img_1'].value,
			passport_image_2: this.myForm.controls['pass_img_2'].value,
			cnic_front_image: this.myForm.controls['cnic_1'].value,
			cnic_back_image: this.myForm.controls['cnic_2'].value,
			driving_license_image_1: this.myForm.controls['driving_1'].value,
			driving_license_image_2: this.myForm.controls['driving_2'].value,
			utility_bill_image: this.myForm.controls['utility_name'].value,
			bank_statement_image: this.myForm.controls['bank_statement'].value,
			tbl_user_id: id
		}
		console.log('Before updateClientImages', data)
		this.userSer.updateClientImages(data).subscribe(res => {
			console.log(res, 'update images')
			if (res == 'success') {
console.log('form', this.myForm.value);
			}
			else {
				this.toast.error('Something went wrong. Pls try again.');
				return
			}
		})
	}
  downloadPdf(pdfUrl: string, pdfName: string) {
    let path = this.imgBasePath + pdfUrl + pdfName;
    console.log('P', path, 'Name', pdfName);
    FileSaver.saveAs(path, pdfName);
  }

  submit1(id: any) {
    let data = {
      passport_image_1: this.myForm.controls['pass_img_1'].value,
      passport_image_2: this.myForm.controls['pass_img_2'].value,
      cnic_front_image: this.myForm.controls['cnic_1'].value,
      cnic_back_image: this.myForm.controls['cnic_2'].value,
      driving_license_image_1: this.myForm.controls['driving_1'].value,
      driving_license_image_2: this.myForm.controls['driving_2'].value,
      utility_bill_image: this.myForm.controls['utility_name'].value,
      bank_statement_image: this.myForm.controls['bank_statement'].value,
      tbl_order_id: id
    }
    console.log('Before My data', data)
    this.orderSer.updateOrderImages(data).subscribe(res => {
      console.log(res, 'update images')
      if (res == 'success') {
        console.log(this.myForm.value)
        // var empID = this.otherSer.sessionStorage.retrieve('empId');
        // this.getAllTodoOfEmployer(empID);
      }
      else {
        this.toast.error('Something went wrong. Pls try again.');
        return
      }
    })
  }
  get emailByManager() {
    return this.myForm.get('emailByManager');
  }
  get passwordByManager() {
    return this.myForm.get('passwordByManager');
  }
  get password() {
    return this.myForm.get('password');
  }
  get email() {
    return this.myForm.get('email');
  }
  get userName() {
    return this.myForm.get('userName');
  }
  get useTheseCredentialsForAllServices() {
    return this.myForm.get('useTheseCredentialsForAllServices');
  }


  getuserbyid(id:number) {
		if (id) {
		this.imgBasePath=this.otherSer.imgUrl+'clientPersonalDocuments/client_id_'+id;
		  let data = {
			user_id: id
		  }
		  this.userSer.getuserbyid(data).subscribe(res => {
			console.log('user by id111', res)
			
			if (res != 'datanotfound') {
        if(res[0].passport_image_1){
					this.myForm.controls.pass_img_1.patchValue(res[0].passport_image_1 + '?t=' + Date.now())
				}
				if(res[0].passport_image_2){
					this.myForm.controls.pass_img_2.patchValue(res[0].passport_image_2 + '?t=' + Date.now())
				}
				if(res[0].cnic_front_image){
					this.myForm.controls.cnic_1.patchValue(res[0].cnic_front_image + '?t=' + Date.now())
				}
				if(res[0].cnic_back_image){
					this.myForm.controls.cnic_2.patchValue(res[0].cnic_back_image + '?t=' + Date.now())
				}
				if(res[0].driving_license_image_1){
					this.myForm.controls.driving_1.patchValue(res[0].driving_license_image_1 + '?t=' + Date.now())
				}
				if(res[0].driving_license_image_2){
					this.myForm.controls.driving_2.patchValue(res[0].driving_license_image_2 + '?t=' + Date.now())
				}
				if(res[0].utility_bill_image){
					this.myForm.controls.utility_name.patchValue(res[0].utility_bill_image + '?t=' + Date.now())
				}
				if(res[0].bank_statement){
					this.myForm.controls.bank_statement.patchValue(res[0].bank_statement + '?t=' + Date.now())
				}
			  this.userDetail=res;
			}
			 else if(res == 'datanotfound'){
		 this.toast.error('Your Session is expired.');
			}
		  })
		} else if(!id) {
	alert('Somethng Wrong because system is under development. Pls logout first then login again.')
	return
		}
	  }

}
