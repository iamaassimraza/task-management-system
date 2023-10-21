import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OtherService } from './other.service';
@Injectable({
  providedIn: 'root'
})
export class RegisteredAgentsService {


  api_url= this.otherSer.apiBasePath+"register_agent.php?action=";

  data: any[] = [];
    constructor(private http: HttpClient, private otherSer:OtherService) { }
    getAllRegisterAgents():Observable<any>{
      return this.http.get(`${this.api_url}getAllRegisterAgents`)
    }
    AddRegisterAgent(data:any):Observable<any>{
      return this.http.post(`${this.api_url}AddRegisterAgent`,data)
    }
    GetRegisterAgentById(data:any):Observable<any>{
      return this.http.post(`${this.api_url}GetRegisterAgentById`,data)
    }
    updateRegisterAgent(data:any):Observable<any>{
      return this.http.post(`${this.api_url}updateRegisterAgent`,data)
    }
    deleteRegisterAgentById(data:any):Observable<any>{
      return this.http.post(`${this.api_url}deleteRegisterAgentById`,data)
    }
}

