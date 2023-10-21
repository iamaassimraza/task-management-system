import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'admindashboard';
  loading = true;


async ngOnInit() {
    setTimeout(() => {
      // Once data is loaded, set loading to false to show the content
      this.loading = false;
    }, );
}

}
