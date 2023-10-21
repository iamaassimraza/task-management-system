import { Component } from '@angular/core';
import { ReportsService } from '../Apis/reports.service';
import { EmployeeService } from '../Apis/employee.service';
import { FormControl, FormGroup } from '@angular/forms';
import { OrderService } from '../Apis/order.service';
import { ServicesService } from '../Apis/services.service';
import { UserService } from '../Apis/user.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css', '../pagination.css']
})
export class ReportsComponent {

  loading = true;
  allEmployeesReport: any[] = [];
  allOrdersReport: any[] = [];
  allDailyProgressReport: any[] = [];
  allOrdersProgressReport: any[] = [];
  allStatus: any[] = [];
  allServices: any[] = [];
  allEmployee: any[] = [];
  allTopDemandedProducts: any[] = [];
  topAgent: any[] = []
  topStates: any[] = []
  topPackages: any[] = [];
  totalOrders = 0;
  assignedOrders = 0;
  unassignedOrders = 0;
  completeOrder = 0;
  p: number = 1;
  totallength: number = 0;
  p_daily: number = 1;
  totallength_daily: number = 0;
  dailyProgressFormattedStartDate: string;
  dailyProgressFormattedEndDate: string;
  orderProgressFormattedStartDate: string;
  orderProgressFormattedEndDate: string;
  apiDate: string;
  ordersNotFound = false;
  dailyNotFound = false;
  userType:string;
  constructor(private orderSer: OrderService, private usersSer: UserService, private servicesSer: ServicesService, private ser: ReportsService, private empSer: EmployeeService) { }

  myForm = new FormGroup(
    {
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      status: new FormControl(),
      employeeId: new FormControl('0'),
      serviceName: new FormControl('0'),
    }
  );
  orderProgressMyForm = new FormGroup(
    {
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      status: new FormControl('0'),
      employeeId: new FormControl('0'),
    }
  );
  dailyAdvanceSearch() {
    const dateValueStart = this.myForm.controls.startDate.value;
    if (dateValueStart !== null) {
      const parsedDate = Date.parse(dateValueStart);
      if (!isNaN(parsedDate)) {
        const date = new Date(parsedDate);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const formattedDateStart = `${year}-${month}-${day}`;
        console.log(formattedDateStart); // Output the formatted date
      }
    }
    const dateValueEnd = this.myForm.controls.endDate.value;
    if (dateValueEnd !== null) {
      const parsedDate = Date.parse(dateValueEnd);
      if (!isNaN(parsedDate)) {
        const date = new Date(parsedDate);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const dateValueEnd = `${year}-${month}-${day}`;
        console.log(dateValueEnd); // Output the formatted date
      }
    }
    this.dailyProgressReport();
  }

  orderAdvanceSearch() {
    const dateValueStart = this.orderProgressMyForm.controls.startDate.value;
    if (dateValueStart !== null) {
      const parsedDate = Date.parse(dateValueStart);
      if (!isNaN(parsedDate)) {
        const date = new Date(parsedDate);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const formattedDateStart = `${year}-${month}-${day}`;
        console.log(formattedDateStart); // Output the formatted date
      }
    }
    const dateValueEnd = this.orderProgressMyForm.controls.endDate.value;
    if (dateValueEnd !== null) {
      const parsedDate = Date.parse(dateValueEnd);
      if (!isNaN(parsedDate)) {
        const date = new Date(parsedDate);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const dateValueEnd = `${year}-${month}-${day}`;
        console.log(dateValueEnd); // Output the formatted date
      }
    }
    this.ordersProgressReport();
  }

  openReport(name: string) {
    switch (name) {
      case 'tasksLog':
        break;
    }

    this.ser.getAllTasksLog().subscribe(res => {

      console.log('report', res);
      if (res) {
        let path = 'https://themashr.com/themashr_version1_apis/pdfFile/' + res;
        window.open(path, '_blank');
      }
    })
  }
  ngOnInit() {
    this.adminDeshboard();
    this.ordersProgressReport();
    this.getAllOrderStatus();
    this.getAllServices();
    this.getAllEmployee();
    this.getAllTopDemandedProducts();
    this.myForm.controls.employeeId.patchValue('0');
    // get('employeeId').setValue('0');

    setTimeout(() => {
      this.loading = false;
    }, 8000);



  }
  getAllEmployee() {

    this.empSer.getAllEmployee().subscribe(res => {

      console.log('All employee', res);
      this.allEmployee = res;
      console.log(this.allEmployee, 'ss')
    })
  }
  getAllEmployeesWithOrdersCount() {
    this.ser.getAllEmployeesWithOrdersCount().subscribe(res => {
      console.log('Employees Report', res);
      if(res != 'fail'){
      console.log('Employee report type', this.userType);

            this.allEmployeesReport = res;
            if(this.userType == 'Manager'){
              this.allEmployeesReport=this.allEmployeesReport.filter(obj=>obj.emp_type == 'Manager' || obj.emp_type == 'Team')
            }
           else if(this.userType == 'Admin'){
              this.allEmployeesReport=res;
            }
      this.allEmployeesReport.sort((a, b) => b.completedOrders - a.completedOrders);
      }
    })
  }

  dailyProgressReport() {
    let data = {
      startDate: this.myForm.controls.startDate.value,
      endDate: this.myForm.controls.endDate.value,
      status: this.myForm.controls.status.value,
      employeeId: this.myForm.controls.employeeId.value,
      serviceName: this.myForm.controls.serviceName.value
    }
    console.log('daily progress report before ', data);

    this.ser.dailyProgressReport(data).subscribe(res => {

      console.log('daily progress report ', res);
      if (res !== 'recordNotFound') {
        this.dailyNotFound = false;
        this.allDailyProgressReport = [];
        this.apiDate = res[0].timestamp;
        const apiDateObject = new Date(this.apiDate);
        this.dailyProgressFormattedStartDate = apiDateObject.toISOString().substring(0, 10);
        this.allDailyProgressReport = res;
        if(this.userType == 'Manager'){
          this.allDailyProgressReport=this.allDailyProgressReport.filter(obj=>obj.emp_type == 'Manager' || obj.emp_type == 'Team')
        }
       else if(this.userType == 'Admin'){
          this.allDailyProgressReport=res;
        }
      }
    })
  }

  userData:any;
  receiveData(data: any) {
    console.log('data in receuive dta', data)
   if(data){
   this.userType=data[0].emp_type;
   this.getAllEmployeesWithOrdersCount();
   this.dailyProgressReport();
  }
  }
  getAllServices() {

    this.servicesSer.getAllServices().subscribe(res => {

      let tempo: any[] = [];
      tempo = res;
      this.allServices = tempo.filter(ss => ss.service_title !== 'serviceMashrEINwithSSN')
      console.log('getAllServices', this.allServices);
      this.allServices.sort((a, b) => b - a);
    })
  }
  ordersProgressReport() {
    let data = {
      startDate: this.orderProgressMyForm.controls.startDate.value,
      endDate: this.orderProgressMyForm.controls.endDate.value,
      status: this.orderProgressMyForm.controls.status.value,
      employeeId: this.orderProgressMyForm.controls.employeeId.value,
    }
    console.log('ordersProgressReport data ', data);


    this.ser.ordersProgressReport(data).subscribe(res => {

      console.log('ordersProgressReport ', res);
      if (res !== 'recordNotFound') {
        this.allOrdersProgressReport = [];
        this.allOrdersProgressReport = res;
        this.ordersNotFound = false;
      }
      else {
        this.allOrdersProgressReport = [];
        this.ordersNotFound = true;
      }
    })
  }

  getAllOrderStatus() {

    this.orderSer.getAllOrderStatus().subscribe(res => {

      console.log('Order Status', res);
      let arr: any[] = res;
      this.allStatus = [];
      this.allStatus = arr.filter(o => o.order_status_name != 'complete')
    })
  }

  adminDeshboard() {

    this.empSer.adminDeshboard().subscribe((res) => {

      console.log('Admin Dahboard', res);
      this.allOrdersReport = res;
      this.completeOrder = res[0].completed_orders;
      this.assignedOrders = res[0].in_progress_orders;
      this.unassignedOrders = res[0].not_assign_orders;
      this.totalOrders = res[0].total_orders;
    });
  }
  getAllTopDemandedProducts() {

    this.ser.getAllTopDemandedProducts().subscribe(res => {

      console.log('getAllTopDemandedProducts', res);
      if(res !='datanotfound'){
        this.allTopDemandedProducts = res;
        this.allTopDemandedProducts.forEach(item => {
          const agent = {
            name: item.agent_fname,
            count: item.agent_count
          };
          // Check if the agent already exists in the array before pushing
          const existingAgent = this.topAgent.find(a => a.name === agent.name);
          if (!existingAgent) {
            this.topAgent.push(agent);
            this.topAgent.sort((a, b) => b - a);
          }
          const state = {
            name: item.state_name,
            count: item.state_count
          };
          // Check if the state already exists in the array before pushing
          const existingState = this.topStates.find(s => s.name === state.name);
          if (!existingState) {
            this.topStates.push(state);
            this.topStates.sort((a, b) => b.count - a.count);
          }
          console.log('packages', this.topStates);

          const pkg = {
            name: item.pkg_title,
            count: item.total_count
          };
          const existingPackage = this.topPackages.find(s => s.name === pkg.name);
          if (!existingPackage) {
            this.topPackages.push(pkg);
          }
          console.log('packages', this.topPackages);
        });
      }
else if(res === 'datanotfound') {
this.topPackages=[];
this.topStates=[];
console.log('top packages',this.topPackages);
}


      console.log('All', this.topAgent, this.topStates, this.topPackages);
    });
  }


}
