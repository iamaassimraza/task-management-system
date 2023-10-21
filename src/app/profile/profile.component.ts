
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../Apis/user.service';
import { EmployeeService  } from '../Apis/employee.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
// // import { OtherService } from '../other.service';
import { OtherService } from '../Apis/other.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  empID : any;
  user_name:any;
  user_email:any;
  user_image:any;
  data_string: any;
  password : any;
username: any;
emp_type: any;
  date:any;
  allState:any[]=[];

  allusers:any[]=[];
  cloudUpload = true;
  img_url: any;
  constructor(private ser : UserService,  private otherSer : OtherService, private toastr:ToastrService, private e_ser : EmployeeService){
 
    this.img_url=this.otherSer.imgUrl;
    
  }
  ngOnInit(): void {
    // console.log(this.empID, 'empID here');
    this.getuserbyid();
    this.getAllState();
    
  }
  userForm = new FormGroup({
    emp_fname : new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20) ]),
    emp_lname : new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    emp_email : new FormControl(null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    emp_phone_number: new FormControl(null),
    emp_address:new FormControl(null, [Validators.required,Validators.minLength(3), Validators.maxLength(20)]),
    emp_city: new FormControl(null, [Validators.required] ),
    emp_state : new FormControl(null),
    emp_type : new FormControl(null),
    emp_password : new FormControl(null),

    tbl_state_id: new FormControl(null, [Validators.required] ),
    emp_zipcode: new FormControl(null, [Validators.minLength(5)]),
    emp_username : new FormControl(null),
    emp_cnic : new FormControl(null),
    status: new FormControl(null, [Validators.required,Validators.minLength(8),Validators.maxLength(20)]),
    state_id: new FormControl(null),
    emp_timestamp:new FormControl(null),
    imageName : new FormControl(null),
    emp_image : new FormControl(null),
    tbl_employee_id:new FormControl(null ),
  })
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      console.log('GERE---------',file);
      this.otherSer.image1(file,'','employer_images').subscribe(res => {
        console.log('GERE---------',res);
        this.userForm.controls.imageName.patchValue(res);
        this.user_image = this.userForm.controls.imageName.value,
        this.upload(this.userForm.value);
        this.getuserbyid();
      }
      )
    }
  }
upload(e:any): void{
  this.empID = this.otherSer.sessionStorage.retrieve('empId');
  let data = {
    emp_type : e.emp_type,
    emp_fname : e.emp_fname,
    emp_lname : e.emp_lname,
    emp_address : e.emp_address,
    emp_city : e.emp_city,
    emp_state : e.emp_state,
    emp_username:e.emp_username,
    emp_zipcode : e.emp_zipcode,
    emp_email : e.emp_email,
    emp_password : e.emp_password,
    emp_cnic : e.emp_cnic,
    emp_image: this.userForm.controls.imageName.value,
    emp_phone_number : e.emp_phone_number,
    tbl_employee_id: this.empID
  }
 
  console.log(data,'image from form');
  this.e_ser.updateEmployee(data).subscribe(res => {
console.log(res, 'imageupload')
// alert('image uploaded')
// this.getuserbyid();
  })
}
  getuserbyid(){
    this.empID = this.otherSer.sessionStorage.retrieve('empId');
    if(this.empID != null){
      let data = {
				tbl_employee_id : this.empID
			}
console.log(data,'empid here')
this.e_ser.getEmployeeBy(data).subscribe(res => {
  console.log(res,'response from employeeid');
  this.user_name = res[0].emp_fname,
  this.user_email = res[0].emp_email,
  this.user_image = res[0].emp_image;
  const  timestampparts = res[0].emp_timestamp.split(' ')
  const date = timestampparts[0]
  this.data_string = date
  this.userForm.patchValue({
    emp_type: res[0].emp_type,
        emp_fname: res[0].emp_fname,
        emp_lname: res[0].emp_lname,
        emp_address:res[0].emp_address,
        emp_city: res[0].emp_city,
        emp_state: res[0].emp_state,
        emp_zipcode: res[0].emp_zipcode,
        emp_email : res[0].emp_email,
        emp_password: res[0].emp_password,
        emp_cnic: res[0].emp_cnic,
        emp_phone_number: res[0].emp_phone_number,
        emp_username: res[0].emp_username,
        imageName:res[0].emp_image
        ,
        tbl_employee_id:res[0].tbl_employee_id
  })
  // console.log(this.employeeForm.controls.imageName.value)
  console.log(this.userForm)
})
    
}
        
    }

  submit(e:any){
    console.log('inside userForm', this.userForm.value)
  // console.log('employee type', this.userForm.controls.emp_type.value);
    let data = {
      emp_type : e.emp_type,
      emp_fname : e.emp_fname,
      emp_lname : e.emp_lname,
      emp_address : e.emp_address,
      emp_city : e.emp_city,
      emp_state : e.emp_state,
      emp_username:e.emp_username,
      emp_zipcode : e.emp_zipcode,
      emp_email : e.emp_email,
      emp_password : e.emp_password,
      emp_cnic : e.emp_cnic,
      emp_image: this.userForm.controls.imageName.value,
      emp_phone_number : e.emp_phone_number,
      tbl_employee_id: e.tbl_employee_id
    }
    console.log('data hereeeeeeeeeeeeeeee', data)
  
    this.e_ser.updateEmployee(data).subscribe(res=>{
      console.log(res,'response from update employee here')
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Your work has been saved',
        showConfirmButton: false,
        timer: 4000
      })
      this.getuserbyid();
    })
  

   
  }
  getAllState(){
    this.otherSer.getAllStates().subscribe(res =>{
      // console.log(res,'===')
      this.allState = [];
      for(let i=0; i<res.length; i++){
        this.allState.push(res[i])
  
      }
      console.log(this.allState,'klklkl')
    })
  }
}
