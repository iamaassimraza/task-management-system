import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OtherService } from './other.service';
@Injectable({
  providedIn: 'root'
})
export class SocialMediaService {

  api_url= "https://themashr.com/importExcelDataIntoDatabase/facebookAdsData.php";
data: any[] = [];
  constructor(private http: HttpClient, private otherSer:OtherService) { }

  getFaceBookLeads():Observable<any>{
    return this.http.get(`${this.api_url}`)
  }
  getServiceById(data:any):Observable<any>{
    return this.http.post(`${this.api_url}getServiceById`,data)
  }
  updateServiceById(data:any):Observable<any>{
    return this.http.post(`${this.api_url}updateServiceById`,data)
  }
  updateServiceStatusById(data:any):Observable<any>{return this.http.post(`${this.api_url}updateServiceStatusById`,data)}

  addServiceForClientDashboard(data:any):Observable<any>{
    return this.http.post(`${this.api_url}addServiceForClientDashboard`, data)}
}

