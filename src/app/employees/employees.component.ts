import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, ViewChild, } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { EmployeeService } from '../Apis/employee.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { OtherService } from '../Apis/other.service';
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { EmployeeModalComponent } from '../employee-modal/employee-modal.component';

// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
declare var google: any;

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
})
export class EmployeesComponent {

  @ViewChild('emp_address') emp_addressField!: ElementRef;
  toastr: any;
  constructor(public dialog: MatDialog, private ser: EmployeeService, private toast: ToastrService, private otherSer: OtherService) { }
  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(EmployeeModalComponent, {
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
  hide = true;
  loading = true;
  tablelist: any[]= [1,2,3,4,5,6,7,8.9,10,11,12];
  allEmployee: any[] = [];
  chez = false;
  allState: any[] = [];
  allDepartment: any[] = [];
  btn: any = 'Submit';
  cloudUpload = true;
  img_url: any;
  empType: any = '';

  ngOnInit(): void {
    // this.loading=true;
    // return
    this.img_url = this.otherSer.imgUrl;
    console.log('MY FORM', this.employeeForm);




  }

  initializeEmployeeAddress(): void {
    this.emp_addressField.nativeElement.setAttribute('autocomplete', 'off');
    if (this.emp_addressField?.nativeElement) {
      const autocomplete = new google.maps.places.Autocomplete(this.emp_addressField.nativeElement, {
        fields: ["address_components", "geometry"],
        types: ["address"],
      });
      this.emp_addressField.nativeElement.focus();
      autocomplete.addListener("place_changed", () => {
        this.fillInAddress(autocomplete, 'emp_addressField');
      });
    }
  }

  fillInAddress(autocomplete: any, hint: string) {
    const place = autocomplete.getPlace();
    let address1 = "";
    let postcode = "";
    for (const component of place.address_components) {
      const componentType = component.types[0];
      console.log('For loop', componentType)
      switch (componentType) {
        case "street_number": {
          address1 = `${component.long_name} ${address1}`;
          break;
        }
        case "route": {
          address1 += component.short_name;
          break;
        }
        case "postal_code": {
          postcode = `${component.long_name}${postcode}`;
          break;
        }
        case "postal_code_suffix": {
          postcode = `${postcode}-${component.long_name}`;
          break;
        }
        case "locality": {
          if (hint == 'emp_addressField') {
            this.employeeForm.controls.emp_city.setValue(component.long_name);
            // this.cd.detectChanges();
            // this.elementRef.nativeElement.dispatchEvent(new Event('input'));
          }
          break;
        }
        case "administrative_area_level_1": {
          if (hint == 'emp_addressField') {
            this.employeeForm.controls.emp_state.setValue(component.short_name);
          }
          break;
        }
      }
    }
    if (hint == 'emp_addressField') {
      this.employeeForm.controls.emp_address.setValue(address1);
      this.employeeForm.controls.emp_zipcode.setValue(postcode);
    }
  }


  employeeForm = new FormGroup({
    emp_type: new FormControl(null, [Validators.required]),
    emp_fname: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    emp_lname: new FormControl(null, []),
    emp_address: new FormControl(''),
    emp_username: new FormControl(null, [Validators.required]),
    emp_city: new FormControl(''),
    emp_state: new FormControl(''),
    emp_zipcode: new FormControl(''),
    emp_email: new FormControl(null, [Validators.required]),
    emp_password: new FormControl(null, [Validators.required]),
    emp_cnic: new FormControl(null),
    emp_image: new FormControl(null,),
    imageName: new FormControl(null),
    emp_phone_number: new FormControl(null),
    tbl_employee_id: new FormControl(null)
  })


  getAllState() {
    this.loading = true;
    this.otherSer.getAllStates().subscribe(res => {
      this.loading = false;
      this.allState = [];
      for (let i = 0; i < res.length; i++) {
        this.allState.push(res[i])
      }
      console.log(this.allState, 'klklkl')
    })
  }
  onloggedInUserId(employeeType: any) {
    this.empType = employeeType.emp_type;
    console.log(this.empType,'type---');
    this.getAllEmployee();
  }
  getAllEmployee() {
    this.loading = true;
    this.ser.getAllEmployee().subscribe(res => {
      this.loading = false;
      console.log('All employee', res);
      this.allEmployee = [];
      let dummy: any[] = [];
      dummy = res;
      if (this.empType === 'Admin') {
        this.allEmployee = dummy;
      }
      else if (this.empType === 'Manager') {
        this.allEmployee = dummy.filter(r => r.emp_type !== 'Admin')
      }
      console.log(this.allEmployee, 'ss')
    })
  }

  submit() {

    console.log('My form inside submit', this.employeeForm.value)
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      this.toast.error('Please Fill All Information');
      return
    }
let e:any=this.employeeForm.value;
    let data = {
      emp_type: e.emp_type,
      emp_fname: e.emp_fname,
      emp_lname: e.emp_lname,
      emp_address: e.emp_address,
      emp_city: e.emp_city,
      emp_state: e.emp_state,
      emp_username: e.emp_username,
      emp_zipcode: e.emp_zipcode,
      emp_email: e.emp_email,
      emp_password: e.emp_password,
      emp_cnic: e.emp_cnic,
      emp_image: this.employeeForm.controls.imageName.value,
      emp_phone_number: e.emp_phone_number,
      tbl_employee_id: e.tbl_employee_id
    }

    if (this.btn == 'Submit') {
      this.loading = true;
      this.ser.addEmployee(data).subscribe(res => {
        this.loading = false;
        console.log('employee add',res);
        if (res == 'employee_add') {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Your work has been saved',
            showConfirmButton: false,
            timer: 4000
          })
          this.getAllEmployee()
        }
        else if (res == 'emailalreadyexists') {
          this.toast.error('Employee Email Already Exist.');
          return
        }
      })
    }
    else if (this.btn == 'Update') {
      console.log(data, '..')
      this.loading= true;
      this.ser.updateEmployee(data).subscribe(res => {
        this.loading = false;
        console.log(res);
        if (res == 'employee_update') {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Your work has been saved',
            showConfirmButton: false,
            timer: 4000
          })
          this.getAllEmployee()
          // window.location.reload();
        }
        else {
          this.toast.error('No Changes Are Saved');
        }
      })
    }
  }




  edit(id: any) {
    console.log(id)
    this.btn = 'Update';
    let data = {
      tbl_employee_id: id
    }
    this.loading = true;
    this.ser.getEmployeeBy(data).subscribe(res => {
      this.loading = false;
      console.log('emp by id', res);
      if (res[0].emp_type) {
        this.cloudUpload = false;
      }
      this.employeeForm.patchValue({
        emp_type: res[0].emp_type,
        emp_fname: res[0].emp_fname,
        emp_lname: res[0].emp_lname,
        emp_address: res[0].emp_address,
        emp_city: res[0].emp_city,
        emp_state: res[0].emp_state,
        emp_zipcode: res[0].emp_zipcode,
        emp_email: res[0].emp_email,
        emp_password: res[0].emp_password,
        emp_cnic: res[0].emp_cnic,
        emp_phone_number: res[0].emp_phone_number,
        emp_username: res[0].emp_username,
        imageName: res[0].emp_image
        ,
        tbl_employee_id: res[0].tbl_employee_id
      })

      console.log(this.employeeForm)
    })
  }

  deleteEmployee(id: any) {

    let data = {
      tbl_employee_id: id
    }

    // this.ser.deleteEmployee(data).subscribe(res=>{
    //   console.log(res);
    //   if(res == 'employee_delete'){
    //     this.getAllEmployee();
    //     this.toast.error('Record Deleted');
    //   }
    //   else{

    //   }
    // })

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
        this.ser.deleteEmployee(data).subscribe(res => {
          this.loading = false;
          console.log(res);
          if (res == 'employee_delete') {
            this.getAllEmployee();
            this.toast.error('Record Deleted');
          }
        })

      }
    })
  }


  clearbox() {
    // return
    this.cloudUpload = true;
    this.btn = 'Submit'
    this.employeeForm.reset()
    this.employeeForm.patchValue({
      emp_type: null,
      emp_fname: null,
      emp_lname: null,
      emp_address: null,
      emp_city: null,
      emp_state: null,
      emp_zipcode: null,
      emp_email: null,
      emp_password: null,
      emp_cnic: null,
      emp_phone_number: null,
      emp_username: null
    })
  }

  onFileSelected(event: any) {
    console.log(event.target.files[0])
    const file: File = event.target.files[0];
    if (file) {
      this.loading = true;
      this.otherSer.image1(file, '', 'employer_images').subscribe(res => {
        this.loading = false;
        console.log('GERE---------', res);
        this.employeeForm.controls.imageName.patchValue(res);
        this.cloudUpload = false;
      })
    }
  }




}
// @Component({
//   selector: 'dialog-animations-example-dialog',
//   templateUrl: 'dialog-animations-example-dialog.html',
//   standalone: true,
//   imports: [MatDialogModule, MatButtonModule],
// })
// export class DialogAnimationsExampleDialog {
//   constructor(public dialogRef: MatDialogRef<DialogAnimationsExampleDialog>) {}
// }
