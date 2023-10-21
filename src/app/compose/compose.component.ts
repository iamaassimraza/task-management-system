import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { EmployeeService } from '../Apis/employee.service';
import { UserService } from '../Apis/user.service';
import { ChatService } from '../Apis/chat.service';
import { single } from 'rxjs';
import { OtherService } from '../Apis/other.service';
@Component({
  selector: 'app-compose',
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.css']
})
export class ComposeComponent implements OnInit{
  selectedOption : string;
  allUsers: any[] = [];
  allemployees : any[] = [];
  toUsers:any[]=[];
  userID:any;
  empName:any;
  empImg :any;
  img_url: any;
  empID:any;
  btn:any='Send';
  fType='';
  to_type='';
  constructor(private u_ser: UserService, private e_ser :EmployeeService, private toast:ToastrService, private otherSer:OtherService, private chat_ser : ChatService ){

  }
  ngOnInit(): void {
    this.selectedOption = 'user';
    this.getEmployeeByID();

  }
  mailForm = new FormGroup(
    {
      userType: new FormControl(null, [Validators.required]),
      to_id: new FormControl(null, [Validators.required]),
      from_id: new FormControl(null, [Validators.required]),

      subject: new FormControl(null, [Validators.required]),
      message: new FormControl(null, [Validators.required]),
      chat_type: new FormControl('', []),

    }
  )
  getalluser(){
    this.u_ser.getallusers().subscribe(res => {
      console.log('all users', res);
      this.allUsers=[];
      this.allUsers = res;
    })
  }
  getAllEmployees(){
    this.e_ser.getAllEmployee().subscribe(res=>{
      console.log('employees', res);
   this.allemployees=[];
      this.allemployees = res;
    })
  }
  changeOption() {
    if (this.selectedOption === 'user'  ) {
      this.mailForm.patchValue({chat_type:'user_emp'});
      this.getalluser();
    } else if(this.selectedOption === 'employee') {
      this.mailForm.patchValue({chat_type:'emp_emp'});
      this.getAllEmployees();
    }
  }

  getEmployeeByID(){
		this.empID = this.otherSer.sessionStorage.retrieve('empId');
		if(this.empID != null){
			let data = {
				tbl_employee_id : this.empID
			}
			this.e_ser.getEmployeeBy(data).subscribe(res=>{
        console.log('HEADER EMPLOYEE BY ID',res);
    this.mailForm.patchValue({from_id:res[0].tbl_employee_id});
      })
		}
	}
  actions(e: any, oID:number) {
	//	this.taskForm.patchValue({orderID:oID})
		let val = e.target.value;
    let val1 = oID;
    console.log(val, 'value here')
    console.log(val1, 'id here')

	}

  onSelectOfToUser(e:any){
    console.log('jjjjj',e.target.value);
this.mailForm.patchValue({to_id:e.target.value})
console.log('aaaaaaa', this.mailForm.value);
      }
  
  submit(e:any){
    console.log('My form inside submit',this.mailForm.value)
    let data = {
      to_id : e.to_id,
      subject : e.subject,
      message : e.message,
      chat_type:e.chat_type,
      from_id:this.mailForm.controls.from_id.value
    }
    console.log('MDATA-----',data)

    this.chat_ser.addChat(data).subscribe(res=>{
      console.log('chat RES', res);
    })

    return
    let singleUaser:any[]= this.allemployees.filter(emp => emp.employee_id===this.mailForm.controls.to_id.value)
 if(singleUaser[0].emp_type!='user'){
  var uType='manager';
  alert(uType)
 }  
   
      if(this.mailForm.invalid){
        this.mailForm.markAllAsTouched();
        // console.log(i.target.id)
      this.toast.error('Please Fill All Information');
  return
      }
      // this.employeeForm.reset();
      // console.log(e.imageName)
  
  
  
      
  
     if( this.btn == 'Send'){
     
      this.chat_ser.addChat(data).subscribe(res=>{
        console.log(res);
        if(res == 'chat_add'){
          this.toast.success('Added Successfully!');     
        }
     
        else{
          this.toast.error('No Changes Are Saved');
        }
      })
     }
    }
  
  
}
