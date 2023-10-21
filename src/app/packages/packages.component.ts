import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { PackageService } from '../Apis/package.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { OtherService } from '../Apis/other.service';
import { ServicesService } from '../Apis/services.service';
@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.css'],
})
export class PackagesComponent {
  // Variables
  hide = true;
  toastr: any;
  btn: string = 'Save';
  totalFee = 0;
  loading = true;

  // Arrays
  allPackage: any[] = [];
  usaPackages: any[] = [];
  ukPackages: any[] = [];
  allState: any[] = [];
  allDepartment: any[] = [];
  allServices: any[] = [];
  addOns: any[] = [];
  allCountries: any[] = [];
  overAllServices: any[] = [];
  temp: any[] = []; // Declare temp as a class-level variable
  country: any;
  cloudUpload = false;
  display = 'none';
  fee: string;
  constructor(
    private serPackages: PackageService,
    private toast: ToastrService,
    private otherSer: OtherService,
    private servicesSer: ServicesService
  ) { }
  packageForm = new FormGroup({
    tbl_pkg_id: new FormControl(null),
    pkg_title: new FormControl('', [Validators.required]),
    pkg_fee: new FormControl(''),
    pkg_detail: new FormControl('', [Validators.required]),
    pkg_includes: new FormControl(''),
    pkg_add_Ons: new FormControl<any>([]),
    pkg_services: new FormControl(''),
    country: new FormControl('', [Validators.required]),
  });
  ngOnInit(): void {
    this.getAllPackages();
    this.getAllServices();
    console.log('MY FORM', this.packageForm);
    this.getAllCountries();



  }
  getAllCountries() {
    this.loading = true;
    this.otherSer.getAllCountries().subscribe((res) => {
      this.loading=false;
      console.log('country', res);
      this.allCountries = [];
      this.allCountries = res;
    });
  }

  updateAddOnServices(Serid: number) {
    if (this.packageForm.controls.pkg_add_Ons.value) {
      this.temp = this.packageForm.controls.pkg_add_Ons.value;
      const itemIndex = this.temp.findIndex(ele => ele.tbl_service_id.toString() === Serid.toString());
      if (itemIndex === -1) {
        const newItem = this.overAllServices.find(ser => ser.tbl_service_id === Serid);
        if (newItem) {
          this.temp.push(newItem);
        }
      } else {
        this.temp.splice(itemIndex, 1);
      }
      this.packageForm.controls.pkg_add_Ons.reset(this.temp);
    }
  }

  getAllPackages() {
    this.loading = true;
    this.serPackages.getAllPackages().subscribe((res) => {
      this.loading=false;
      console.log('PACKAGEXS', res);
      this.allPackage = [];
      this.allPackage = res.packages;
      this.ukPackages = this.allPackage.filter(obj => obj.country == 'uk')
      this.usaPackages = this.allPackage.filter(obj => obj.country == 'usa')
    });
    console.log('pkg--', this.usaPackages);
  }
  getUSAIncludes(index: any) {
    if (index != undefined || index != null) {
      return this.usaPackages[index].pkg_includes.split(',')
    }
    else
      return
  }
  getUKIncludes(index: any) {
    if (index != undefined || index != null) {
      return this.ukPackages[index].pkg_includes.split(',')
    }
    else
      return
  }
  getAllServices() {
    this.loading = true;
    this.servicesSer.getAllServices().subscribe((res) => {
      this.loading=false;
      console.log('Services', res);
      this.overAllServices = res;
      let temp: any[] = [];
      temp = res;
      console.log('temp', temp);
      // Define an array of service names to filter
      const serviceNamesToFilter = [
        'serviceMashrEINwithSSN',
        'serviceMashrEINwithoutSSN',
        'serviceMashrResellerCertificate',
        'serviceMashrAmazon',
        'serviceMashrPayoneer',
        'serviceMashrWise'
      ];

      // Use the filter method to create a new array with matching services
      this.allServices = temp.filter((element) =>
        serviceNamesToFilter.includes(element.service_title)
      );
      console.log('here services', this.allServices);
    });
  }

  checkExistedServices(title: any) {
    let temp: any[] = [];
    if (this.packageForm.controls.pkg_add_Ons.value) {
      temp = this.packageForm.controls.pkg_add_Ons.value
    }
    if (temp.length > 0) {
      let serviceExists = false;
      temp.forEach(element => {
        if (element.service_title === title) {
          serviceExists = true

        }
      })
      return serviceExists
    }
    else {
      return false
    }
  }

  changeCountry(event: any) {
    console.log('ssssssssssssssss', event);
    this.country = event;

    // console.log('asasasd',this.packageForm.controls['counrty'].value);
  }
  submit(d: any) {
    console.log('form values', this.packageForm.value);
    if (this.packageForm.invalid) {
      this.packageForm.markAllAsTouched();
      this.toast.error('Please Fill All Information');
      return;
    }
    console.log('this faorm', this.packageForm.value);
    let data = {
      pkg_title: this.packageForm.controls['pkg_title'].value,
      pkg_fee: this.packageForm.controls.pkg_fee.value,
      pkg_includes: this.packageForm.controls['pkg_includes'].value,
      pkg_detail: this.packageForm.controls['pkg_detail'].value,
      pkg_services: this.packageForm.controls.pkg_add_Ons.value,
      country: this.packageForm.controls['country'].value,
      tbl_pkg_id: this.packageForm.controls.tbl_pkg_id.value
    };
    // console.log(data);
    if (this.btn == 'Save') {
      this.loading = true;
      this.serPackages.addPackages(data).subscribe((res) => {
        this.loading=false;
        console.log(res);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 500
        })

        this.getAllPackages();
      });
    } else if (this.btn == 'Update') {
      console.log(data, 'data when update here ');
      this.loading = true;
      this.serPackages.updatePackageById(data).subscribe((res) => {
        this.loading=false;
        console.log('pkg update', res);
        if (res === 'packageUpdated') {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Your work has been saved',
            showConfirmButton: false,
            timer: 4000
          })
          this.getAllPackages();

        }
      });
    }
  }
  edit(id: any) {
    this.btn = 'Update';
    let data = {
      tbl_pkg_id: id,
    };
    console.log('id', id);
    this.loading = true;
    this.serPackages.getPackageById(data).subscribe((res) => {
      this.loading=false;
      console.log('response', res);
      console.log('sss', res.package_services);
      this.packageForm.patchValue({
        tbl_pkg_id: res.package.tbl_pkg_id,
        pkg_title: res.package.pkg_title,
        pkg_fee: res.package.pkg_fee,
        pkg_includes: res.package.pkg_includes,
        pkg_detail: res.package.pkg_detail,
        pkg_services: res.package.included_services,
        country: res.package.country,
        pkg_add_Ons: res.package.package_services
      });
      console.log(this.packageForm.value, 'value after patch');
    });
  }

  deletePackage(id: any) {
    let data = {
      tbl_pkg_id: id,
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
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.loading = true;
        this.serPackages.deletePackage(data).subscribe((res) => {
          this.loading=false;
          console.log(res);
          if (res == 'success') {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Your work has been saved.',
              showConfirmButton: false,
              timer: 4000
            })
            this.getAllPackages();
          }
        });
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  }
  openModal() {
    this.display = 'block';
  }
  clearbox() {
    this.cloudUpload = true;
    this.btn = 'Save';
    this.totalFee = 0;

    this.addOns = []
    this.packageForm.reset();
    this.packageForm.patchValue({
      pkg_title: null,
      pkg_fee: null,
      pkg_includes: null,
      pkg_detail: null,
      pkg_services: null,
      country: null,
      pkg_add_Ons: null
    });
    this.openModal();
  }
}
