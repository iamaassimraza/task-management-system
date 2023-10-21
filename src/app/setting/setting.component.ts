import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent {
myForm: FormGroup;




  packages = ['Monthly', 'Yearly', 'Quarterly'];

  constructor() {
   this.myForm = new FormGroup({
      logo: new FormControl(''),
      name: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      details: new FormControl(''),
      package: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}
}
