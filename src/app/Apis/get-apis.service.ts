import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpErrorResponse  } from '@angular/common/http';
import { Observable,Subject,interval   } from 'rxjs';
import { SessionStorageService } from 'ngx-webstorage';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { takeWhile, map } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material/dialog';
import { timer } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class GetApisService {
  apiBasePath="https://themashr.com/themashr_version1_apis/";
  api_url = this.apiBasePath+"getApis.php?action="
  imgApi="https://themashr.com/themashr_version1_apis/";
  imgUrl="https://themashr.com/themashr_version1_apis/uploadedDocuments/";
serviceDetail:any='';
serviceDocs:any[]=[];
serviceName:any='';
customId:any='';
sessionStorage:any=this.SessionStorage;
constructor(private http: HttpClient, private SessionStorage:SessionStorageService) {
  console.log(this.serviceDetail)
 }
 private selectedCountrySubject = new Subject<string>();
 selectedCountry$: Observable<string> = this.selectedCountrySubject.asObservable();
  setSelectedCountry(selectedCountry: string): void {
    this.selectedCountrySubject.next(selectedCountry);
    console.log('Inside ser', this.selectedCountrySubject);
  }

  getallentity(): Observable<any> {
    return this.http.get(this.api_url +'getAllEntity');
  }
  getallstates(): Observable<any> {
    return this.http.get(this.api_url + 'getAllStates');
  }
  getAllCountries(): Observable<any> {
    return this.http.get(this.api_url + 'getAllCountries');
  }
  getstatebyid(data: any): Observable<any> {
    return this.http.post(`${this.api_url}getStateById`, data)
  }
  getAllBusinesses() {
    return this.http.get(this.api_url + 'getAllBusinesses')
  }
  getBusinessById(data: any): Observable<any> {
    return this.http.post(`${this.api_url}getBusinessById`, data)
  }
  getEntityById(data: any): Observable<any> {
    return this.http.post(`${this.api_url}getEntityById`, data)
  }
  getStateByCountry(data: any): Observable<any> {
    return this.http.post(`${this.api_url}getStateByCountry`, data)
  }
  countUpTo1(max: number): Observable<number> {
    return interval(1).pipe(
      map((i) => i + 1),
      takeWhile((i) => i <= max)
    );
  }
  countUpTo2(start: number, max: number, interval: number = 10): Observable<number> {
    const steps = Math.ceil((max - start) / (interval / 10));
    return timer(0, interval).pipe(
      map((i) => Math.ceil(((i / steps) * (max - start)) + start)),
      takeWhile((i) => i <= max)
    );
  }

  countUpTo(start: number, max: number, duration: number): Observable<number> {
    const interval = (duration * 1000) / (max - start + 1);
    return timer(0, interval).pipe(
      map((i) => Math.ceil(((i + 1) * (max - start + 1)) / duration - 1)),
      takeWhile((i) => i <= max)
    );
  }
}
