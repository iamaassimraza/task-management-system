import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OtherService } from './other.service';
@Injectable({
  providedIn: 'root'
})
export class ComissionAgentsService {

  api_url= this.otherSer.apiBasePath+"commissionAgent.php?action=";

  data: any[] = [];
    constructor(private http: HttpClient, private otherSer:OtherService) { }
    getAllCommissionAgents():Observable<any>{
      return this.http.get(`${this.api_url}getAllCommissionAgents`)
    }
    AddCommissionAgent(data:any):Observable<any>{
      return this.http.post(`${this.api_url}AddCommissionAgent`,data)
    }
    GetCommissionAgentById(data:any):Observable<any>{
      return this.http.post(`${this.api_url}GetCommissionAgentById`,data)
    }
    updateCommissionAgent(data:any):Observable<any>{
      return this.http.post(`${this.api_url}updateCommissionAgent`,data)
    }
    deleteCommissionAgentById(data:any):Observable<any>{
      return this.http.post(`${this.api_url}deleteCommissionAgentById`,data)
    }
}
