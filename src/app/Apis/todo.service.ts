import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OtherService } from './other.service';
@Injectable({
  providedIn: 'root'
})
export class TodoService {


api_url= this.otherSer.apiBasePath+"task.php?action=";

data: any[] = [];
  constructor(private http: HttpClient, private otherSer:OtherService) { }

  getTaskById(data:any):Observable<any>{
    return this.http.post(`${this.api_url}getAllTasksByEmployerId`,data)
  }
  assignTask(data:any):Observable<any>{
    return this.http.post(`${this.api_url}assignTask`,data)
  }
  updateOrderServiceById(data:any):Observable<any>{
    return this.http.post(`${this.api_url}updateOrderServiceById`,data)
  }
  adminUpdateOrderServiceStatus(data:any):Observable<any>{
    return this.http.post(`${this.api_url}adminUpdateOrderServiceStatus`,data)
  }

}
