import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AdalService } from 'adal-angular4';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor (private service: AdalService, private router: Router) {
    }

    canActivate(): boolean {
        if (this.service
            && this.service.userInfo
            && !this.service.userInfo.authenticated) {
                this.router.navigateByUrl('');
                return false;
        } else {
            return true;
        }
    }
}
