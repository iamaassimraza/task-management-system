import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../Apis/employee.service';
import { OrderService } from '../Apis/order.service';
import { ChartConfiguration, ChartOptions, Chart, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { OtherService } from '../Apis/other.service';
import { SessionStorageService } from 'ngx-webstorage';
export interface data {
  [key: string]: any;
}
@Component({
  selector: 'app-dasboard',
  templateUrl: './dasboard.component.html',
  styleUrls: ['./dasboard.component.css'],
})
export class DasboardComponent {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  @ViewChild('topOfTasks') topOfTasks!: ElementRef;
  @ViewChild('bottomofPage') bottomofPage!: ElementRef;

  title = 'ng2-charts-demo';
  blocked_orders: any=0;
  completed_orders: any=0;
  in_progress_orders: any=0;
  incomplete_orders: any=0;
  not_assign_orders: any=0;
  total_users: any=0;
  total_orders: any = 0;
  orders: any[] = [];
  limit = 5;
  dataFetched = true;
  userName = '';
  userType = '';
  animationDuration = '2s'
  public greeting: string;
  public barChartLegend = true;
  loading = true;
  cardlist:any[]=[1,2,3,4,5,6,7];


  // Manager Variables + Arrays
  report: any[] = [];
  toal_rejected_order_services: any=0;
  late_order_services_complete: any=0;
  ontime_order_services_complete: any=0;
  early_order_service_complete: any=0;
  completedOrders: any=0;

  constructor(private sessionStorage: SessionStorageService,private otherSer: OtherService, private empSer: EmployeeService, private router:ActivatedRoute, private order: OrderService, private elementRef: ElementRef) {
    const currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour < 12) {
      this.greeting = 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 18) {
      this.greeting = 'Good Afternoon';
    } else if (currentHour >= 18 && currentHour < 22) {
      this.greeting = 'Good Evening';
    } else {
      this.greeting = 'Good Night';
    }
    Chart.defaults.color = 'white';
    Chart.defaults.font.size = 14;
    this.router.queryParams.subscribe(param=>{
     let empid=param['id'];
     if(empid){
      this.sessionStorage.store('empId', empid);
     }
    })
  }
  receiveUserType(e: any) {
    this.userType = e[0].emp_type;
    if(this.userType){
      if (this.userType === 'Admin' || this.userType === 'Manager') {
        this.adminDeshboard();
      }
      else if (this.userType === 'Team') {
        this.managerDesboard();
      }
      this.getAllOrders();
  }
  }


  ngOnInit() {
    setTimeout(() => {

      this.loading = false;
    }, 8000);

   }

  adminDeshboard() {
    this.empSer.adminDeshboard().subscribe((res) => {
      console.log('Admin Dashboard', res);
      this.total_orders = res[0].total_orders;
      this.completed_orders = res[0].completed_orders;
      this.in_progress_orders = res[0].in_progress_orders;
      this.incomplete_orders = res[0].incomplete_orders;
      this.not_assign_orders = res[0].not_assign_orders;
      this.total_users = res[0].total_users;
    });
  }

  managerDesboard() {
    let data = {
      tbl_employee_id: this.otherSer.sessionStorage.retrieve('empId')
    }
    this.empSer.managerDesboard(data).subscribe(res => {
      console.log('manager Dahboard', res)
      this.report = res;
        this.toal_rejected_order_services = res[0].toal_rejected_order_services;
        if(!this.toal_rejected_order_services){
this.toal_rejected_order_services=0;
        }
      this.late_order_services_complete = res[0].late_order_services_complete;
      this.ontime_order_services_complete = res[0].ontime_order_services_complete;
      this.early_order_service_complete = res[0].early_order_service_complete;
    });
  }
  receiveUserName(data: any) {
    console.log('username--',data)
    if(data){
      if(data.emp_fname){
        this.userName = data.emp_fname;
      }
     else if(data.emp_lname){
      this.userName='';
      this.userName = data.emp_fname + ' ' + data.emp_lname;
      }
    }
  }
  getAllOrders() {
    if(this.userType==='Admin'){
  this.order.getAllOrders().subscribe((res) => {
      console.log('orders new task', res);
      this.orders = res;
    });
    }
    if(this.userType==='Team'){
      var empID = this.otherSer.sessionStorage.retrieve('empId');
      this.getAllTodoOfEmployer(empID);
        }
  }
  getAllTodoOfEmployer(id: any) {
    let data = {
      tbl_employee_id: id
    }
    this.loading = true;
    this.empSer.getAllTodoOfEmployer(data).subscribe(res => {
      this.loading = false;
      console.log('Manager todo', res)
      if (res != "fail") {
     this.orders=res;

    }
    })
  }
  showMore() {
    this.limit = this.orders.length;
    setTimeout(() => {
      this.bottomofPage.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 500);
    // this.scrollToBottom();

  }
  showLess() {
    this.topOfTasks.nativeElement.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      this.limit = 5;
    }, 300);
  }
  getTooltipServices(id: any): string {
		let services: any[];
		let names: any[] = [];
		const allorder = this.orders.filter(o => o.tbl_order_id === id)
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
// Functions to get Animation of graphs
getAnimationStyleTotal() {
  return {
    width: this.total_orders+'px', // Initial width
    animation: `widthAnimation ${this.animationDuration} forwards`
  };
}
getAnimationStyleInProgress() {
    return {
      width: this.in_progress_orders+'px', // Initial width
      animation: `widthAnimation ${this.animationDuration} forwards`
    };
  }
  getAnimationStyleCompleted() {
    return {
      width: this.completed_orders+'px', // Initial width
      animation: `widthAnimation ${this.animationDuration} forwards`
    };
  }
  getAnimationStyleNotAssign() {
    return {
      width: this.not_assign_orders+'px', // Initial width
      animation: `widthAnimation ${this.animationDuration} forwards`
    };
  }
  getAnimationStyleIncompletes() {
    return {
      width: this.incomplete_orders+'px', // Initial width
      animation: `widthAnimation ${this.animationDuration} forwards`
    };
  }

}
