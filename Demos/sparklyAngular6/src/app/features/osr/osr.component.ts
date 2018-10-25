import { OnInit, OnDestroy, Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularPerfBase, AngularPerformanceTelemetry, instrument } from '@des.epic.uscp.scripts/mezzurite.angular-dev/lib-esm/main';

declare var awa: any;
const componentName = 'app-osr';

@AngularPerformanceTelemetry({autoMarkComponentComplete: false})
@Component({
    selector: componentName,
    templateUrl: './osr.component.html'
})
export class OsrComponent implements OnInit, OnDestroy, AngularPerfBase {
    colors: string[];
    targetUrl = 'http://sparklywebr2d2.uscpservices-prod-sn2.sn2.ap.gbl/Osr?sleep=5000';
    constructor(private http: HttpClient) {
    }

    getName() {
        return componentName;
    }
    ngOnInit() {
        // set the cv on the call out to the dependent service
        var cV = awa.cv.increment();

        
        const options = {
            headers: new HttpHeaders({
                'ms-cv': cV
            })
        };

        const startTime = performance.now();
        let endTime;
        // make external call
        this.http
        .get<string[]>(this.targetUrl, options)
        .pipe(instrument(this as Component))
        .subscribe((data: string[]) => {
            this.colors = data;
            endTime = performance.now();
            console.log('These are the colors: ' + data);

            const event = {
                name: 'Ms.Webi.OutgoingRequest',
                cV: cV,
                data: {
                        baseData: {
                            // operationName: requestOptions.currentOperationName || window.location.href,
                            operationName: 'osrInit',
                            // targetUri: targetUriOverrideCallbackFunction ? targetUriOverrideCallbackFunction(options.url) : options.url,
                            targetUri: this.targetUrl,
                            // latencyMs: timeTaken,
                            latencyMs: endTime - startTime,
                            // serviceErrorCode:
                            // (!isSuccess && jqXhr.responseJSON && jqXhr.responseJSON.code && !isNaN(jqXhr.responseJSON.code))
                            // ? jqXhr.responseJSON.code : -1,
                            serviceErrorCode: 200,
                            // succeeded: isSuccess,
                            succeeded: true,
                            // requestMethod: options.type,
                            requestMethod: 0,
                            // responseContentType: options.dataType,
                            // protocolStatusCode: jqXhr.status.toString(),
                            // dependencyOperationName: operationName,
                            dependencyOperationName: 'getColors',
                            // dependencyOperationVersion: requestOptions.version && requestOptions.version.toString(), 
                            dependenctOperationVersion: 1.0,
                            // dependencyName: requestOptions.serviceName,
                            dependencyName: 'OsrComponent',
                            dependencyType: 'WebService',
                            // responseSizeBytes: contentLength && parseInt(contentLength, 10)},
                        baseType: 'Ms.Qos.OutgoingServiceRequest',
                        // customSessionGuid: ids.getSessionId(),
                        // impressionGuid: ids.getImpressionGuid(),
                        // message: isSuccess ? undefined : awa.utils.stringifyField("errorMessage", jqXhr.errorThrown), 
                        // retryCount: retryCount,
                        // customData: (requestOptions.customDataCallBack && typeof requestOptions.customDataCallBack === "function")
                        // ? JSON.stringify(requestOptions.customDataCallBack(jqXhr)) : undefined
                    }
                }
            };
            awa.ct.captureQos(event);
        });
    }

    ngOnDestroy() {
    }
}
