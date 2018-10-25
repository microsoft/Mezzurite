import { Component } from '@angular/core';
import { AdalService } from 'adal-angular4';

const config = {                         // <-- ADD
  tenant: 'microsoft.onmicrosoft.com',                      // <-- ADD
  clientId: 'fea43280-0359-4b49-ba2e-e13674d0bdd1'    // <-- ADD
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  constructor(private service: AdalService) {      // <-- ADD
    this.service.init(config);                      // <-- ADD
  }

  logOut() {
    this.service.logOut();
  }
}
