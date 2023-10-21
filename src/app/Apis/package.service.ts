import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OtherService } from './other.service';



@Injectable({
  providedIn: 'root'
})
export class PackageService {
  api_url= this.otherSer.apiBasePath+"package.php?action=";
  url = "https://themashr.com/themashr_version2_apis/services.php?action="
  testPath=this.otherSer.apiBasePath+"packagetest.php?action=";
  test="http://localhost/PHPSESSION/login.php?action=";
    data: any[] = [];

  constructor(private http: HttpClient, private otherSer:OtherService) { }
   getAllServices():Observable<any>{
    return this.http.get(`${this.api_url}getAllServices`)
  }
  getAllPackages():Observable<any>{
    return this.http.get(`${this.api_url}getAllPackages`)
  }

  addPackages(data:any):Observable<any>{
    return this.http.post(`${this.api_url}addPackages`,data)
  }
  getPackageById(data:any):Observable<any>{
    return this.http.post(`${this.api_url}getPackageById`,data)
  }
  updatePackageById(data:any):Observable<any>{
    return this.http.post(`${this.api_url}updatePackageById`,data)
  }
  deletePackage(data:any):Observable<any>{
    return this.http.post(`${this.api_url}deletePackage`,data)
  }
 
 
}
