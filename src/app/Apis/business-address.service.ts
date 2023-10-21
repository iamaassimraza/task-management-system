import { Injectable } from '@angular/core';
import { OtherService } from './other.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BusinessAddressService {
  api_url=this.otherSer.apiBasePath+'businessAddresses.php?action=';
  constructor(private otherSer:OtherService, private http:HttpClient) { }

  getBusinessAddressDurationById(data:any):Observable<any>{
    return this.http.post(`${this.api_url}getBusinessAddressDurationById`,data)
  }

  getBusinessAddressByStateId(data:any):Observable<any>{
    return this.http.post(`${this.api_url}getBusinessAddressByStateId`,data)
  }
  AddBusinessAddress(data:any):Observable<any>{return this.http.post(`${this.api_url}AddBusinessAddress`,data)}
getAllBusinessAddresses():Observable<any>{return this.http.get(`${this.api_url}getAllBusinessAddresses`)}
getBusinessAddressById(data:any):Observable<any>{return this.http.post(`${this.api_url}getBusinessAddressById`,data)}
updateBusinessAddress(data:any):Observable<any>{return this.http.post(`${this.api_url}updateBusinessAddress`,data)}
deleteBusinessAddress(data:any):Observable<any>{return this.http.post(`${this.api_url}deleteBusinessAddress`,data)}

getBusinessAddressDurationByAddressId(data:any):Observable<any> {
  return this.http.post(`${this.api_url}getBusinessAddressDurationByAddressId`,data)
}

getBusinessAddressByCountryId(data:any):Observable<any> {
  return this.http.post(`${this.api_url}getBusinessAddressByCountryId`,data)
}
}
