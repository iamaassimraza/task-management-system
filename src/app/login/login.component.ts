import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../Apis/employee.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { LocalStorageService, SessionStorageService  } from 'ngx-webstorage';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  empID: any;
  show_password=false;
  invalidCredentials=false;
  loading = true;
  currentYear: number = new Date().getFullYear();
  constructor(private sessionStorage: SessionStorageService, private localStorage: LocalStorageService,
    private ser: EmployeeService, private router: Router, private toast: ToastrService) {
  }
  loginForm = new FormGroup({
    emp_username: new FormControl('', [Validators.required]),
    emp_password: new FormControl('', [Validators.required]),
  })
  console(){
  console.log('clicke')
  }
  login(e: any) {
    if (this.loginForm.valid) {
      let data = {
        emp_username: e.emp_username,
        emp_password: e.emp_password
      }
      this.ser.employee_login(data).subscribe(res => {
        console.log('Login module response', res)
        if (res != 'emailandpasswordwrong') {
          this.setSessionTime();
          this.sessionStorage.store('empId', res[0].tbl_employee_id);
          console.log('session userid', this.sessionStorage.retrieve('empId'));
            this.router.navigate(['/dashboard']);
        }
        else {
          this.invalidCredentials=true;
          return
        }
      })
    }
  }

  setSessionTime() {
    const expirationTime = 24 * 60 * 60 * 1000; // set expiration time to 1 day
    const expirationTimestamp = Date.now() + expirationTime;
    this.localStorage.store('expirationTimestamp', expirationTimestamp);
  }

  ngOnInit() {
    // this.loading = true;
    // return
    setTimeout(() => {

      this.loading = false;
    }, 8000);

   }



}
