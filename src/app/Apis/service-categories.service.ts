import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OtherService } from './other.service';
@Injectable({
  providedIn: 'root'
})
export class ServiceCategoriesService {
  api_url= this.otherSer.apiBasePath+"servicesCategory.php?action=";
  data: any[] = [];
    constructor(private http: HttpClient, private otherSer:OtherService) { }
  
      allCategoriesOfServices():Observable<any>{
        return this.http.get(`${this.api_url}allCategoriesOfServices`)}
        allServicesByCategory():Observable<any>{
          return this.http.get(`${this.api_url}allServicesByCategory`)}  
        addCategoriesOfServices(data:any):Observable<any>{
          return this.http.post(`${this.api_url}addCategory`, data)}
}

