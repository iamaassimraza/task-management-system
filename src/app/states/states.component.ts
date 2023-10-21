import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../Apis/order.service';
import { OtherService } from '../Apis/other.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ToastrService } from 'ngx-toastr';
import { TodoService } from '../Apis/todo.service';
import { EmployeeService } from '../Apis/employee.service';
import { map, startWith } from 'rxjs';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-states',
  templateUrl: './states.component.html',
  styleUrls: ['./states.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class StatesComponent implements OnInit {
// Arrays
allOrders: any[] = [];
filteredOrders: any[] = [];
allEmployee: any[] = [];
allStatus: any[] = [];
allStates: any[] = [];
allServices: any[] = [];
filteredServices: any[] = [];
tablelist: any[]= [1,2,3,4,5,6,7,8.9,10,11,12];

// Variables
empID: any;
btn: any = 'Submit';
assignerID: any
assignerName: any;
orderID: any;
p: number = 1;
totallength: number = 0;
hidepagination = true;
loading = true;
imgBasePath: string;
expandContent = false;
type: any = '';
hidepaginatoin = true;
no_record = false;
initial: any;
display = 'none';
filteredStates: any;
find_state_id: any;
activeFilter = false
constructor( private otherSer: OtherService, private orderSer: OrderService, private employeeSer: EmployeeService, private toast: ToastrService,private elementRef: ElementRef) {
  this.imgBasePath = this.otherSer.imgUrl;
}

onBlur(){
  this.activeFilter = !this.activeFilter;
}

stateForm = new FormGroup(
  {
    state_name: new FormControl(null, [Validators.required]),
    state_code: new FormControl(null, [Validators.required]),
    state_fee: new FormControl(null, [Validators.required]),
    state_business_days: new FormControl(null, [Validators.required]),
    tbl_state_id: new FormControl(null)
  }
)
myForm = new FormGroup({
  tbl_state_id: new FormControl('', [Validators.required])
});

ngOnInit(): void {
  this.getAllStates();
  this.filteredStates = this.myForm.controls[
    'tbl_state_id'
  ].valueChanges.pipe(
    startWith(''),
    map((value) => this._filterStates(value || ''))
  );


}
searchAddress(e: any) {
  const searchValue = e.target.value.toLowerCase();
  this.filteredStates = this.allStates.filter(
    (address) => address.full_address_id.toLowerCase().includes(searchValue)
  );
}

private _filterStates(value: any): any[] {
  const filterValue = value.toLowerCase();
  return this.allStates.filter((state) =>
    state.state_name.toLowerCase().includes(filterValue)
  );
}
onSubmit(){

}

getState(item: any) {
  this.find_state_id = this.allStates.filter(
    (state) => state.state_name === item
  );
  console.log('ss', this.find_state_id);
}
getAllStates() {
  this.loading = true;
  this.otherSer.getAllStates().subscribe(res => {
    this.loading = false;
    console.log('Order', res);
    this.allStates = res;
  })
}

filterServices(val: any) {
  if (val == 'all') {
    this.filteredServices = this.allServices;
    return;
  }
 let filter_value = this.filteredServices = this.allServices.filter(service => service.service_status === val);
 console.log(filter_value, 'value hereeee');

 return filter_value;

}
edit(id: any) {
  console.log(id, 'id hereeeeeee')

  this.btn = 'Update';
  let data = {
    tbl_state_id: id
  }
  console.log(data,"id here")
  this.loading = true;
  this.otherSer.getStateById(data).subscribe(res => {
    this.loading = false;
    console.log(res);
    this.stateForm.patchValue({
      state_name: res[0].state_name,
      state_code: res[0].state_code,
      state_fee: res[0].state_fee,
      state_business_days: res[0].state_business_days,
      tbl_state_id: res[0].tbl_state_id
    })
    // console.log(this.employeeForm.controls.imageName.value)
    console.log(this.stateForm)
  })
}

submit(e: any) {

  console.log('My form inside submit', this.stateForm.value)
  if (this.stateForm.invalid) {
    this.stateForm.markAllAsTouched();
    this.toast.error('Please Fill All Information');
    return
  }
  let data = {
    state_fee:e.state_fee,
    state_business_days: e.state_business_days,
    tbl_state_id: e.tbl_state_id
    }




 if (this.btn == 'Update') {
    console.log(data, '..')
    this.loading = true;
    this.otherSer.updateStateById(data).subscribe(res => {
      this.loading = false;
      console.log(res);
      if (res == 'stateUpdate') {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1500
        })
        this.getAllStates()
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
actions(e: any, oID:number) {
}
}
