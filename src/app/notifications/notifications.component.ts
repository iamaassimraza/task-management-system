import { Component } from '@angular/core';
import { NotificationsService } from '../Apis/notifications.service';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {
  allNotifications: any[] = [];
  filteredNotifications: any[] = [];
  tablelist: any[]= [1,2,3,4,5,6,7,8.9,10,11,12];
  selectedStatus = 'all';
  activeFilter = false
  loading = true;
empID:any;
empDetail:any[]=[];
  myForm = new FormGroup({
    title: new FormControl('')
  })
  constructor(private notificationSer: NotificationsService) { }

  receiveUserType(data: any) {
    console.log('Data received in parent component:', data);
    if (data) {
      this.empDetail=data;
      this.getAllNotifications();
    }
  }
  getAllNotifications() {
    let data = {
      id: this.empDetail[0].tbl_employee_id,
      type: this.empDetail[0].emp_type
    };

    this.notificationSer.getAllNotifications(data).subscribe(res => {

      console.log('all notifications res', res);
      if (res !== 'noRecordFound' && res !== 'fail') {
        if (res != 'noRecordFound') {
          this.allNotifications = res;
          this.filteredNotifications = this.allNotifications;
          console.log('all notifications', this.allNotifications);
        }
      }
    });
  }
  filterNotifications(val: any) {
    const searchValue = val.target.value.toLowerCase();
    console.log(searchValue);
    this.filteredNotifications = this.allNotifications.filter(obj => obj.messageTitle.toLowerCase().includes(searchValue)
    );
  }
  readNotifications(msgid: any, hint: string) {
    let data = {
      toId: this.empDetail[0].tbl_employee_id,
      notification_id: msgid,
      readType: hint
    };
    console.log('read notif', data);
    this.notificationSer.readNotifications(data).subscribe(res => {
      console.log('read notification response', res);
      if (res == 'fail') {
        alert('somthing went wrong while reading messages.')
      } else if (res == 'success') {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 4000
        })
        this.getAllNotifications();
        // window.location.reload();
      }
    });
  }


ngOnInit(): void {
  setTimeout(() => {
    this.loading = false;
  }, 8000);

}



}
