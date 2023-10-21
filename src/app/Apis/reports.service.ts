import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OtherService } from './other.service';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  api_url= this.otherSer.apiBasePath+"reports.php?action=";
  data: any[] = [];
  constructor(private http: HttpClient, private otherSer:OtherService) { }

//Blogs
add_blog(data:any):Observable<any>{return this.http.post(`${this.api_url}addBlog`,data)}
getAllTasksLog():Observable<any>{return this.http.get(this.api_url+'getAllTasksLog')}

getAllEmployeesWithOrdersCount():Observable<any>{
return this.http.get(this.api_url+'getAllEmployeesWithOrdersCount')
}
dailyProgressReport(data:any):Observable<any>{
  return this.http.post(`${this.api_url}dailyProgressReport`, data)
}
ordersProgressReport(data:any):Observable<any>{
  return this.http.post(`${this.api_url}ordersProgressReport`, data)
}
getAllTopDemandedProducts():Observable<any>{
 return this.http.get(this.api_url+'getAllTopDemandedProducts')
}
update_blog(data:any):Observable<any>{return this.http.post(`${this.api_url}updateBlog`,data)}
delete_blog(data:any):Observable<any>{return this.http.post(`${this.api_url}deleteBlog`,data)}
}
