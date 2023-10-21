import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ServicesService } from '../Apis/services.service';
import { BlogsService } from '../Apis/blogs.service';
import { OtherService } from '../Apis/other.service';
import { BusinessAddressService } from '../Apis/business-address.service';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { map, Observable, observable, startWith } from 'rxjs';
@Component({
  selector: 'app-business-address',
  templateUrl: './business-address.component.html',
  styleUrls: ['./business-address.component.css']
})
export class BusinessAddressComponent {
  btn_modal: string = 'save';
  p: number = 1;
  cloudUpload = true;
  totallength: number = 0;
  stateIsUK=false;
	display = 'none';

  allbuisnessaddress : any[] = [];
  filteredBuisnessAddress:any;
  allState:any[]=[];
  allCountries:any[]=[];
  filteredStates: any;

  searchedAddress:any;
  data: any = [];
  hidepaginatoin = true;
  no_record = false;
  postid: any = 0;
  fileName: any = '';
  img_url: any;
  filteredCountries: any[] = [];
  filteredUK: any[] = [];
  filteredUSA:any[] = [];
  filteredAll:any[] = [];
  activeFilter = false
  constructor(private b_ser : BusinessAddressService,private blogSer: BlogsService, private toastr: ToastrService, private http: HttpClient, private otherSer : OtherService ) {
   
    // this.filteredBuisnessAddress = this.myForm.controls[
    //   'tbl_state_id'
    // ].valueChanges.pipe(
    //   startWith(''),
    //   map((value) => this._filterStates(value || ''))
    // );
  
   }
//    myForm = new FormGroup({
 
//     tbl_state_id: new FormControl('', [Validators.required]),
   
//   });
// private _filterStates(value: any): any[] {
//   const filterValue = value.toLowerCase();
//   return this.filteredBuisnessAddress.filter((state:any) =>
//     state.state_name.toLowerCase().includes(filterValue)
//   );
// }


ngOnInit(): void {
  this.getAllState();
  this.getAllCountries();
  this.getallbuisnessaddress();
  this.img_url=this.otherSer.imgUrl;
 }

 
  addressForm = new FormGroup({

    tbl_state_id: new FormControl(null,[Validators.required]),
    yearly_address_fee: new FormControl(null, [Validators.required]),
    full_address:new FormControl(null,[Validators.required]),
    monthly_address_fee: new FormControl(null, [Validators.required]),
    refrence_website:new FormControl(null,[Validators.required]),
    tbl_address_id: new FormControl(null),
    tbl_country_id: new FormControl('', Validators.required)

  });
  // form validation

 
  // form controls
  getallbuisnessaddress(){
    this.btn_modal='Save'
    this.btn_modal='Update'
    this.b_ser.getAllBusinessAddresses().subscribe((res:any)=>{
      console.log('all addresses',res)
      if(res!='datanotfound'){
      this.allbuisnessaddress = [];
      this.allbuisnessaddress =res;
      
      this.filteredBuisnessAddress=this.allbuisnessaddress;
    }
    else{
      this.hidepaginatoin=false;
      this.no_record=true
    }

    })
  }
  onBlur(){
    this.activeFilter = !this.activeFilter;
  }
  // searchAddress(e:any){
  //   console.log('before filtered',e.target.value)
  //   this.filteredBuisnessAddress=this.allbuisnessaddress.filter(f => f.full_address === e.target.value);
  //   console.log('aftyer filtered',this.filteredBuisnessAddress)
    
  // }
  searchAddress(e: any) {
    const searchValue = e.target.value.toLowerCase();
    this.filteredBuisnessAddress = this.allbuisnessaddress.filter(
      (address) => address.full_address_id.toLowerCase().includes(searchValue)
    );
  }
  filterAddress(val: any) {
    console.log('sss',val);
    this.filteredBuisnessAddress=this.allbuisnessaddress.filter(f=>f.tbl_country_id == val);
    if(val === 'all'){
    this.filteredBuisnessAddress=this.allbuisnessaddress;
    }
  }
  getAllCountries(){
    this.otherSer.getAllCountries().subscribe(res=>{
      console.log('country',res)
    this.allCountries=[];
    this.allCountries=res;
    })
  }
  changeCountry(e:any){
    console.log('eeeeee', e);

    let c:any[]=this.allCountries.filter(o=> o.tbl_country_id === e.value);
    console.log('FILTERED',c);
    if(c[0].country_name === "UK"){
    this.stateIsUK=true
    this.addressForm.controls.tbl_state_id.clearValidators();
    this.addressForm.controls['tbl_state_id'].updateValueAndValidity();
    } else if(c[0].country_name != "UK"){
    this.stateIsUK=false
    this.addressForm.controls['tbl_state_id'].setValidators(Validators.required);
    this.addressForm.controls['tbl_state_id'].updateValueAndValidity();
    this.addressForm.controls.tbl_state_id.setValue(null);
    console.log('validatoes', this.addressForm.controls.tbl_state_id)
    }
      }

      openModal() {
        this.display = 'block';
      }
      onCloseModal() {
        this.display = 'none';
      }

  onSearchStates(val: any) {
    let v = val.target.value
    this.filteredStates = this.allState.filter(state => state.state_name.toLowerCase().indexOf(v.toLowerCase()) !== -1);
  }
  onsubmit(d: any) {
    console.log('form values',this.addressForm.value)
    if(this.addressForm.invalid){
      this.addressForm.markAllAsTouched();
    
    this.toastr.error('Please Fill All Information');
return
    }
    
    let data = {
      tbl_state_id: d.tbl_state_id,
        yearly_address_time_period: "year",
        yearly_address_fee: d.yearly_address_fee,
        monthly_address_time_period: "month",
        monthly_address_fee:d.monthly_address_fee,
        full_address : d.full_address,    
        refrence_website:d.refrence_website,
        tbl_country_id:d.tbl_country_id
    }
   
    console.log(data, "addressData")
    
    if (this.btn_modal == 'Save') {
    
      this.b_ser.AddBusinessAddress(data).subscribe(res => {
        console.log(res);
  
        this.toastr.success('Saved', 'Congratulations!');
     this.getallbuisnessaddress();
      })
    }
    else if (this.btn_modal == 'Update') {
       
      let data = {
        tbl_country_id: d.tbl_country_id,
        tbl_state_id: d.tbl_state_id,
        yearly_address_time_period: "year",
        yearly_address_fee: d.yearly_address_fee,
        monthly_address_time_period: "month",       
        monthly_address_fee:d.monthly_address_fee,
        full_address : d.full_address,    
        refrence_website:d.refrence_website,
        tbl_address_id:d.tbl_address_id,
  
      }
     
   console.log(data, 'data when update here ')
  
    
      this.b_ser.updateBusinessAddress(data).subscribe(res=>{
        console.log(res);
        this.toastr.success('Updated', 'Congratulations !');
     this.getallbuisnessaddress();
      })
    }
  }
  
  getAllState(){
    this.otherSer.getAllStates().subscribe(res =>{
      // console.log(res,'===')
      this.allState = [];
      this.filteredStates=[];
      for(let i=0; i<res.length; i++){
        this.allState.push(res[i])
      }
      this.filteredStates=this.allState;
      console.log(this.allState,'klklkl')
    })
  }
  //edit blog
  edit(d: any) {
    this.cloudUpload = false;
    this.btn_modal = 'Update'
    let data = {
      tbl_address_id: d
    }
    this.b_ser.getBusinessAddressById(data).subscribe(res => {
      console.log(res);
      this.addressForm.patchValue({
        tbl_state_id:res.tbl_state_id,
        yearly_address_fee: res.yearly_address_fee,
        monthly_address_fee:res.monthly_address_fee,
        full_address:res.full_address_id,
        refrence_website:res.refrence_website,
        tbl_address_id:res.tbl_address_id,
        tbl_country_id:res.tbl_country_id
      })
      console.log(this.addressForm.value, 'value after patch')
    })
  }
 

 
  

  delete_blog(e:any){
    let data ={
      tbl_address_id: e
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
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.b_ser.deleteBusinessAddress(data).subscribe(res=>{
          console.log(res);
          if(res=="success"){
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'record deleted.',
              showConfirmButton: false,
              timer: 1500,
            
            })
            this.getallbuisnessaddress();
            // this.toastr.error('Record Deleted');
        
            
           
          }
              })
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })

  }
 
      clearbox(){

        this.cloudUpload = true;
        this.btn_modal = 'Save'
        this.addressForm.reset()  
        this.addressForm.patchValue({
          
          tbl_state_id: null,
       
          yearly_address_fee: null,
              
          monthly_address_fee:null,
          full_address:null,
          tbl_address_id:null,
        
        })
        this.openModal();
      }
}


