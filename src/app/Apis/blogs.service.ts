import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OtherService } from './other.service';
@Injectable({
  providedIn: 'root'
})
export class BlogsService {
  api_url= this.otherSer.apiBasePath+"blog.php?action=";
  data: any[] = [];
  constructor(private http: HttpClient, private otherSer:OtherService) { }

//Blogs
add_blog(data:any):Observable<any>{return this.http.post(`${this.api_url}addBlog`,data)}
getallblogs():Observable<any>{return this.http.get(`${this.api_url}getAllBlogs`)}
get_blog_id(data:any):Observable<any>{return this.http.post(`${this.api_url}getBlogById`,data)}
update_blog(data:any):Observable<any>{return this.http.post(`${this.api_url}updateBlog`,data)}
delete_blog(data:any):Observable<any>{return this.http.post(`${this.api_url}deleteBlog`,data)}
}
