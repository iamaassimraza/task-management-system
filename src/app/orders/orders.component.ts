import { throwDialogContentAlreadyAttachedError } from '@angular/cdk/dialog';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OrderService } from '../Apis/order.service';
import { OtherService } from '../Apis/other.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ToastrService } from 'ngx-toastr';
import { TodoService } from '../Apis/todo.service';
import { EmployeeService } from '../Apis/employee.service';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { BottomSheetforRejectionsComponent } from '../bottom-sheetfor-rejections/bottom-sheetfor-rejections.component';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CdkTreeModule } from '@angular/cdk/tree';
import { BehaviorSubject } from 'rxjs';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatDialog } from '@angular/material/dialog';
import { ServiceDetailComponent } from '../service-detail/service-detail.component';
import { ThemePalette } from '@angular/material/core';
import Swal from 'sweetalert2';
import { Sort, MatSortModule } from '@angular/material/sort';
import { NgFor } from '@angular/common';
import {
	FormBuilder, FormGroupDirective, FormGroup, FormArray, NgForm, Validators, FormControl,
	FormControlName, FormArrayName,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { UserService } from '../Apis/user.service';
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
export interface Task {
	name: string;
	completed: boolean;
	color: ThemePalette;
	subtasks?: Task[];
}
declare var require: any
const FileSaver = require('file-saver');
@Component({
	selector: 'app-orders',
	templateUrl: './orders.component.html',
	styleUrls: ['./orders.component.css', '../pagination.css'],
})
export class OrdersComponent implements OnInit {
	@ViewChild('customId') customIdField: ElementRef;
	task: Task = {
		name: 'Indeterminate',
		completed: false,
		color: 'primary',
		subtasks: [
			{ name: 'Primary', completed: false, color: 'primary' },
			{ name: 'Accent', completed: false, color: 'accent' },
			{ name: 'Warn', completed: false, color: 'warn' },
		],
	};

loading = true;
loader = true;
totalcount = 10;

	allComplete: boolean = false;
	updateAllComplete() {
		this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
	}
	someComplete(): boolean {
		if (this.task.subtasks == null) {
			return false;
		}
		return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
	}
	setAll(completed: boolean) {
		this.allComplete = completed;
		if (this.task.subtasks == null) {
			return;
		}
		this.task.subtasks.forEach(t => (t.completed = completed));
	}

	// Arrays
	allOrders: any[] = [];
	filteredOrders: any[] = [];
	allEmployee: any[] = [];
	allStatus: any[] = [];
	allTODO: any[] = [];
	images: any[] = [];
	orderServices: any[] = [];
	userDetail: any[] = [];
  tablelist: any[]= [1,2,3,4,5,6,7,];
	// image variables
	EINuploaded = false;
	companyImageUploaded = false;
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
	// end image variables
	selectedStatus = 'all';
	selectedManager = 'none';
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
	wantToReject = false;
	noRecordFound = false;
	isDisabled = false;
	CompanyDisabled = false;
	IndividualDisabled = false;
	panelOpenState = false;
	panelOpenStateserviceMashrBankAccount = false;
	panelOpenStateserviceMashrResellerCertificate = false;
	panelOpenStateserviceMashrRegisteredAgent = false;
	panelOpenStateserviceMashrEINwithSSN = false;
	panelOpenStateserviceMashrBusinessAddress = false;
	panelOpenStateserviceMashrAmazon = false;
	iswantToEditCustomIdClicked: Boolean[] = [];
	activeFilter = false
	minDate: Date;
	userid: any;

	constructor(private bottomSheet: MatBottomSheet, private userSer: UserService, private ser: TodoService, private otherSer: OtherService, private orderSer: OrderService, private employeeSer: EmployeeService, private toast: ToastrService, public dialog: MatDialog) {
		this.imgBasePath = this.otherSer.imgUrl;
		this.minDate = new Date();
	}
	openServiceDetailDialog(detail: any, docs: any, serName: any, customId: any) {
		this.otherSer.serviceDetail = detail;
		this.otherSer.serviceDocs = docs;
		this.otherSer.serviceName = serName;
		this.otherSer.customId = customId;
		console.log(`Dialog result:`, this.otherSer.serviceDetail);
		const dialogRef = this.dialog.open(ServiceDetailComponent);
		dialogRef.afterClosed().subscribe(result => {
			console.log(`Dialog result: ${result}`);
		});
	}


	getProgressBarBackground(progress: number): string {
		const filledColor = '#174994';
		const emptyColor = 'white';
		const background = `linear-gradient(to right, ${filledColor} ${progress.toString()}%, ${emptyColor} ${progress.toString()}%)`;
		return background;
	}
	getRemainingDays(deadline_date1: any) {
		if (!deadline_date1) {
			return "unknown";
		}
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
		} else {
			return daysDifference.toString();
		}
	}
	getTooltipServices(id: any): string {
		let services: any[];
		let names: any[] = [];
		const allorder = this.allOrders.filter(o => o.tbl_order_id === id)
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
	onBlur() {
		this.activeFilter = !this.activeFilter;
	}
	getChildren(node: any): any[] {
		if (node && node.members && node.members.length) {
			return node.members;
		} else {
			return [];
		}
	}

	openBottomSheet(id: any): void {
		let data1 = {
			tbl_order_service_id: id
		}
    this.loading = true;
		this.orderSer.getOrderServiceRejectionsById(data1).subscribe(res => {
      this.loading = false;
			console.log('REJECTIONS', res);
			if (res != 'fail') {
				this.orderSer.allRejections = res;
				console.log('All rejects updated', this.orderSer.allRejections)
				this.bottomSheet.open(BottomSheetforRejectionsComponent)
			}
			else if (res == 'fail') {
				this.bottomSheet.open(BottomSheetforRejectionsComponent)
			}
		})
	}
	myForm = new FormGroup({
		task_detail: new FormControl(''),
		assign_by: new FormControl(''),
		assign_to: new FormControl('', [Validators.required]),
		deadline_date: new FormControl('', Validators.required),
		tbl_task_id: new FormControl(''),
		need_assigner_approval: new FormControl(false),
		actions: new FormControl('0'),
		orderID: new FormControl(),
		empID: new FormControl(),
		tbl_order_service_id: new FormControl(),
		service_name: new FormControl(),
		tbl_state_id: new FormControl(),
		address_duration_id: new FormControl(),
		detail: new FormControl(),
		userName: new FormControl(),
		company_final_name: new FormControl(),
		tbl_agent_id: new FormControl(),
		email: new FormControl(),
		IsAgent: new FormControl(),
		agentType: new FormControl(),
		front_Passport_picture: new FormControl(null),
		back_Passport_picture: new FormControl(null),
		front_cnic_picture: new FormControl(null),
		back_cnic_picture: new FormControl(null),
		front_driving_lic_picture: new FormControl(null),
		back_driving_lic_picture: new FormControl(null),
		utility_bill_image: new FormControl(null),
		bank_statement_image: new FormControl(null),
		pass_img_1: new FormControl(''),
		pass_img_2: new FormControl(''),
		cnic_1: new FormControl(''),
		cnic_2: new FormControl(''),
		driving_1: new FormControl(''),
		driving_2: new FormControl(''),
		utility_name: new FormControl(''),
		bank_statement: new FormControl(''),
		customId: new FormControl('', [Validators.required, Validators.pattern(/^CFID\d+$/)]),
		searchByManager: new FormControl('none')

	})

	onTypeChange(hint: any) {
		if (hint == 'company') {
			this.IndividualDisabled = true
		}
		else if (hint == 'individual') {
			this.CompanyDisabled = true
		}
		this.isDisabled = true
	}
	openModal() {
		this.display = 'block';
	}
	onCloseModal() {
		this.display = 'none';
		this.myForm.patchValue({ actions: '0' });
	}
	onServiceSelect(tbl_order_service_id: number) {
		console.log('All todo', this.allTODO);
		let myArray: any[] = this.filteredOrders[0].order_services;
		let myArray1: any[] = myArray.filter(o => o.tbl_order_service_id === tbl_order_service_id);
		console.log('RES', myArray1);
		this.images = myArray1[0].documents;
		console.log('Form', this.myForm.value);
		return
	}

	ngOnInit() {
		this.getAllEmployee();
		this.getEmployeeByID();
		this.getAllOrderStatus();
		this.getAllOrders();
    this.loader = false;



	}
	getAllOrdersOfEmployee(e: any) {
		console.log('EVENT', e);
		if (e == 'none') {
			this.filteredOrders = this.allOrders;
			return
		}
		else {
			this.filteredOrders = this.allOrders.filter(order => order.tbl_employee_id === e)
		}
	}
	actions(e: any, oID: number) {
		console.log('this');
		this.myForm.patchValue({ orderID: oID })
		let val = e;
		let statusId = this.allStatus.filter(obj => obj.order_status_name === val)
		if (val == 'in_progress') {
			this.openModal()
		}
		else {
			let data = {
				tbl_order_id: oID,
				order_status_id: statusId[0].order_status_id
			}
      this.loading= true;
			this.orderSer.updateOrderStatus(data).subscribe(res => {
        this.loading = false;
				console.log('success', res);
				if (res == "orderStatusUpdate") {
					Swal.fire({
						position: 'top-end',
						icon: 'success',
						title: 'Your work has been saved',
						showConfirmButton: false,
						timer: 4000
					  })
					this.getAllOrders();
				}
				else {
					this.toast.error("Something went wrong. Pls try again.")
				}
			})
		}
	}

	getAllOrders() {
    this.loading = true;
		this.orderSer.getAllOrders().subscribe(res => {
      this.loading = false;
			console.log('getAllOrders---', res);
			if (res == 'fail') {
				this.noRecordFound = true
				return
			}
			this.allOrders = [];
			this.filteredOrders = [];
			this.allOrders = res;
			this.filteredOrders = this.allOrders;
			console.log('All filtered orders', this.filteredOrders);
			this.totallength = this.filteredOrders.length;
		})
		this.myForm.patchValue({ actions: '0' });
	}

	getAllOrderStatus() {
    this.loading = true;
		this.orderSer.getAllOrderStatus().subscribe(res => {
      this.loading = false;
			console.log('Order Status', res);
			if (res != 'datanotfound') {
				let arr: any[] = res;
				this.allStatus = [];
				this.allStatus = arr.filter(o => o.order_status_name != 'complete')
			}
		})
	}
	getEmployeeByID() {
		let id = this.otherSer.sessionStorage.retrieve('empId');
		this.myForm.patchValue({ empID: id })
		let data = {
			tbl_employee_id: id
		}
    this.loading = true;
		this.employeeSer.getEmployeeBy(data).subscribe(res => {
      this.loading = false;
			this.assignerName = res[0].emp_username.toUpperCase();
			this.assignerID = res[0].tbl_employee_id
			console.log('getEmployeeBy', res)
		})
	}
	submit() {
		if (this.myForm.controls.assign_to.invalid || this.myForm.controls.deadline_date.invalid) {
			this.myForm.markAllAsTouched();
			return
		}
		else {
			let need: any = this.myForm.controls.need_assigner_approval.value;
			if (need === true) {
				need = 'yes';
			} else if (need === false) {
				need = 'no';
			}
			let data = {
				need_assigner_approval: need,
				assign_by: this.myForm.controls.empID.value,
				assign_to: this.myForm.controls.assign_to.value,
				task_detail: this.myForm.controls.task_detail.value,
				deadline_date: this.myForm.controls.deadline_date.value,
				tbl_order_id: this.myForm.controls.orderID.value
			}
			console.log('Before Assign', data)
      this.loading = true;
			this.ser.assignTask(data).subscribe(res => {
        this.loading = false;
				console.log(res)
				if (res == "task_assign") {
					Swal.fire({
						position: 'top-end',
						icon: 'success',
						title: 'Your work has been assigned',
						showConfirmButton: false,
						timer: 4000
					  })
					this.onCloseModal();
					this.getAllOrders();
					// window.location.reload();
				}
			})
		}
	}
	getAllEmployee() {
    this.loading = true;
		this.employeeSer.getAllEmployee().subscribe(res => {
      this.loading = false;
			let arr: any[] = res;
			if (res != 'datanotfound') {

				this.allEmployee = [];
				console.log('getAllEmployee RES', res)
				for (let i = 0; i < arr.length; i++) {
					this.allEmployee = arr.filter(o =>
						o.emp_type != 'Admin'
					)
				}

				console.log('All emp', this.allEmployee);
			}

		})
	}


	expand(id: any) {
		let myarr: any[] = this.filteredOrders.filter(o => o.order_services)
		this.orderServices = myarr[0].order_services;
		let uid = this.orderServices[0].tbl_user_id;
		if (uid) {
			this.getuserbyid(uid);
		}
		console.log('order services', this.orderServices);
		return this.orderServices;
	}


	filterOrders(val: any) {
		let managerId = this.myForm.controls.searchByManager.value;
		if (val == 'all') {
			if (managerId && managerId != 'none') {
				this.filteredOrders = this.allOrders.filter(order => order.assign_to === managerId)
			} else {
				this.filteredOrders = this.allOrders;
			}
		}
		else if (val !== 'all') {
			if (managerId && managerId != 'none') {
				this.filteredOrders = this.allOrders.filter(order => order.order_services[0].order_status_name === val && order.assign_to == managerId);
			} else {
				this.filteredOrders = this.allOrders.filter(order => order.order_services[0].order_status_name === val);
			}
		}
	}

	searchByCFID(e: any) {
		const searchValue = e.target.value.toLowerCase();
		this.filteredOrders = this.allOrders.filter(order => order.order_services[0]?.customId.toLowerCase().includes(searchValue)
		);
	}

	sortData1(sort: Sort) {

		this.filteredOrders.sort((a, b) => {
			const customIdA = a.order_services[0]?.customId || 0; // Get the customId of the first object in the order_services array of object a
			const customIdB = b.order_services[0]?.customId || 0; // Get the customId of the first object in the order_services array of object b
			if (customIdA < customIdB) {
				return -1; // a should come before b
			} else if (customIdA > customIdB) {
				return 1; // b should come before a
			} else {
				return 0; // the order is unchanged
			}
		});

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



	onApprove(tbl_order_id: number, tbl_order_service_id: number) {
		let data = {
			tbl_order_service_id: tbl_order_service_id,
			tbl_order_id: tbl_order_id,
			status: 'complete',
			empId: this.myForm.controls.empID.value
		}
    this.loading = true;
		this.ser.adminUpdateOrderServiceStatus(data).subscribe(res => {
      this.loading = false;
			console.log('Admin Action', res);
			if (res == 'orderServiceUpdate') {
				Swal.fire({
					position: 'top-end',
					icon: 'success',
					title: 'Your work has been saved',
					showConfirmButton: false,
					timer: 4000
				  })
				this.getAllOrders();
			}
			else if (res != 'orderServiceUpdate') {
				this.toast.error('Something went wrong! Try again pls.');
			}
		})
	}

	onReject(tbl_order_id: number, tbl_order_service_id: number) {
		this.myForm.patchValue({ tbl_order_service_id: tbl_order_service_id, orderID: tbl_order_id })
		this.openModal();
		this.wantToReject = true;
		return
	}

	serviceRejectedByAdmin() {
		let ee = this.myForm.controls;
		let data = {
			tbl_order_service_id: ee.tbl_order_service_id.value,
			tbl_order_id: ee.orderID.value,
			status: 'reject',
			rejection_reason: this.myForm.controls.task_detail.value,
			empId: this.myForm.controls.empID.value
		}
    this.loading = true;
		this.ser.adminUpdateOrderServiceStatus(data).subscribe(res => {
      this.loading = false;
			console.log('Admin Action', res);
			if (res == 'orderServiceUpdate') {
				Swal.fire({
					position: 'top-end',
					icon: 'success',
					title: 'Service rejected',
					showConfirmButton: false,
					timer: 4000
				  })
				this.onCloseModal();
				window.location.reload();
			}
			else if (res != 'orderServiceUpdate') {
				this.onCloseModal();
				this.toast.error('Something went wrong. Pls try again');
				return
			}
		})
	}
	downloadPdf(pdfUrl: string, pdfName: string) {
		let path = this.imgBasePath + pdfUrl + pdfName;
		console.log('P', path, 'Name', pdfName);
		FileSaver.saveAs(path, pdfName);
	}

	onFileSelected(event: any) {
		const file: File = event.target.files[0];
		if (file) {
			this.img_div = true;
			this.icon_1 = false;
			this.fileName = file.name;
			this.otherSer
				.image1(file, this.order_id, 'passport_images_1')
				.subscribe((res) => {
					console.log('GERE---------11', res);
					this.myForm.controls.pass_img_1.patchValue(res);
				});
		}
	}
	wantToEditCustomId(hint: string, customId: any, i: any) {
		this.myForm.controls.customId.patchValue(customId);
		this.customIdField?.nativeElement.focus();
		switch (hint) {
			case 'show':
				this.iswantToEditCustomIdClicked = [];
				this.iswantToEditCustomIdClicked[i] = true;
				break;
			case 'hide':
				this.iswantToEditCustomIdClicked[i] = false;
				console.log('inside hide', this.iswantToEditCustomIdClicked)
				break;
		}
	}

	updateCustomId(orderId: any, customId: any, i: any) {
		if (this.myForm.controls.customId.invalid) {
			return
		}
		let data = {
			tbl_order_id: orderId,
			customId: customId
		};
		console.log('data', data);
    this.loading = true;
		this.orderSer.updateCustomId(data).subscribe(res => {
      this.loading = false;
			console.log('RRR', res);
			if (res !== 'success') {
				Swal.fire({
					icon: 'error',
					title: res,
					text: 'Please check your internet and try again.',
				})
			} else if (res == 'success') {
				Swal.fire({
					position: 'top-end',
					icon: 'success',
					title: 'Your work has been saved',
					showConfirmButton: false,
					timer: 4000
				  })
				this.iswantToEditCustomIdClicked[i] = false;
				this.getAllOrders();
			} else if (res == 'fail') {
				Swal.fire({
					icon: 'error',
					title: res,
					text: 'Please check your internet and try again.',
				})
			}
		})
	}

	get customIdGetter() {
		return this.myForm.get('customId')
	}



	getuserbyid(id: number) {
		if (id) {
			this.imgBasePath = this.otherSer.imgUrl + 'clientPersonalDocuments/client_id_' + id;
			let data = {
				user_id: id
			}
      this.loading = true;
			this.userSer.getuserbyid(data).subscribe(res => {
        this.loading = false;
				console.log('user by id111', res)

				if (res != 'datanotfound') {
					if (res[0].passport_image_1) {
						this.myForm.controls.pass_img_1.patchValue(res[0].passport_image_1 + '?t=' + Date.now())
					}
					if (res[0].passport_image_2) {
						this.myForm.controls.pass_img_2.patchValue(res[0].passport_image_2 + '?t=' + Date.now())
					}
					if (res[0].cnic_front_image) {
						this.myForm.controls.cnic_1.patchValue(res[0].cnic_front_image + '?t=' + Date.now())
					}
					if (res[0].cnic_back_image) {
						this.myForm.controls.cnic_2.patchValue(res[0].cnic_back_image + '?t=' + Date.now())
					}
					if (res[0].driving_license_image_1) {
						this.myForm.controls.driving_1.patchValue(res[0].driving_license_image_1 + '?t=' + Date.now())
					}
					if (res[0].driving_license_image_2) {
						this.myForm.controls.driving_2.patchValue(res[0].driving_license_image_2 + '?t=' + Date.now())
					}
					if (res[0].utility_bill_image) {
						this.myForm.controls.utility_name.patchValue(res[0].utility_bill_image + '?t=' + Date.now())
					}
					if (res[0].bank_statement) {
						this.myForm.controls.bank_statement.patchValue(res[0].bank_statement + '?t=' + Date.now())
					}
					this.userDetail = res;
				}
				else if (res == 'datanotfound') {
					this.toast.error('Your Session is expired.');
				}
			})
		} else if (!id) {
			alert('Somethng Wrong because system is under development. Pls logout first then login again.')
			return
		}
	}


}



