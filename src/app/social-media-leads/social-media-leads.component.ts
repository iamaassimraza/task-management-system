import { Component } from '@angular/core';
import { SocialMediaService } from '../Apis/social-media.service';

@Component({
  selector: 'app-social-media-leads',
  templateUrl: './social-media-leads.component.html',
  styleUrls: ['./social-media-leads.component.css']
})
export class SocialMediaLeadsComponent {

  loading = true;
  tablelist: any[]= [1,2,3,4,5,6,7,8.9,10,11,12];

  facebookLeads:any[]=[];
constructor(private socialMediaSer:SocialMediaService){}
  ngOnInit(){
    this.getAllFacebookLeads();


  }

  getAllFacebookLeads(){
    this.loading = true;
    this.socialMediaSer.getFaceBookLeads().subscribe(res=>{
      this.loading=false;
      if(res !== 'noRecordFound'){
this.facebookLeads=[];
        this.facebookLeads=res;
        console.log(this.facebookLeads,'leads');
      }
    })
  }



}
