import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularPerfBase, AngularPerformanceTelemetry } from '@des.epic.uscp.scripts/mezzurite.angular-dev/lib-esm/main';

@AngularPerformanceTelemetry()
@Component({
  selector: 'app-interesting-component',
  templateUrl: './interesting-component.component.html',
  styleUrls: ['./interesting-component.component.css']
})
export class InterestingComponentComponent implements OnInit, OnDestroy, AngularPerfBase {

  constructor() { }

  getName() {
    return 'app-interesting-component';
  }
  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
