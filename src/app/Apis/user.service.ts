import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OtherService } from './other.service';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  api_url = this.otherSer.apiBasePath + "user.php?action=";
  data: any[] = [];
  constructor(private http: HttpClient, private otherSer: OtherService) { }

  getuserbyid(data: any): Observable<any> {
    return this.http.post(`${this.api_url}getuserbyid`, data)
  }
  getUser(data: any): Observable<any> {
    return this.http.post(`${this.api_url}getuserbyid`, data)
  }
  getallusers(): Observable<any> {
    return this.http.get(`${this.api_url}getallusers`)
  }
  BlockUserById(data:any): Observable<any> {
    return this.http.post(`${this.api_url}blockUserById`, data)
  }
  unBlockUserById(data : any): Observable<any> {
    return this.http.post(`${this.api_url}unBlockUserById`, data)
  }
  updateClientImages(data:any):Observable<any>{
    return this.http.post(`${this.api_url}updateClientImages`,data)
  }
}

