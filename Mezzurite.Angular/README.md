# Mezzurite-Angular
**For Angular 6, use @microsoft/mezzurite-angular@2.x**
## Requirements:
```json
  "dependencies": {
    "@types/angular": "^1.6.51",
    "@types/jquery": "^2.0.46",
    "@types/node": "^10.12.2",
    "reflect-metadata": "^0.1.8"
  },
  "peerDependencies": {
    "@angular/common": "^2.4.0||^4.0.0||^5.0.0||^6.0.0||^7.0.0",
    "@angular/compiler": "^2.4.0||^4.0.0||^5.0.0||^6.0.0||^7.0.0",
    "@angular/core": "^2.4.0||^4.0.0||^5.0.0||^6.0.0||^7.0.0",
    "@angular/forms": "^2.4.0||^4.0.0||^5.0.0||^6.0.0||^7.0.0",
    "@angular/http": "^2.4.0||^4.0.0||^5.0.0||^6.0.0||^7.0.0",
    "@angular/platform-browser": "^2.4.0||^4.0.0||^5.0.0||^6.0.0||^7.0.0",
    "@angular/platform-browser-dynamic": "^2.4.0||^4.0.0||^5.0.0||^6.0.0||^7.0.0",
    "@angular/router": "^3.4.0||^4.0.0||^5.0.0||^6.0.0||^7.0.0",
    "core-js": "^2.4.1",
    "rxjs": "^6.2.2",
    "zone.js": "^0.x"
  },
```

## Onboarding
### Basic Setup (Application Load Time)
1. Import the following modules in app.module:
```javascript
import { AngularPerfModule, RoutingService } from '@microsoft/mezzurite.angular';
```
2. In the NgModule imports, add the following:
```
Imports: [  AngularPerfModule.forRoot() ]
```
3. In the constructor of AppModule, add the following:
```javascript
export class AppModule {
  constructor(@Inject(RoutingService) private router: typeof RoutingService) {
    router.start();
  }
}
```
### Component Tracking (CLT and VLT)
Components are instrumented inside the html markup as an attribute directive:
```html
<div mezzurite component-title='MyComponentName'>
...
</div>
```
