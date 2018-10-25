import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Http, HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule, NavigationStart } from '@angular/router';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BrandingComponent } from './header/branding/branding.component';
import { AlertComponent } from './header/alert/alert.component';
import { NavComponent } from './header/nav/nav.component';
import { FooterComponent } from './footer/footer.component';
import { MainComponent } from './main/main.component';
import { FeatureComponent } from './main/feature/feature.component';
import { StatusComponent } from './main/status/status.component';
import { ScenarioComponent } from './features/scenario/scenario.component';
import { IFrameComponent } from './features/iframe/iframe.component';
import { OsrComponent } from './features/osr/osr.component';
import { LoginComponent } from './header/login/login.component';
import { InterestingComponentComponent } from './interesting-component/interesting-component.component';
import { AngularPerfModule, RoutingService } from '@ms/mezzurite-angular';
import { SafePipe } from './shared/safe.pipe';
import {
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatListModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { overviewComponent } from './features/overview/overview.component';
import { AdalGuard, AdalService } from 'adal-angular4';
import { AuthGuard } from './shared/authguard';


declare var awa: any;

@NgModule({
  declarations: [
    AppComponent,
    BrandingComponent,
    HeaderComponent,
    AlertComponent,
    FooterComponent,
    NavComponent,
    MainComponent,
    FeatureComponent,
    StatusComponent,
    ScenarioComponent,
    InterestingComponentComponent,
    IFrameComponent,
    OsrComponent,
    SafePipe,
    overviewComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    RouterModule.forRoot([
        {
            path: 'spa',
            component: overviewComponent
        },
        {
            path: 'home',
            component: overviewComponent,
        },
        {
            path: 'iframe',
            component: IFrameComponent,
            canActivate: [AuthGuard]
        },
        {
            path: 'osr',
            component: OsrComponent,
            canActivate: [AuthGuard]
        },
        {
            path: '**',
            component: ScenarioComponent,
            canActivate: [AuthGuard]
        },
    ]),
    AngularPerfModule.forRoot(),
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatListModule,
    BrowserAnimationsModule
  ],
  providers: [AdalService, AdalGuard, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
    constructor(private router: RoutingService) {
        // TODO: Move into LoggingService init
      const config = {
            autoCapture: {
                pageView: false,
                onLoad: false,
                click: true,
                scroll: true,
                resize: true,
                context: true,
                jsError: true,
                addin: true,
                perf: true,
                assets: true
            },
            coreData: {
                appId: 'jsllEv',
                market: 'en-us'
            },
            consoleVerbosity: 1,
            initCv: true,
            callback: { pageName: this.getPageName }
        }

        if (awa) {
            awa.init(config);
            var metaTag = document.querySelector('meta[name="MS-CV"]');
            var relatedcV =""
            if (metaTag)
            {
                relatedcV = metaTag.getAttribute('content');
            }
            awa.cv.setRelatedCV(relatedcV);

            router.start();
           
        } 
        
    }

    getPageName(): string {
        const list = window.location.pathname.split('/');
        if (list.length > 0 && !list[1].match(/^\s*$/g)) {
            return list[1];
        }
        return 'Default';
    }
}
