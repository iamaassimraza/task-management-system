import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OtherService } from './other.service';
import { SessionStorageService } from 'ngx-webstorage';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  api_url=this.otherSer.apiBasePath+"order.php?action=";
  data: any[] = [];
  allRejections:any[]=[];
  imgUrl="https://themashr.com/themashr_version1_apis/uploadedDocuments/";

  constructor(private SessionStorage:SessionStorageService,private http: HttpClient, private otherSer:OtherService ) { }

    //order
    getAllOrders():Observable<any>{return this.http.get(`${this.api_url}getAllOrders`)}
    getOrderById(data:any):Observable<any>{return this.http.post(`${this.api_url}getOrderById`,data)}
    updateOrderStatus(data:any):Observable<any>{return this.http.post(`${this.api_url}updateOrderStatus`,data)}
    deleteOrder(data:any):Observable<any>{return this.http.post(`${this.api_url}deleteOrder`,data)}
    getOrderByUserId(data:any):Observable<any>{return this.http.post(`${this.api_url}getOrderByUserId`,data)}
    getAllOrderStatus():Observable<any>{return this.http.get(`${this.api_url}getAllOrderStatus`)}
    getOrderStatusById(data:any):Observable<any>{return this.http.post(`${this.api_url}getOrderStatusById`,data)}
    getOrderServiceRejectionsById(data:any):Observable<any>{return this.http.post(`${this.api_url}getOrderServiceRejectionsById`,data)}

    deleteOrderServiceRejectionsById(data:any):Observable<any>{
      return this.http.post(`${this.api_url}deleteOrderServiceRejectionsById`,data)
    }
    getOrderServiceByOrderId(data:any):Observable<any>{
      return this.http.post(`${this.api_url}getOrderServiceByOrderId`,data)}
      updateOrderById(data:any):Observable<any>{
        return this.http.post(`${this.api_url}updateOrderById`,data)
      }

      updateOrderImages(data:any):Observable<any>{
        return this.http.post(`${this.api_url}updateOrderImages`,data)
      }
      updateCustomId(data:any):Observable<any>{
return this.http.patch(`${this.api_url}updateCustomId`, data)
      }
      updateOrderServiceCredentials(data:any):Observable<any>{
        return this.http.post(`${this.api_url}updateOrderServiceCredentials`, data)
              }


                      // Portal Apis
                      addOrder(data: any): Observable<any> {
                        return this.http.post(`${this.api_url}addOrder`, data)
                          .pipe(
                            catchError((error: any) => {
                              console.error('An error occurred:', error);
                              return throwError('Something went wrong');
                            })
                          );
                      }
        
                      image(myfile:File, id:any,file_type:any):Observable <any> {
                        var formdata= new FormData();
                        formdata.append('input_image',myfile);
                        formdata.append('id',id);
                        formdata.append('file_type',file_type);
                        return this.http.post(`${this.api_url}Uploadimage.php`,formdata)
                        console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaa',formdata)
                      }
                      get_why_choose_us() {
                        return this.http.get(this.api_url + 'get_why_choose_us')
                      }
                      get_order_by_order_id(data: any): Observable<any> {
                        return this.http.post(`${this.api_url}getOrderById`, data)
                      }
                      user_signup(data : any):Observable <any> {return this.http.post(`${this.api_url}login`,data)}
                      image1(myfile:File): Observable <any> {
                     var formdata= new FormData();
                     formdata.append('input_image',myfile);
                     return this.http.post(`${this.api_url}Uploadimage`, formdata)}
        
        
        
                     getuserbyID(data:any):Observable<any>{
                      return this.http.post(`${this.api_url}getuserbyid`,data)
                    }
                    getorderbyID(data:any):Observable<any>{
                      return this.http.post(`${this.api_url}get_order_by_user_id`,data)
                    }
                    getstates():Observable<any>{
                      return this.http.get(`${this.api_url}getallstates`)
                    }
                    updateuser(data:any):Observable<any>{
                      return this.http.post(`${this.api_url}update_user_profile`,data)
                    }
        
                    getStateCityByzip(data:any):Observable<any>{
                      return this.http.post(`${this.api_url}get_city_state_by_zipcode`,data)
                    }
                    getOrderByID(data:any):Observable<any>{
                      return this.http.post(`${this.api_url}get_order_by_order_id`,data)
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

