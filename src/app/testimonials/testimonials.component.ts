
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TestimonialsService } from '../Apis/testimonials.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OtherService } from '../Apis/other.service';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css']
})
export class TestimonialsComponent {
  constructor(private testimonialSer: TestimonialsService, private otherSer:OtherService, private toast: ToastrService, private http: HttpClientModule) { }
  btn_modal: any = 'Save';
  p: number = 1;
  totallength: number = 0;
  testimonial: any = [];
  allTestimonial: any = [];
  data: any = [];
  hidepaginatoin = true;
  no_record = false;
  postid: any = '';
  tablelist: any[]= [1,2,3,4,5,6,7,8.9,10,11,12];
  loading = true;
  img_url: any;

  star :any;
  star1 = true;
  star2 = true;
  star3 = true;
  star4 = true;
  star5 = true;
  cloudUpload = true;
  ngOnInit(): void {
    this.getAllTestimonials()
this.img_url=this.otherSer.imgUrl;


  }

  my_form = new FormGroup({
    testimonialDescription: new FormControl('', [Validators.required]),
    image: new FormControl(''),
    imageName: new FormControl(''),
    postBy: new FormControl('', Validators.required),
  rating: new FormControl('' ),
  tbl_testimonial_id:  new FormControl(''),

  });

  get testimonialDescription() {
    return this.my_form.get('testimonialDescription')
  }
  get image() {
    return this.my_form.get('image')
  }
  get postBy() {
    return this.my_form.get('postBy')
  }
  // get rating() {
  //   return this.my_form.get('rating')
  // }

  onSubmit(e:any) {
    let data = {
      // tbl_testimonial_id: this.postid,
      // detail: this.my_form.controls.testimonialDescription.value,
      // posted_by: this.my_form.controls.postBy.value,
      // image: this.my_form.controls.imageName.value,
      // star: this.my_form.controls.rating.value,
      tbl_testimonial_id: e.tbl_testimonial_id,
      detail: e.testimonialDescription,
      posted_by: e.postBy,
      image: this.my_form.controls.imageName.value,
      star: e.rating,
    }
    console.log(data)
  if(this.my_form.valid && this.btn_modal == 'Save' ){
     console.log(data, "mydata")
     this.loading = true;
     this.testimonialSer.addTestimonial(data).subscribe(res => {
      this.loading=false;
       console.log(res, "added")
       if(res == 'success'){
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1500
        })
        this.getAllTestimonials()

      }
      else if (res != 'success'){
        this.toast.warning('Testimonial not added');
      }
      })
   }

   else if (this.my_form.valid && this.btn_modal == 'Update'){
    this.loading = true;
     this.testimonialSer.updateTestimonial(data).subscribe(res => {
      this.loading=false;
       console.log(res, 'updated')
       if(res == 'updated'){
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1500
        })
        this.getAllTestimonials()
      }
      else if (res != 'updated'){
        this.toast.warning('Testimonial not updated');
      }

     })
   }
  else if(this.my_form.invalid){
    this.toast.error('Please Fill All the Information')
  }
  }

  editTestimonial(id: any) {
    this.cloudUpload = false;
    this.btn_modal = 'Update'
    this.postid = id
    // console.log(this.postid)
    let data = {
      tbl_testimonial_id: id,
    }
    // console.log(data)
    this.loading = true;
    this.testimonialSer.getTestimonialById(data).subscribe(res => {
      this.loading=false;
      console.log(res, "byid")
      let ree: any = res;
      this.my_form.patchValue({
        postBy: ree[0].posted_by,
        testimonialDescription: ree[0].detail,
        imageName:ree[0].image ,
        rating: ree[0].star,
        tbl_testimonial_id:ree[0].tbl_testimonial_id
     })
    })

  }
  deleteTestimonial(id: any) {
    let data = {
      tbl_testimonial_id: id,
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
        this.testimonialSer.deleteTestimonial(data).subscribe(res=>{
          this.loading=false;
          console.log(res,"deleted")
          if(res == 'deleted'){
              this.getAllTestimonials();
          }
         })
      }

    })
  }

  // onFileSelected(event: any) {
  //   const file: File = event.target.files[0];
  //   if (file) {
  //     this.otherSer.image1(file,'','testimonial_images').subscribe(res => {
  //       console.log('GERE---------',res);
  //       // this. = res;
  //       this.my_form.controls.imageName.patchValue(res);
  //       this.cloudUpload = false;
  //     })}}

  onFileSelected(event: any) {
    console.log(event.target.files[0])
    const file: File = event.target.files[0];
    if (file) {
      this.loading = true;
      this.otherSer.image1(file,'','testimonial_images').subscribe(res => {
        this.loading=false;
        console.log('GERE---------',res);
        this.my_form.controls.imageName.patchValue(res);
        this.cloudUpload = false;
      })}}

      getAllTestimonials() {
        this.loading = true;
    this.testimonialSer.getAllTestimonials().subscribe(res => {
      this.loading=false;
      let data: any = res;
      this.allTestimonial=[];
      for (let i = 0; i < data.length; i++) {
        this.allTestimonial.push(data[i])
      }
      console.log(this.allTestimonial, 'ssss')
    })
  }

  rate(e: any)
  {
    console.log(e.target.id)
    switch (e.target.id)
    {
      case '1':
        this.my_form.controls.rating.patchValue('1');
        this.star1 = true
        this.star2 = false
        this.star3 = false
        this.star4 = false
        this.star5 = false

        break;
      case '2':
        this.my_form.controls.rating.patchValue('2');
        this.star1 = true
        this.star2 = true
        this.star3 = false
        this.star4 = false
        this.star5 = false
        break;
      case '3':
        this.my_form.controls.rating.patchValue('3');
        this.star1 = true
        this.star2 = true
        this.star3 = true
        this.star4 = false
        this.star5 = false
        break;
      case '4':
        this.my_form.controls.rating.patchValue('4');
        this.star1 = true
        this.star2 = true
        this.star3 = true
        this.star4 = true
        this.star5 = false
        break;
      case '5':
        this.my_form.controls.rating.patchValue('5');
        this.star1 = true
        this.star2 = true
        this.star3 = true
        this.star4 = true
        this.star5 = true
        break;

        default:
          this.my_form.controls.rating.patchValue('5');
        this.star1 = true
        this.star2 = true
        this.star3 = true
        this.star4 = true
        this.star5 = true

    }

  }
  clearSearch(){
    this.btn_modal = 'Save'
    this.cloudUpload = true;
      this.my_form.patchValue({
        postBy: '',
        testimonialDescription: '',
        rating:'5',
        tbl_testimonial_id:''
     })
  }
}
