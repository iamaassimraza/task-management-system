import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionStorageService } from 'ngx-webstorage';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class OtherService {

  apiBasePath = "https://themashr.com/themashr_Devversion_apis/";
  getApi = this.apiBasePath + "getApis.php?action="
  imgApi = "https://themashr.com/themashr_Devversion_apis/";
  imgUrl = "https://themashr.com/themashr_Devversion_apis/uploadedDocuments/";
  serviceDetail: any = '';
  serviceDocs: any[] = [];
  serviceName: any = '';
  customId: any = '';
  sessionStorage: any = this.SessionStorage;
  constructor(private http: HttpClient, private SessionStorage: SessionStorageService) {
    console.log(this.serviceDetail)
  }

  getAllStates(): Observable<any> {
    return this.http.get(`${this.getApi}getAllStates`)
  }
  getStateById(data: any): Observable<any> {
    return this.http.post(`${this.getApi}getStateById`, data)
  }
  updateStateById(data: any): Observable<any> {
    return this.http.post(`${this.getApi}updateStateById`, data)
  }
  getAllCountries(): Observable<any> {
    return this.http.get(`${this.getApi}getAllCountries`)
  }
  getStateByCountry(data: any): Observable<any> {
    return this.http.post(`${this.getApi}getStateByCountry`, data)
  }

  // Image Api
  image1(myfile: File, id: any, file_type: any): Observable<any> {
    var formdata = new FormData();
    formdata.append('input_image', myfile);
    formdata.append('id', id);
    formdata.append('file_type', file_type);
    return this.http.post(`${this.apiBasePath}UploadCompanyDocuments.php`, formdata)
  }

  image(myfile: File, id: any, file_type: any): Observable<any> {
    var formdata = new FormData();
    formdata.append('input_image', myfile);
    formdata.append('id', id);
    formdata.append('file_type', file_type);
    return this.http.post(`${this.imgApi}Uploadimage.php`, formdata)
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaa', formdata)
  }


  downloadPdf(path: any, name: any): Observable<Blob> {
    let filePath = this.imgUrl + path + name;
    const headers = new HttpHeaders().append('Content-Type', 'application/pdf');
    return this.http.get<Blob>(filePath, { headers, responseType: 'blob' as 'json' }).pipe(
      catchError(this.handleError)
    );
  }

  updateClientImages(data: any): Observable<any> {
    return this.http.post(`${this.apiBasePath}updateClientImages`, data)
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred due to client side:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }

}
