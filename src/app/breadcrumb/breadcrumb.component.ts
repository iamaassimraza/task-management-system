import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { OtherService } from '../Apis/other.service';
import { EmployeeService } from '../Apis/employee.service';
import { SessionStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent {
@Output() passUserType = new EventEmitter<string>();
  pageTitle:any='';
  userType:any='';
  
  constructor(private router: Router, private sessionStorage:SessionStorageService, private otherSer:OtherService, private employeeSer:EmployeeService){
const url=this.router.url;
switch(url){
case'/':
this.pageTitle='Dashboard';
break;
case'/manager-dashboard':
this.pageTitle='Dashboard';
break;
case'/dashboard':
this.pageTitle='Dashboard';
break;
case'/testimonials':
this.pageTitle='Testimonials';
break;
case'/blogs':
this.pageTitle='Blogs';
break;
case'/packages':
this.pageTitle='Packages';
break;
case'/reports':
this.pageTitle='Reports';
break;
case'/orders':
this.pageTitle='Orders';
break;
case'/order-detail':
this.pageTitle='Order Detail';
break;
case'/todo':
this.pageTitle='To Do';
break;
case'/clients':
this.pageTitle='Clients';
break;
case'/employees':
this.pageTitle='Employees';
break;
case'/states':
this.pageTitle='States';
break;
case'/register-agent':
this.pageTitle='Register Agents';
break;
case'/commission-agents':
this.pageTitle='Commission Agents';
break;
case'/services':
this.pageTitle='Services';
break;
case'/forgot-password':
this.pageTitle='Forgot Password';
break;
case'/profile':
this.pageTitle='Profile';
break;
case '/business-address':
  this.pageTitle='Business Addresses';
break;
case '/notifications':
  this.pageTitle='Notifications';
break;
case '/social-media-leads':
  this.pageTitle='Social Media Leads';
break;
default:
this.pageTitle='Other';
break;
}
  }
ngOnInit(){
  this.getEmployeeById();
}
sendUserType(type:string){
  this.passUserType.emit(type);
}
getEmployeeById(){
  let id:any=this.sessionStorage.retrieve('empId');
console.log('ENM id++++++++', id)
  if(id){
    let data = {
      tbl_employee_id : id}
      this.employeeSer.getEmployeeBy(data).subscribe(res=>{
      console.log('HEADER ',res);
      this.userType = res[0].emp_type;
this.sendUserType(res)
    })
  }
  else if(!id){
    this.router.navigate(['/login']);
  }
}
}
