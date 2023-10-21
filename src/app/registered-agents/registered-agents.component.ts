import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { RegisteredAgentsService } from '../Apis/registered-agents.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { OtherService } from '../Apis/other.service';
@Component({
  selector: 'app-registered-agents',
  templateUrl: './registered-agents.component.html',
  styleUrls: ['./registered-agents.component.css'],
})
export class RegisteredAgentsComponent {
  toastr: any;
  constructor(
    private ser: RegisteredAgentsService,
    private toast: ToastrService,
    private otherSer: OtherService
  ) {}
  hide = true;
  loading = true;
  allAgents: any[] = [];
  tablelist: any[]= [1,2,3,4,5,6,7,8.9,10,11,12];
  arrayOfNumbers = Array(40)
    .fill(0)
    .map((x, i) => i + 1);
  allEmployee: any[] = [];
  chez = false;
  allState: any[] = [];
  allDepartment: any[] = [];
  btn: any = 'Save';
  cloudUpload = true;
  img_url: any;
  ngOnInit(): void {
    this.getAllRegisterAgents();

    this.img_url = this.otherSer.imgUrl;
    console.log('MY FORM', this.agentForm);



  }

  agentForm = new FormGroup({
    agent_fname: new FormControl(null, [
      Validators.required
    ]),
    agent_lname: new FormControl(null),
    agent_address: new FormControl(null),

    agent_email: new FormControl(null, [
      Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
    ]),
    agent_phone_number: new FormControl(null, [
      Validators.required,
    ]),
    // tbl_department_id: new FormControl(null,),
    tbl_agent_id: new FormControl(null),
  });

  getAllRegisterAgents() {
    this.loading=true;
    this.ser.getAllRegisterAgents().subscribe((res) => {
      this.loading=false;
      if(res !='fail'){
         this.allAgents = [];
    this.allAgents=res;
      }
    });
  }

  submit(e: any) {
    if (this.agentForm.invalid) {
      this.agentForm.markAllAsTouched();

      this.toast.error('Please Fill All Information');
      return;
    }

    let data = {
      agent_fname: e.agent_fname,
      agent_lname: e.agent_lname,
      agent_address: e.agent_address,
      agent_city: e.agent_city,

      agent_email: e.agent_email,

      agent_phone_number: e.agent_phone_number,
      tbl_agent_id: e.tbl_agent_id,
    };

    if (this.btn == 'Save') {
      this.loading=true;
this.ser.AddRegisterAgent(data).subscribe((res) => {
        this.loading=false;
        console.log(res);
        if (res == 'success') {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Your work has been saved',
            showConfirmButton: false,
            timer: 4000
          })

          this.getAllRegisterAgents();
        } else if (res == 'emailalreadyexists') {
          this.toast.warning('Employee Already Exist');
        }
      });
    } else if (this.btn == 'Update') {
      console.log(data, '..');
      this.loading = true;
      this.ser.updateRegisterAgent(data).subscribe((res) => {
        this.loading=false;
        console.log(res);
        if (res == 'success') {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Your work has been saved',
            showConfirmButton: false,
            timer: 4000
          })
          this.getAllRegisterAgents();
        } else {
          this.toast.error('No Changes Are Saved');
        }
      });
    }
  }

  edit(id: any) {
    console.log(id);

    this.btn = 'Update';
    let data = {
      tbl_agent_id: id,
    };
    console.log(data);
    this.loading = true;
    this.ser.GetRegisterAgentById(data).subscribe((res) => {
      this.loading=false;
      console.log(res);
      this.cloudUpload = false;
      this.agentForm.patchValue({
        agent_fname: res[0].agent_fname,
        agent_lname: res[0].agent_lname,
        agent_address: res[0].agent_address,

        agent_email: res[0].agent_email,
        agent_phone_number: res[0].agent_phone_number,
        tbl_agent_id: res[0].tbl_agent_id,
      });
      // console.log(this.agentForm.controls.imageName.value)
      console.log(this.agentForm);
    });
  }

  deleteEmployee(id: any) {
    let data = {
      tbl_agent_id: id,
    };

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.ser.deleteRegisterAgentById(data).subscribe((res) => {
          this.loading=false;
          console.log(res);
          if (res == 'success') {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Record Deleted',
              showConfirmButton: false,
              timer: 4000
            })
            window.location.reload();
          }
        });
      }
    });
  }

  clearbox() {
    this.cloudUpload = true;
    this.btn = 'Save';
    this.agentForm.reset();
    this.agentForm.patchValue({
      agent_fname: null,
      agent_lname: null,
      agent_address: null,

      agent_email: null,
      agent_phone_number: null,
    });
  }
}
