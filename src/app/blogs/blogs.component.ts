import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ServicesService } from '../Apis/services.service';
import { BlogsService } from '../Apis/blogs.service';
import { OtherService } from '../Apis/other.service';

//import Swal from 'sweetalert2';
@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent {
  constructor(private blogSer: BlogsService, private toastr: ToastrService, private http: HttpClient, private otherSer : OtherService ) { }
  btn_modal: string = 'save';
  p: number = 1;
  cloudUpload = true;
  totallength: number = 0;
  blog: any = [];
  allblogs: any[] = [];
  data: any = [];
  hidepaginatoin = true;
  no_record = false;
  postid: any = 0;
  fileName: any = '';
  img_url: any;

  ngOnInit(): void {
   this.getallblogs();
   this.img_url=this.otherSer.imgUrl;
  }

  blogForm = new FormGroup({

    blog_title: new FormControl(null, [Validators.required]),
    blog_description: new FormControl(null, [Validators.required]),
    // blog_image: new FormControl(null, [Validators.required]),
    posted_by: new FormControl(null, Validators.required),
    imageName:new FormControl(null),
 tbl_blog_id: new FormControl(null),
 
 image: new FormControl(null)

  });
  // form validation

 
  // form controls
  getallblogs(){
    this.btn_modal='Save'

    this.blogSer.getallblogs().subscribe(res=>{

      console.log('All blogs',res)

      if(res!='datanotfound'){
      this.allblogs = [];
      for(let i=0; i<res.length; i++){
        this.allblogs.push(res[i]);
      }
    }
    else if (res=='datanotfound'){
      this.hidepaginatoin=false;
      this.no_record=true
    }

    })
  }

  onsubmit(d: any) {
    console.log('form values',this.blogForm.value)
    if(this.blogForm.invalid){
      this.blogForm.markAllAsTouched();
    
    this.toastr.error('Please Fill All Information');
return
    }
    
    let data = {
      blog_title: d.blog_title,
      posted_by: d.posted_by,
      blog_description: d.blog_description,
      blog_image: this.blogForm.controls.imageName.value,
    tbl_blog_id : d.tbl_blog_id

    }
   
    console.log(data, "blogData")
    if (this.btn_modal == 'Save') {
    
      this.blogSer.add_blog(data).subscribe(res => {
        console.log(res);
    
        this.toastr.success('Saved', 'Congratulations!');
     this.getallblogs();
      })
    }
    else if (this.btn_modal == 'Update') {
       
    let data = {
      blog_title: d.blog_title,
      posted_by: d.posted_by,
      blog_description: d.blog_description,
      blog_image: this.blogForm.controls.imageName.value,
    tbl_blog_id : d.tbl_blog_id

    }
   console.log(data, 'data when update here ')
  
    
      this.blogSer.update_blog(data).subscribe(res=>{
        console.log(res);
        this.toastr.success('Updated', 'Congratulations !');
     this.getallblogs();
      })
    }
  }

  //edit blog
  edit(d: any) {
    this.cloudUpload = false;
    this.btn_modal = 'Update'
    let data = {
      tbl_blog_id: d
    }
    this.blogSer.get_blog_id(data).subscribe(res => {
      console.log(res);
      this.blogForm.patchValue({
        blog_title: res[0].blog_title,
        blog_description: res[0].blog_description,
        imageName: res[0].blog_image,
        posted_by: res[0].posted_by,
        tbl_blog_id: res[0].tbl_blog_id,
      
      })
    })
  }
 

 
  

  delete_blog(e:any){
    let data ={
      tbl_blog_id: e
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
        this.blogSer.delete_blog(data).subscribe(res=>{
          console.log(res);
          if(res=="deleted"){
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Blog deleted.',
              showConfirmButton: false,
              timer: 1500,
            
            })
            this.getallblogs();
            // this.toastr.error('Record Deleted');
        
            
           
          }
              })
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })

  }
  onFileSelected(event: any) {
    console.log(event.target.files[0])
    const file: File = event.target.files[0];
    if (file) {
      this.otherSer.image1(file,'','blogs_images').subscribe(res => {
        console.log('GERE---------',res);
        this.blogForm.controls.imageName.patchValue(res);
        this.cloudUpload = false;
      })}}
      clearbox(){
        this.cloudUpload = true;
        this.btn_modal = 'Save'
        this.blogForm.reset()  
        this.blogForm.patchValue({
          
          blog_title: null,
          blog_description:null,
          imageName:null,
          posted_by:null,
          tbl_blog_id:null
        
        })
      }
}
