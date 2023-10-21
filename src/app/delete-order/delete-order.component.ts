import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../Apis/order.service';
import { OtherService } from '../Apis/other.service';
import { ToastrService } from 'ngx-toastr';
import { TodoService } from '../Apis/todo.service';
import { EmployeeService } from '../Apis/employee.service';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { BottomSheetforRejectionsComponent } from '../bottom-sheetfor-rejections/bottom-sheetfor-rejections.component';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-delete-order',
  templateUrl: './delete-order.component.html',
  styleUrls: ['./delete-order.component.css']
})
export class DeleteOrderComponent {
  // Arrays
	allOrders: any[] = [];
	filteredOrders: any[] = [];
	allEmployee: any[] = [];
allStatus:any[]=[];
allTODO:any[]=[];
images:any[]=[];
orderServices:any[]=[];
// Variables
	assignerID: any
	assignerName: any;
	p: number = 1;
	totallength: number = 0;
	hidepagination = true;
	imgBasePath: string;
	expandContent = false;
	type: any = '';
	hidepaginatoin = true;
	no_record = false;
	initial: any;
	display = 'none';
	wantToReject=false;
	noRecordFound=false;
	isDisabled=false;
	CompanyDisabled=false;
	IndividualDisabled=false;


	constructor( private otherSer: OtherService, private orderSer: OrderService, private employeeSer: EmployeeService) {
		this.imgBasePath = this.otherSer.imgUrl;
	}

	myForm = new FormGroup({
		task_detail: new FormControl(''),
		assign_by: new FormControl(''),
		assign_to: new FormControl('', [Validators.required]),
		deadline_date: new FormControl(''),
		tbl_task_id: new FormControl(''),
		actions: new FormControl('0'),
		orderID: new FormControl(),
		empID: new FormControl(),
		tbl_order_service_id:new FormControl(),
		service_name:new FormControl(),
		tbl_state_id:new FormControl(),
		address_duration_id:new FormControl(),
		detail:new FormControl(),
		userName:new FormControl(),
		company_final_name:new FormControl(),
		tbl_agent_id:new FormControl(),
		email:new FormControl(),
		IsAgent:new FormControl(),
		agentType:new FormControl(),
	})
  delete_blog(id:any){
    let data ={
      tbl_order_id: id
    }
 console.log(data,'id for order delete here')
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.orderSer.deleteOrder(data).subscribe(res=>{
          console.log(res);
          if(res=="success"){
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Order deleted.',
              showConfirmButton: false,
              timer: 1500,
            })
            this.getAllOrders();
          }
              })
      } else if (result.isDenied) {
      }
    })
  }

	  
	ngOnInit(): void {
		this.getAllOrders();
		this.getEmployeeByID();
	}

	


	getAllOrders() {
		this.orderSer.getAllOrders().subscribe(res => {
			console.log('Order111', res);
			if(res=='fail'){
				this.noRecordFound=true
			
			}
			this.allOrders=[];
			this.filteredOrders=[];
			this.allOrders = res;
			this.filteredOrders = res;
			console.log('All filtered', this.filteredOrders)
		})
		this.myForm.patchValue({actions:'0'});
	}


	getEmployeeByID() {
	let id	 = this.otherSer.sessionStorage.retrieve('empid'); 
	this.myForm.patchValue({empID:id})	
	let data = {
			tbl_employee_id: id
		}
		this.employeeSer.getEmployeeBy(data).subscribe(res => {
			this.assignerName = res[0].emp_username.toUpperCase();
			this.assignerID = res[0].tbl_employee_id
			console.log('&&&&&&&&', res)
		})
	}

}
