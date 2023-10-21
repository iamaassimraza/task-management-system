import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OtherService } from './other.service';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
	getAllOrders() {
		throw new Error('Method not implemented.');
	}

  api_url= this.otherSer.apiBasePath+"employer.php?action=";
testPath=this.otherSer.apiBasePath+"employertest.php?action=";
test="http://localhost/PHPSESSION/login.php?action=";
  data: any[] = [];



    constructor(private http: HttpClient, private otherSer:OtherService) { 

    }
  
    //employee
    getAllEmployee():Observable<any>{
      return this.http.get(`${this.api_url}getAllEmployees`)
    }

    employee_login(data: any): Observable<any> {
      return this.http.post(`${this.api_url}employee_login`, data)
    }
    logout(){
      return this.http.get(this.api_url+'logout')
    }
    addEmployee(data:any):Observable<any>{
      return this.http.post(`${this.api_url}add_employee`,data)
    }
    getEmployeeBy(data:any):Observable<any>{
      return this.http.post(`${this.api_url}getEmployeeById`,data)
    }
    updateEmployee(data:any):Observable<any>{
      return this.http.post(`${this.api_url}update_employee`,data)
    }
    deleteEmployee(data:any):Observable<any>{
      return this.http.post(`${this.api_url}delete_employee`,data)
    }
   
    getAllOrdersOfEmployee(data:any):Observable<any>{
      return this.http.post(`${this.api_url}getAllOrdersOfEmployee`,data)}
      
      getAllTodoOfEmployer(data:any):Observable<any>{
        return this.http.post(`${this.api_url}getAllTodoOfEmployer`,data)}
        getMangerClientsByManagerId(data:any):Observable<any>{
          return this.http.post(`${this.api_url}getMangerClientsByManagerId`,data)}
          managerDesboard(data:any):Observable<any>{
            return this.http.post(`${this.api_url}managerDesboard`,data)}

            adminDeshboard():Observable<any>{
              return this.http.get(this.api_url+'adminDeshboard')}

}
