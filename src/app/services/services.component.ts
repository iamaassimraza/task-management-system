import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { OrderService } from '../Apis/order.service';
import { OtherService } from '../Apis/other.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ToastrService } from 'ngx-toastr';
import { TodoService } from '../Apis/todo.service';
import { EmployeeService } from '../Apis/employee.service';
import Swal from 'sweetalert2';
import { ServicesService } from '../Apis/services.service';
import { MatTableModule } from '@angular/material/table';
import { from } from 'rxjs';
import { ErrorStateMatcher } from '@angular/material/core';
import { ServiceCategoriesService } from '../Apis/service-categories.service';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class ServicesComponent implements OnInit {
  matcher = new MyErrorStateMatcher();
  addCategoryFormOpened = false;
  addServiceFormOpened = false;
  addEditFormOpened = false;
  loading = true;
  // Arrays
  allOrders: any[] = [];
  filteredOrders: any[] = [];
  allEmployee: any[] = [];
  allStatus: any[] = [];
  allServices: any[] = [];
  filteredServices: any[] = [];
  allCategories: any[] = [];
  selectedCategories: any[] = [];
  tablelist: any[]= [1,2,3,4,5,6,7,];
  // Variables
  empID: any;
  btn: any = 'Save';
  assignerID: any
  assignerName: any;
  orderID: any;
  p: number = 1;
  totallength: number = 0;
  hidepagination = true;
  imgBasePath: string;
  expandContent = false;
  type: any = '';
  no_record = false;
  initial: any;
  display = 'none';
  panelOpenState = false;
  invalidCategories = false;
  serviceFormTitle = '';
  constructor(
    private ser: ServicesService,
    private categorySer: ServiceCategoriesService,
    private ServiceSer: ServicesService,
    private otherSer: OtherService,
    private toast: ToastrService,) {
    this.imgBasePath = this.otherSer.imgUrl;
  }
  addServiceForm = new FormGroup(
    {
      service_title: new FormControl('', [Validators.required]),
      service_detail: new FormControl('', [Validators.required]),
      service_fee: new FormControl('', [Validators.required]),
      business_days: new FormControl('', [Validators.required]),
      service_status: new FormControl(''),
      tbl_service_id: new FormControl(''),
      selectAllCats: new FormControl('')
    }
  )
  addCategoryForm = new FormGroup({
    categoryName: new FormControl('', Validators.required),
    catergoryImage: new FormControl('')
  })
  ngOnInit(): void {
    this.getAllServices();
    this.allServicesByCategory();
    this.allCategoriesOfServices();




  }
  getAllServices() {
    this.loading = true;
    this.ser.getAllServices().subscribe(res => {
      this.loading=false;
      console.log('Order', res);
      this.allServices = res;
      this.filteredServices = res;
    })
  }

  filterServices(val: any) {
    if (val == 'all') {
      this.filteredServices = this.allServices;
      return;
    }
    return this.filteredServices = this.allServices.filter(service => service.service_status === val);
  }
  edit(id: any) {
    this.addServiceFormOpened = true;
    this.serviceFormTitle = 'Update';
    console.log(id)
    this.btn = 'Update';
    let data = {
      tbl_service_id: id
    }
    console.log(data)
    this.loading = true;
    this.ser.getServiceById(data).subscribe(res => {
      this.loading=false;
      console.log('getServiceById', res);
      this.addServiceForm.patchValue({
        service_title: res[0].service_title,
        service_detail: res[0].service_detail,
        service_fee: res[0].service_fee,
        business_days: res[0].business_days,
        service_status: res[0].service_status,
        tbl_service_id: res[0].tbl_service_id
      })
      let serviceCats: any[] = res[0].categories;
      serviceCats.forEach(elem => {
        this.selectedCategories.push(elem.tbl_categoryId);
      })
    })
  }

  submit(e: any) {
    console.log('My form inside submit', this.addServiceForm.value)
    if (this.addServiceForm.invalid) {
      this.addServiceForm.markAllAsTouched();
      this.toast.error('Please Fill All Information');
      return
    }
    let data = {
      service_title: e.service_title,
      service_detail: e.service_detail,
      service_fee: e.service_fee,
      business_days: e.business_days,
      tbl_service_id: e.tbl_service_id,
      service_status: e.service_status
    }
    if (this.btn == 'Update') {
      this.loading = true;
      this.ser.updateServiceById(data).subscribe(res => {
        this.loading=false;
        console.log(res);
        if (res == 'serviceUpdate') {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Your work has been saved',
            showConfirmButton: false,
            timer: 1500
          })
          this.getAllServices()
        }
        else {
          this.toast.error('No Changes Are Saved');
        }
      })
    }
  }


  getClassOf(val: any) {
    if (val == 'active') {
      return 'label label-success';
    } else if (val == 'blocked') {
      return 'label label-danger';
    }
    else {
      return 'label label-info'
    }
  }
  actions(e: any, oID: number) {
    let val = e.target.value
    console.log('VAL-----', val)
    let val1 = oID;
    console.log('VAL1-----', val1)

    if (val == 'active') {
      let data = {
        tbl_service_id: oID,
        service_status: e.target.value
      }
      console.log(data, "data here");
      this.loading = true;
      this.ser.updateServiceStatusById(data).subscribe(res => {
        this.loading=false;
        console.log(res, "response here")
        if (res == 'serviceStatusUpdate') {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Your work has been saved',
            showConfirmButton: false,
            timer: 1500
          })
          this.getAllServices()
        }
        else {
          this.toast.error('No Changes Are Saved');
        }

      })

    }
    else if (val == 'blocked') {
      let data = {
        tbl_service_id: oID,
        service_status: e.target.value
      }
      console.log(data, "data here");
      this.loading = true;
      this.ser.updateServiceStatusById(data).subscribe(res => {
        this.loading=false;
        console.log(res, "response here")
        if (res == 'serviceStatusUpdate') {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Your work has been saved',
            showConfirmButton: false,
            timer: 1500
          })
          this.getAllServices()
        }
        else {
          this.toast.error('No Changes Are Saved');
        }

      })

    }
  }

  addChackBox(id: any) {
    if (id == 'all') {
      console.log(this.addServiceForm.controls.selectAllCats.value);
      if (this.addServiceForm.controls.selectAllCats.value) {
        this.selectedCategories = [];
        console.log(this.selectedCategories, 'selected cats');

        return
      }
      else if (!this.addServiceForm.controls.selectAllCats.value) {
        this.selectedCategories = [];
        this.allCategories.forEach(element => {
          this.selectedCategories.push(element.categoryID);
        });
        console.log(this.selectedCategories, 'selected cats');
        return
      }
    }
    let index = this.selectedCategories.findIndex(c => c == id)
    if (index === -1) {
      this.selectedCategories.push(id);
    } else if (index !== -1) {
      this.selectedCategories = this.selectedCategories.filter(c => c != id)
    }
    console.log('selected cats', this.selectedCategories);
    this.isCategorySelected(id);
  }

  isCategorySelected(categoryID: number): boolean {
    return this.selectedCategories.includes(categoryID);
  }
  readonlyIfServicesNameExistOnPortal(){
if(this.addServiceForm.controls.service_title.value==='serviceMashrBusinessAddress'
|| this.addServiceForm.controls.service_title.value==='serviceMashrRegisteredAgent'
|| this.addServiceForm.controls.service_title.value==='serviceMashrCompanyFormation'
|| this.addServiceForm.controls.service_title.value==='serviceMashrEINwithSSN'
|| this.addServiceForm.controls.service_title.value==='serviceMashrEINwithoutSSN'
|| this.addServiceForm.controls.service_title.value==='serviceMashrResellerCertificate'
|| this.addServiceForm.controls.service_title.value==='serviceMashrBankAccount'
|| this.addServiceForm.controls.service_title.value==='serviceMashrAmazon'
|| this.addServiceForm.controls.service_title.value==='serviceMashrTaxFiling'
|| this.addServiceForm.controls.service_title.value==='serviceMashrAmendment'
|| this.addServiceForm.controls.service_title.value==='serviceMashrPayoneer'
|| this.addServiceForm.controls.service_title.value==='serviceMashrWise'
)
{
  return true
}else{
  return false
}
  }
  addServiceForClientDashboard() {
    let e = this.addServiceForm.controls;
    if (e.service_title.invalid || e.business_days.invalid || e.service_fee.invalid || e.service_detail.invalid) {
      return
    }
    if (this.selectedCategories.length == 0) {
      this.invalidCategories = true;
      return
    }
if(this.btn==='Save'){
      let pretextForServiceName = 'serviceMashr';
    pretextForServiceName = pretextForServiceName + this.addServiceForm.controls.service_title.value
    let data = {
      service_title: pretextForServiceName,
      service_fee: e.service_fee.value,
      service_detail: this.addServiceForm.get('service_detail')?.value,
      business_days: e.business_days.value,
      service_image:'addOns',
      categories: this.selectedCategories
    }
    this.loading = true;
    this.ServiceSer.addServiceForClientDashboard(data).subscribe(res => {
      this.loading=false;
      console.log('addServiceForClientDashboard res', res);
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
        alert('Somthing went worng! Pls check your internet connection and try again.');
      }
    })
}
else if(this.btn==='Update'){
  let data = {
    service_title: e.service_title.value,
    service_detail: e.service_detail.value,
    service_fee: e.service_fee.value,
    business_days: e.business_days.value,
    tbl_service_id: e.tbl_service_id.value,
    service_status: e.service_status.value,
    categories: this.selectedCategories
  }
  if (this.btn == 'Update') {
    console.log('before update',data);

    this.loading = true;
    this.ser.updateServiceById(data).subscribe(res => {
      this.loading=false;
      if (res == 'serviceUpdate') {
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
        this.toast.error('No Changes Are Saved');
      }
    })
  }
}
  }

  saveCategory() {
    if (this.addCategoryForm.invalid) {
      return
    }
    let data = {
      categoryName: this.addCategoryForm.controls.categoryName.value
    }
    console.log('data', data);
    this.loading = true;
    this.categorySer.addCategoriesOfServices(data).subscribe(res => {
      this.loading=false;
      console.log(res);
      if (res == 'success') {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1500
        })
        this.addCategoryFormOpened = false;
        this.allCategoriesOfServices();
      }
    })
  }
  allCategoriesOfServices() {
    this.loading = true;
    this.categorySer.allCategoriesOfServices().subscribe(res => {
      this.loading=false;
      console.log('all cats', res);
      if (res != 'datanotfound') {
        this.allCategories = res
      }
    })
  }
  allServicesByCategory() {
    this.categorySer.allServicesByCategory().subscribe(res => {
      console.log('allServicesByCategory res', res);
      this.allServices = res;
    })
  }
  add_category() {
    this.addCategoryFormOpened = !this.addCategoryFormOpened;
    this.addServiceFormOpened = false;
  }
  add_service() {
    this.addServiceFormOpened = !this.addServiceFormOpened;
    this.addCategoryFormOpened = false;
    this.serviceFormTitle = 'Add';
    this.btn='Save';
    this.selectedCategories=[];
    this.addServiceForm.setValue({
      service_title:'',
      service_detail:'',
      service_fee:'',
      business_days:'',
      service_status:'',
      tbl_service_id:'',
      selectAllCats:''
    });
  }
  get service_title() {
    return this.addServiceForm.get('service_title');
  }
  get service_fee() {
    return this.addServiceForm.get('service_fee');
  }
  get service_detail() {
    return this.addServiceForm.get('service_detail');
  }
  get business_days() {
    return this.addServiceForm.get('business_days');
  }
  get categoryName() {
    return this.addCategoryForm.get('categoryName');
  }


}
