import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ComissionAgentsService } from '../Apis/comission-agents.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { OtherService } from '../Apis/other.service';
@Component({
  selector: 'app-comission-agents',
  templateUrl: './comission-agents.component.html',
  styleUrls: ['./comission-agents.component.css']
})
export class ComissionAgentsComponent {
  toastr: any;
  constructor(private ser: ComissionAgentsService,private toast:ToastrService,private otherSer: OtherService){}
  hide = true;
  allAgents:any[]=[];
  arrayOfNumbers = Array(40).fill(0).map((x,i) => i + 1);
  tablelist: any[]= [1,2,3,4,5,6,7,8.9,10,11,12];
  loading = true;
  btn:any='Save';
  cloudUpload = true;
  img_url: any;
  ngOnInit():void{
    this.getAllCommissionAgents();
    this.img_url=this.otherSer.imgUrl;
  console.log('MY FORM',this.agentForm)




  }


  agentForm = new FormGroup({
    commission_agent_fname: new FormControl(null, [Validators.required]),
    commission_agent_lname: new FormControl(null),
    commission_agent_address: new FormControl(null),
    agent_commission:new FormControl(null,[Validators.required]),

    commission_agent_email:new FormControl(null, [Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    commission_agent_phone_number: new FormControl(null,[Validators.required]),
    // tbl_department_id: new FormControl(null,),
    tbl_commission_agent_id: new FormControl(null)

  })

getAllCommissionAgents(){
  this.loading = true;
  this.ser.getAllCommissionAgents().subscribe(res => {
    this.loading=false;
    if(res != 'fail'){
          this.allAgents = [];
   this.allAgents=res;
    }
  })
}

submit(e:any){
  if(this.agentForm.invalid){
    this.agentForm.markAllAsTouched();

  this.toast.error('Please Fill All Information');
return
  }

  let data = {
    commission_agent_fname : e.commission_agent_fname,
    commission_agent_lname : e.commission_agent_lname,
    commission_agent_address : e.commission_agent_address,
    commission_agent_email : e.commission_agent_email,
    commission_agent_phone_number : e.commission_agent_phone_number,
    agent_commission : e.agent_commission,
    tbl_commission_agent_id: e.tbl_commission_agent_id
  }
  if( this.btn == 'Save'){
   this.loading = true;
    this.ser.AddCommissionAgent(data).subscribe(res=>{
      this.loading=false;
      console.log(res);
      if(res == 'success'){
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 4000
        })
        this.getAllCommissionAgents()
      }
    })
   }
   else if( this.btn == 'Update'){
    console.log(data, '..')
    this.loading = true;
    this.ser.updateCommissionAgent(data).subscribe(res=>{
      this.loading=false;
      console.log(res);
      if(res == 'success'){
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 4000
        })
        this.getAllCommissionAgents()


      }
      else{
        this.toast.error('No Changes Are Saved');
      }
    })
   }
}
edit(id:any){
  console.log(id)

  this.btn = 'Update';
  let data={
    tbl_commission_agent_id:id

  }
  console.log(data)
  this.loading = true;
  this.ser.GetCommissionAgentById(data).subscribe(res=>{
    this.loading = false;
    console.log(res);
    this.cloudUpload = false;
    this.agentForm.patchValue({

      commission_agent_fname: res[0]. commission_agent_fname,
      commission_agent_lname: res[0]. commission_agent_lname,
      commission_agent_address:res[0]. commission_agent_address,
      agent_commission:res[0].agent_commission,
      commission_agent_email : res[0]. commission_agent_email,
      commission_agent_phone_number: res[0]. commission_agent_phone_number,
      tbl_commission_agent_id:res[0].tbl_commission_agent_id
    })
    // console.log(this.agentForm.controls.imageName.value)
    console.log(this.agentForm)
  })
}
deleteAgent(id:any){
  let data = {
    tbl_commission_agent_id:id
  }

  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.loading = true;
      this.ser.deleteCommissionAgentById(data).subscribe(res =>{
        this.loading=false;
        console.log(res);
        if(res == 'success'){
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Your record has been deleted.',
            showConfirmButton: false,
            timer: 4000
          })
       window.location.reload();
        }
      })

    }
  })
}





  clearbox(){
    this.cloudUpload = true;
    this.btn = 'Save'
    this.agentForm.reset()
    this.agentForm.patchValue({

      commission_agent_fname: null,
      commission_agent_lname: null,
      commission_agent_address:null,
      agent_commission:null,
      commission_agent_email : null,
      commission_agent_phone_number:null,

    })
  }
}
