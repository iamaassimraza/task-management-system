import { Injectable } from '@angular/core';
import { interval,take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OtherService } from './other.service';
@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  api_url=this.otherSer.apiBasePath+'notifications.php?action=';

  constructor(private http:HttpClient, private otherSer:OtherService) { }
  callFunctionEveryFiveSeconds(): void {
    const source = interval(5000); // Interval of 5000 milliseconds (5 seconds)
    source.pipe(take(10)).subscribe(() => {
      // Replace the following line with your desired function call or logic
      console.log('Function called every 5 seconds');
    });
  }
  
  getNotifications(data:any):Observable<any>{
  return  this.http.post(`${this.api_url}getNotifications`, data)
  }
  readNotifications(data:any):Observable<any>{
    return  this.http.post(`${this.api_url}readNotifications`, data)
    }

      getAllNotifications(data:any):Observable<any>{
        return  this.http.post(`${this.api_url}getAllNotifications`, data)
        }
 
}
