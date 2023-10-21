import { Component, Injectable } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import Swal from 'sweetalert2';
import { OrderService } from '../Apis/order.service';
import { TodoService } from '../Apis/todo.service';
@Component({
  selector: 'app-bottom-sheetfor-rejections',
  templateUrl: './bottom-sheetfor-rejections.component.html',
  styleUrls: ['./bottom-sheetfor-rejections.component.css'],
})
export class BottomSheetforRejectionsComponent {
  data: any;
  Rejections: any[] = [];
  constructor(private orderSer: OrderService) {}
  ngOnInit() {
    this.allRejection();
    console.log('Rejections', this.Rejections);
  }
  allRejection() {
    this.Rejections = this.orderSer.allRejections;
    console.log('REJE', this.Rejections);
  }

  delete_rejection(id: any) {
    let data = {
      tbl_order_service_id: id,
    };
    this.orderSer.deleteOrderServiceRejectionsById(data).subscribe((res) => {
      console.log(res);
      if (res === 'deleted') {
        window.location.reload()
      }
    });
  }
}
