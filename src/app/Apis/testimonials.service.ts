import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OtherService } from './other.service';
@Injectable({
  providedIn: 'root'
})
export class TestimonialsService {

api_url= this.otherSer.apiBasePath+"testimonial.php?action=";

  data: any[] = [];
    constructor(private http: HttpClient, private otherSer:OtherService) { }
  
        //Testimonials
        getAllTestimonials():Observable<any>{return this.http.get(`${this.api_url}getAllTestimonials`)}
        addTestimonial(data:any):Observable<any>{return this.http.post(`${this.api_url}addTestimonial`,data)}
        updateTestimonial(data:any):Observable<any>{return this.http.post(`${this.api_url}updateTestimonial`,data)}
        getTestimonialById(data:any):Observable<any>{return this.http.post(`${this.api_url}getTestimonialById`,data)}
        deleteTestimonial(data:any):Observable<any>{return this.http.post(`${this.api_url}deleteTestimonial`,data)}

}
 