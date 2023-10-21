import { Component } from '@angular/core';
import { EmployeeService } from '../Apis/employee.service';
import { OtherService } from '../Apis/other.service';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { OrderService } from '../Apis/order.service';
import { SessionStorageService } from 'ngx-webstorage';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  userID: any;
  isArrowDown = false;
  empType: any;
  empName: any;
  lastName: any;
  empImg: any;
  emp_image: any;
  img_url: any;
  empID: any;
  url: string;
  userDetail: any[] = [];
  isShow = false;
  orders: any[] = [];
  pendingOrders: any[] = [];

  allToDo: any[] = [];
  employeePendingOrder: any[] = [];
  showReport = false
  loading = false;
  Sidebarlists:any[]=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];
  constructor(
    private ser: EmployeeService,
    private toast: ToastrService,
    private router: Router,
    private otherSer: OtherService,
    private order: OrderService,
    private activatedRoute: ActivatedRoute,
    private employeeSer: EmployeeService,
    private sessionStorage: SessionStorageService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.url = event.urlAfterRedirects;
      }
    });
  }
  toggleArrow() {
    this.isArrowDown = !this.isArrowDown;
  }
  isActive(url: string): boolean {
    return this.url === url;
  }
  ngOnInit(): void {
    // this.loading=true;
    // return
    this.img_url = this.otherSer.imgUrl;
    this.getEmployeeByID();
    this.getAllOrders();
    this.getAllTodoOfEmployer();
  }

  reloadPageIfRouteMatch(path: string) {
    if (path === this.router.url) {
      window.location.reload();
    }
  }

  getEmployeeByID() {
    this.empID = this.sessionStorage.retrieve('empId');
    if (this.empID) {
      let data = {
        tbl_employee_id: this.empID,
      };
      this.loading=true;
      this.ser.getEmployeeBy(data).subscribe((res) => {
        this.loading=false;
        console.log('Sidebar11111', res);
        this.userDetail = [];
        this.empName = res[0].emp_fname;
        this.empType = res[0].emp_type;
        this.emp_image = res[0].emp_image;
        if (res[0].emp_lname != null || res[0].emp_lname != '') {
          this.lastName = res[0].emp_lname;
        }});

      } else {
      this.toast.info('Seems your session is expired.');
      this.router.navigate(['login']);
    }
  }

  getAllOrders() {
    this.loading=true;
    this.order.getAllOrders().subscribe((res) => {
    this.loading=false;

      console.log('All orders for dealine countdown', res);
      if (res != 'fail') {
        this.orders = res;
        let tempArray:any[]=res;
        this.orders=tempArray.filter(obj=>obj.assign_to && obj.deadline_date)
        this.orders.forEach((order) => {
          const currentDate = new Date();
          const deadline_date = new Date(order.deadline_date);
          const timeDifference = deadline_date.getTime() - currentDate.getTime();
          const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
          // if (daysDifference) {
          if (daysDifference === 0) {
            order.deadline_date = "Today";
          } else if (daysDifference === 1) {
            order.deadline_date = "Tmrw";
          } else {
            order.deadline_date = daysDifference;
          }
          this.pendingOrders.push(order);
          this.pendingOrders.sort((a, b) => {
            if (a.deadline_date === "Today" && b.deadline_date !== "Tmrw") return -1; // "Today" goes first
            if (b.deadline_date === "Today" && a.deadline_date !== "Tmrw") return 1;
            if (a.deadline_date === "Tmrw" && b.deadline_date !== "Today") return -1; // "Tmrw" goes second
            if (b.deadline_date === "Tmrw" && a.deadline_date !== "Today") return 1;
            const dateA = new Date(a.deadline_date);
            const dateB = new Date(b.deadline_date);
            return dateA.getTime() - dateB.getTime();
          });
          // }
        });
        console.log('Pending Order', this.pendingOrders);
        this.pendingOrders = this.pendingOrders.filter((order) => {
          const deadline = typeof order.deadline_date === 'string' ? parseInt(order.deadline_date) : order.deadline_date;
          return deadline < 10 || order.deadline_date === 'Today' || order.deadline_date === 'Tmrw';
        });
        console.log('after filter pending', this.pendingOrders);
      }
      if (this.empType === 'Team') {
        this.pendingOrders = res;
        this.pendingOrders = this.orders.filter(obj => obj.assign_to == this.empID);
      }
    });
  }

  getAllTodoOfEmployer() {
    const id = this.otherSer.sessionStorage.retrieve('empId');
    let data = {
      tbl_employee_id: id
    }
    this.loading=true;

    this.employeeSer.getAllTodoOfEmployer(data).subscribe((res) => {
      this.loading=false;

      console.log('to do orders', res);
      if (res !== 'fail') {
        this.allToDo = res;

        this.allToDo.forEach((order) => {
          const currentDate = new Date();
          const deadline_date = new Date(order.deadline_date);
          const timeDifference = deadline_date.getTime() - currentDate.getTime();
          const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
          if (daysDifference > 0) {
            if (daysDifference === 1) {
              order.deadline_date = "Today";
            } else if (daysDifference === 2) {
              order.deadline_date = "Tmrw";
            } else {
              order.deadline_date = daysDifference;
            }
            this.employeePendingOrder.push(order);
            this.employeePendingOrder.sort((a, b) => {
              if (a.deadline_date === "Today" && b.deadline_date !== "Tmrw") return -1; // "Today" goes first
              if (b.deadline_date === "Today" && a.deadline_date !== "Tmrw") return 1;
              if (a.deadline_date === "Tmrw" && b.deadline_date !== "Today") return -1; // "Tmrw" goes second
              if (b.deadline_date === "Tmrw" && a.deadline_date !== "Today") return 1;
              const dateA = new Date(a.deadline_date);
              const dateB = new Date(b.deadline_date);
              return dateA.getTime() - dateB.getTime();
            });
          }
        });
        console.log('Pending Order', this.employeePendingOrder);
        let tt: any[] = [];
        tt = this.employeePendingOrder;
        this.employeePendingOrder = tt.filter(r => r.deadline_date < 30);
        console.log('after filter pending of employee', this.employeePendingOrder);
      }
    });
  }



}
