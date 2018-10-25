import { OnInit, OnDestroy, Component } from '@angular/core';
import { AngularPerfBase, AngularPerformanceTelemetry } from '@des.epic.uscp.scripts/mezzurite.angular-dev/lib-esm/main';
import { AdalService } from 'adal-angular4';

@AngularPerformanceTelemetry()
@Component({
    selector: 'app-scenario',
    templateUrl: './scenario.component.html',
    styleUrls: ['./scenario.component.css']
})

export class ScenarioComponent implements OnInit, OnDestroy, AngularPerfBase {
    // Inject the ADAL Services
    constructor(private service: AdalService) { }

    getName() {
        return 'scenario-component';
    }
    ngOnInit() {
        // Handle callback if this is a redirect from Azure
        this.service.handleWindowCallback();

        // Check if the user is authenticated. If not, call the login() method
        if (!this.service.userInfo.authenticated) {
            // this.service.login();
        }

        // Log the user information to the console
        // console.log('username ' + this.service.userInfo.username);

        // console.log('authenticated: ' + this.service.userInfo.authenticated);

        // console.log('name: ' + this.service.userInfo.profile.name);

        // console.log('token: ' + this.service.userInfo.token);

        // console.log(this.service.userInfo.profile);
    }

    ngOnDestroy() {
    }
}
