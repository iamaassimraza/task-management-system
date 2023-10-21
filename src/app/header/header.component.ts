import { Component, OnInit, Renderer2, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../Apis/employee.service';
import { OtherService } from '../Apis/other.service';
import { UserService } from '../Apis/user.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ChatService } from '../Apis/chat.service';
import Swal from 'sweetalert2'
import { HttpClient } from '@angular/common/http';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { NotificationsService } from '../Apis/notifications.service';
import { interval, Subscription } from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild('rightNav') rightNav: ElementRef;
  @Output() loggedInUserId = new EventEmitter<any>();
  @Output() sendUserName = new EventEmitter<string>();
  // sendData(employeeType: any) {
  //   this.loggedInUserId.emit(employeeType);
  //   this.sendUserName.emit();
  // }
  passUserName(name: string) {
    this.sendUserName.emit(name);
  }
  pageTitle: any = '';
  empID: any;
  empName: any;
  empImg: any;
  empName1: any;
  empImg1: any;
  empType: any;
  img_url: any;
  session_id: any;
  userName: any;
  allUsers: any[] = [];
  allemployees: any[] = [];
  allChat: any[] = []
  showSecondNav = false;
  totalNotifications:any;
  allNotifications: any[] = [];
  loading = true;
  private notificationSubscription: Subscription | undefined;

  constructor(private notificationSer: NotificationsService,
    private renderer: Renderer2,
    private sessionStorage: SessionStorageService,  private localStorage: LocalStorageService, private http: HttpClient, private elementRef: ElementRef,
    private router: Router, private chat_ser: ChatService, private ser: EmployeeService, private otherSer: OtherService, private u_ser: UserService, private toast: ToastrService) {

    this.img_url = this.otherSer.imgUrl;

  }


  ngOnInit(): void {
    // this.loading = true;
    // return

    this.checkSession();

  }
  closeNav() {
    this.rightNav.nativeElement.style.display = 'none'


  }

  mailForm = new FormGroup(
    {
      userType: new FormControl(null, [Validators.required]),
      to_id: new FormControl(null, [Validators.required]),
      from_id: new FormControl(null,),
      subject: new FormControl(null,),
      message: new FormControl(null,),
      chat_type: new FormControl('',),
    }
  )
  toggleClientsNav(id: any) {
    this.renderer.addClass(document.getElementById("cbp-spmenu-s3"), "cbp-spmenu-open");
    console.log(id, 'id here');
    let data = {
      user_id: id
    }
    console.log('data response', data)
    this.loading = true;
    this.u_ser.getuserbyid(data).subscribe(res => {
      this.loading=false;
      this.userName = res[0].fname;
      this.mailForm.patchValue({ to_id: res[0].tbl_user_id })
      console.log(res, 'response here')
    })

  }
  toggleEmployeesNav(to_id: any) {
    this.renderer.addClass(document.getElementById("cbp-spmenu-s2"), "cbp-spmenu-open");
    console.log(to_id, 'id here');
    let data = {
      tbl_employee_id: to_id
    }
    this.loading = true;
    this.ser.getEmployeeBy(data).subscribe(res => {
      this.loading=false;
      this.empName1 = res[0].emp_fname;
      this.empImg1 = res[0].emp_image;
      this.empType = res[0].emp_type;
      this.mailForm.patchValue({ to_id: res[0].tbl_employee_id });
      console.log(res, 'response here');

      this.getChatsByFromIdAndToId()
    })
  }



  onSubmit(hint: string) {
    if (hint == 'emp_emp') {
      let data = {
        to_id: this.mailForm.controls.to_id.value,
        message: this.mailForm.controls.message.value,
        chat_type: 'emp_emp',
        from_id: this.mailForm.controls.from_id.value
      }
      console.log('MDATA-----', data)
      this.loading = true;
      this.chat_ser.addChat(data).subscribe(res => {
        this.loading=false;
        console.log('chat RES', res);
        this.allChat = [];
        this.allChat = res;
      })
    }
  }

  onSubmitUserChat(hint: string) {
    let data = {
      to_id: this.mailForm.controls.to_id.value,
      message: this.mailForm.controls.message.value,
      chat_type: 'user_emp',
      from_id: this.mailForm.controls.from_id.value
    }
    console.log('MDATA-----', data)
    this.loading = true;
    this.chat_ser.addChat(data).subscribe(res => {
      this.loading=false;
      console.log('chat RES', res);
      this.allChat = [];
      this.allChat = res;
      return
    })
  }



  getalluser() {
    this.loading = true;
    this.u_ser.getallusers().subscribe(res => {
      this.loading=false;
      console.log('all users', res);
      if (res != 'datanotfound') {
        this.allUsers = [];
        for (let i = 0; i < res.length; i++) {
          this.allUsers.push(res[i])
        }
        //  this.allUsers = res;
        console.log('users here', this.allUsers)
      }

    })
  }
  getAllEmployees() {
    this.loading = true;
    this.ser.getAllEmployee().subscribe(res => {
      this.loading=false;
      console.log('employees', res);
      if (res != 'datanotfound') {
        let myArray: any[] = res

        let dummyArr: any[] = myArray.filter(r => r.tbl_employee_id != this.mailForm.controls.from_id.value);

        this.allemployees = [];
        for (let i = 0; i < dummyArr.length; i++) {
          this.allemployees.push(dummyArr[i])
        }

        console.log('employees', this.allemployees)
      }

    })
  }
  logOut() {
    Swal.fire({
      title: 'Are you sure to logout?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.sessionStorage.clear('empId');
        this.router.navigate(['login'])
      }
    })

  }

  getChatsByFromIdAndToId() {
    let data = {
      to_id: this.mailForm.controls.to_id.value,
      chat_type: 'emp_emp',
      from_id: this.mailForm.controls.from_id.value
    }
    console.log(data, 'datafrom getchatby id')
    this.loading = true;
    this.chat_ser.getChatsByFromIdAndToId(data).subscribe(res => {
      this.loading=false;
      if (res != 'fail') {
        this.allChat = [];
        this.allChat = res;
        console.log('chats here', this.allChat);
      }
    })
  }
  getEmployeeById() {
    let id: any = this.sessionStorage.retrieve('empId');
    console.log('session userid', this.sessionStorage.retrieve('empId'));

    this.mailForm.patchValue({ from_id: id });
    console.log('ENM id++++++++', id)
    if (id) {
      this.empID = id;
      let data = {
        tbl_employee_id: id
      }
      this.loading = true;
      this.ser.getEmployeeBy(data).subscribe(res => {
        this.loading=false;
        console.log('HEADER ', res);
        this.empName = res[0].emp_fname;
        this.empImg = res[0].emp_image;
        // this.sendData(res[0].emp_type);
        this.empType = res[0].emp_type;
        this.passUserName(res[0]);
      })
    }
    else {
      this.toast.error('Seems your session is expired.');
      this.router.navigate(['/login']);
    }
  }

  checkSession() {
    const expirationTimestamp = this.localStorage.retrieve('expirationTimestamp');
  const currentTimestamp = Date.now();
  if (expirationTimestamp && currentTimestamp > expirationTimestamp) {
    // session has expired, clear the storage
    this.sessionStorage.clear();
    this.localStorage.clear();
    this.toast.error('Session expired.');
    this.router.navigate(['login']);
  }
    else {
      this.getEmployeeById();
      this.getAllEmployees();
      this.getalluser();
      this.startGettingNotifications();
    }
  }

  startGettingNotifications(): void {
    this.notificationSubscription = interval(2000).subscribe(() => {
      let data = {
        id: this.empID,
        type: this.empType
      };
      this.notificationSer.getNotifications(data).subscribe(res => {
        // console.log('msg', res);
        if (res !== 'noRecordFound' && res !== 'fail') {
          if(res.length>0){
               this.totalNotifications = res.length;
          if (res.length > 5) {
            this.allNotifications = res.splice(0, 5);
          }
          else {
            this.allNotifications = res;
          }
          }

        }
      });
    });
  }

  stopGettingNotifications(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }
  ngOnDestroy(): void {
    this.stopGettingNotifications();
  }

  readNotifications(msgid: any, hint: string) {
    let data = {
      toId: this.empID,
      notification_id: msgid,
      readType: hint
    };
    console.log('read notif', data);
    this.loading = true;
    this.notificationSer.readNotifications(data).subscribe(res => {
      this.loading=false;
      console.log('read notification response', res);
      if (res == 'fail') {
        alert('Please check your internet connection and reload page to proceed.')
      } else if (res == 'success') {
        // window.location.reload();
      }
    });
  }

}


