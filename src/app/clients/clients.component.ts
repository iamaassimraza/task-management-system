import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { UserService } from '../Apis/user.service';
import { ToastrService } from 'ngx-toastr';
import { OtherService } from '../Apis/other.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../Apis/employee.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  toastr: any;
  imgBasePath: string
  constructor(private location: Location, private u_ser: UserService, private toast: ToastrService, private otherSer: OtherService, private emp_ser: EmployeeService) {
    this.imgBasePath = this.otherSer.imgUrl;
  }
  loading = true;
  hide = true;
  p: number = 1;
  hidepagination = true;
  no_record = false;
  totallength: number = 0;
  allUsers: any[] = [];
  filteredusers: any[] = []
  emp_id: any;
  emp_type: any;
  btn: string;
  arrayOfNumbers = Array(40).fill(0).map((x, i) => i + 1);
  allEmployee: any[] = [];
  chez = false;
  allState: any[] = [];
  allDepartment: any[] = [];
  tablelist: any[]= [1,2,3,4,5,6,7,8.9,10,11,12];
  //btn:any='Submit';
  cloudUpload = true;
  img_url: any;
  noClientsFound=false;
  ngOnInit(): void {
    this.getEmployeeById();




  }
  clientForm = new FormGroup({
    Description: new FormControl(null, [Validators.required]),
    Reason: new FormControl(null, [Validators.required]),

    tbl_user_id: new FormControl(null)

  })
  getEmployeeById() {
    this.emp_id = this.otherSer.sessionStorage.retrieve('empId');
    if (this.emp_id != null) {
      let data = {
        tbl_employee_id: this.emp_id
      }
      this.loading = true;
      this.emp_ser.getEmployeeBy(data).subscribe(res => {
        this.loading = false;
        console.log('employeeeeee iddd', res[0].tbl_employee_id);
        this.emp_type = res[0].emp_type
        console.log(this.emp_type, 'employeee typeee')
        if (this.emp_type == 'Team') {
          console.log('emppppppppppppppppppppp', this.emp_type)
          this.loading = true;
          this.emp_ser.getMangerClientsByManagerId(data).subscribe(res => {
            this.loading = false;
            console.log(res, 'team clients')
            if(res != 'fail'){
              this.noClientsFound=false;
                    this.allUsers = [];
            this.filteredusers=[];
         this.allUsers=res;
            this.filteredusers=this.allUsers;
            console.log(this.filteredusers, 'usersssssss heereeee')
            }
      else {
this.noClientsFound=true;
      }
          })
        }
        else if (this.emp_type == 'Admin') {
          this.getallusers();
        }

      })
    }
  }
  filterUsers(val: any) {
    if (val == 'all') {
      this.filteredusers = this.allUsers;
      return;
    }
    let filter_value = this.filteredusers = this.allUsers.filter(user => user.status === val);
    console.log(filter_value, 'value hereeee');

    return filter_value;

  }

  unBlockuser(id: any) {
    let data = {
      user_id: id
    }
    console.log('userid', data)
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, UnBlock it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.u_ser.unBlockUserById(data).subscribe(res => {
          this.loading = false;

          this.toast.success('Un Blocked Successfully!');
          this.getEmployeeById();
          //  window.location.reload();


        })
      }
    })

  }
  Blockuser(id: any) {
    let data = {
      user_id: id
    }
    console.log('userid', data)
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Block it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.u_ser.BlockUserById(data).subscribe(res => {
          this.loading = false;

          this.toast.success('Blocked Successfully!');
          this.getEmployeeById();
          //  window.location.reload();


        })
      }
    })
  }
  getallusers() {
    this.loading = true;
    this.u_ser.getallusers().subscribe(res => {
      this.loading = false;
      console.log('all clients', res);
      if(res != 'datanotfound'){
      this.allUsers = [];
      this.filteredusers = [];
      for (let i = 0; i < res.length; i++) {
        this.allUsers.push(res[i])
      }
      for (let i = 0; i < res.length; i++) {
        this.filteredusers.push(res[i])
      }
      }
    })
  }
  submit(e: any) {

  }
  edit(id: any) {

  }
  clearbox() {
    this.cloudUpload = true;
    this.btn = 'Submit'
    this.clientForm.reset()
    this.clientForm.patchValue({
      Description: null,
      Reason: null,
    })
  }
}
