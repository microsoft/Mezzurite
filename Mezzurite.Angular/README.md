# Mezzurite-Angular
**For Angular 6, use @ms/mezzurite-angular@2.x**
## Requirements:
```json
  "dependencies": {
    "@types/angular": "^1.6.51",
    "@types/jquery": "^2.0.46",
    "@types/node": "^10.12.2",
    "reflect-metadata": "^0.1.8"
  },
  "peerDependencies": {
    "@angular/common": "^6.1.9",
    "@angular/compiler": "^6.1.9",
    "@angular/core": "^6.1.9",
    "@angular/forms": "^6.1.9",
    "@angular/http": "^6.1.9",
    "@angular/platform-browser": "^6.1.9",
    "@angular/platform-browser-dynamic": "^6.1.9",
    "@angular/router": "^6.1.9",
    "core-js": "^2.4.1",
    "rxjs": "^6.2.2",
    "zone.js": "^0.x"
  },
```

## Onboarding
### Basic Setup (Application Load Time)
1. Import the following modules in app.module:
```javascript
import { AngularPerfModule, RoutingService } from '@ms/mezzurite.angular2';
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