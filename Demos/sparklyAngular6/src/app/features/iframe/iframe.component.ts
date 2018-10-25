import { OnInit, OnDestroy, Component } from '@angular/core';
import { AngularPerfBase, AngularPerformanceTelemetry } from '@des.epic.uscp.scripts/mezzurite.angular-dev/lib-esm/main';

declare var awa: any;
const componentName = 'our-iframe';

@AngularPerformanceTelemetry()
@Component({
    selector: componentName,
    templateUrl: './iframe.component.html'
})
export class IFrameComponent implements OnInit, OnDestroy, AngularPerfBase {
    cv: any;
    src: string;

    getName() {
        return componentName;
    }
    ngOnInit() {
    }
    ngOnDestroy() {
    }

    constructor() {
        this.cv = awa.cv.getValue();
        this.src = "http://sparklywebr2d2.uscpservices-prod-sn2.sn2.ap.gbl/spa";
    }
}
