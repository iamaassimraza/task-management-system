import { Component  } from '@angular/core';
import { OtherService } from '../Apis/other.service';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { Observable } from 'rxjs';
  declare var require: any
const FileSaver = require('file-saver');
@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.css']
})
export class ServiceDetailComponent   {
  name:any;
  detail:any;
  docs:any[]=[];
  customId:any;
  imgBasePath: string;

constructor(private otherSer:OtherService,private http: HttpClient){
 this.detail= this.otherSer.serviceDetail;
 this.docs= this.otherSer.serviceDocs;
 this.name= this.otherSer.serviceName;
 this.customId=this.otherSer.customId;
 this.imgBasePath = this.otherSer.imgUrl;
 console.log(this.docs,this.customId, 'DOCS')
}
downloadPdf(pdfUrl: any, pdfName: any ) {
  let path=this.imgBasePath+pdfUrl+pdfName
  console.log('P', path, 'Name', pdfName);
  FileSaver.saveAs(path, pdfName);
  }
}
