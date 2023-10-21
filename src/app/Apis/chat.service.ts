import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OtherService } from './other.service';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  api_url= this.otherSer.apiBasePath+"chat.php?action=";

  constructor(private http: HttpClient, private otherSer:OtherService ) { }
    addChat(data:any):Observable<any>{
      return this.http.post(`${this.api_url}addChat`,data)
    }
 
    getChatsByFromIdAndToId(data:any):Observable<any>{
      return this.http.post(`${this.api_url}getChatsByFromIdAndToId`,data)
    }

}
