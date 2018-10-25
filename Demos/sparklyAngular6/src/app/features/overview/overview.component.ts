import { OnInit, OnDestroy, Component } from '@angular/core';
import { AngularPerfBase, AngularPerformanceTelemetry } from '@des.epic.uscp.scripts/mezzurite.angular-dev/lib-esm/main';
import { AdalService } from 'adal-angular4';

@AngularPerformanceTelemetry()
@Component({
    selector: 'overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.css']
})

export class overviewComponent implements OnInit, OnDestroy, AngularPerfBase {
    constructor(private service: AdalService){}
    getName() {
        return 'overview-component';
      }
      ngOnInit() {
        // This is needed to handle the call back from auth to know it's you after you login.
        // Without this it just loops to the unauth site.
        this.service.handleWindowCallback();

        if (!this.service.userInfo.authenticated) {
           this.service.login();
        }
      }
    
      ngOnDestroy() {
      }
}