import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AngularPerfModule } from '@microsoft/mezzurite-angular';

import { routes } from './barrel.routes';
import { BarrelComponent } from './barrel.component';

console.log('`Barrel` bundle loaded asynchronously');

@NgModule({
  declarations: [
    /**
     * Components / Directives/ Pipes
     */
    BarrelComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    AngularPerfModule,
  ],
})
export class BarrelModule {
  public static routes = routes;
}
