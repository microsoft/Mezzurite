import { Subject, timer as observableTimer } from "rxjs";
import { filter, merge, takeUntil } from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { Router, NavigationStart, NavigationEnd } from "@angular/router";
import { PerformanceTimingService, PerformanceTelemetryService, MezzuriteConstants} from "@ms/mezzurite-core";
import { MezzuriteAngularUtils } from "./performance-utils-angular.service";


/**
 * RoutingService is responsible for listening to the routing events coming
 * into the application and creating performance marks based on them.
 * @export
 * @class RoutingService
 */
@Injectable()
export class RoutingService {
    endCounter: number = 0;
    pageWasUnloaded$: Subject<string>;

    constructor(private router: Router) {
            this.pageWasUnloaded$ = new Subject<string>();
            if (!(<any>window).mezzurite){
                (<any>window).mezzurite = {};
            }
            MezzuriteAngularUtils.createMezzuriteObject((<any>window).mezzurite);
            (<any>window).mezzurite.routerPerf = true;
        }

    /* this method begins the listening process. Must be called for code to function properly. */
    start = (): any => {
        const onNavStart$ = (<any>this).router.events.pipe(filter(event => event instanceof NavigationStart));
        const onNavEnd$ = (<any>this).router.events.pipe(filter(event => event instanceof NavigationEnd));
        const userNavigatesAway$ = onNavStart$.pipe(merge(this.pageWasUnloaded$));

        onNavStart$.subscribe(() => {
            (<any>window).mezzurite.startTime = window.performance.now();
            if (!this.router.navigated) {
                window.performance.mark(MezzuriteConstants.altMarkEnd);
                window.performance.mark(MezzuriteConstants.vltMarkStart);
                var name: string = MezzuriteAngularUtils.getName(MezzuriteConstants.altName, MezzuriteAngularUtils.makeId());
                PerformanceTimingService.measure(name, 0, MezzuriteConstants.altMarkEnd);
            }
            else{
                window.performance.mark(MezzuriteConstants.vltMarkStart);
            }
            
        });

        onNavEnd$.subscribe((data:any) => {
            let alreadyCaptured = false;
            observableTimer(10000).pipe(
                takeUntil(userNavigatesAway$)
            ).subscribe(
            (val) => {
                // handle timeout case
                PerformanceTelemetryService.captureTimings();
                alreadyCaptured = true;
            },
            (e) => console.log("error: ",e),
            () => {
                if (!alreadyCaptured){
                    PerformanceTelemetryService.captureTimings(true);
                }
            })
        });
    };
}
