import { Input, Component } from '@angular/core';
import { AdalService } from 'adal-angular4';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html'
})
export class LoginComponent {
    @Input()
    name: string;

    constructor(private service: AdalService) {
        if (this.service && this.service.userInfo && this.service.userInfo.profile) {
            this.name = this.service.userInfo.profile.name;
        } else {
            this.name = 'user';
        }
    }
}
