[![npm version](https://badge.fury.io/js/%40microsoft%2Fmezzurite-react.svg)](https://badge.fury.io/js/%40microsoft%2Fmezzurite-react)

# Mezzurite-React

## Requirements:


**For component tracking:** 
```json
    "@microsoft/mezzurite-core": "^1.0.1",
    "intersection-observer": "^0.5.0", // IE support
    "react": "^16.4.2"
```
**for full app tracking:**
```json
    "@microsoft/mezzurite-core": "^1.0.1",
    "intersection-observer": "^0.5.0", // IE support
    "react": "^16.4.2",
    "react-dom": "^16.4.2",
    "react-router": "^4.3.1"
```

## Onboarding


### Installation
Install mezzurite from npm:
```javascript
  npm install "@microsoft/mezzurite-core"
  npm install "@microsoft/mezzurite-react"
```

### Full Application Implementation ([ALT, VLT, Components](#faq))
** **If you do not have access to the application's routing service, skip to next section on "Tracking Components"** **
1. Inside main App module, add following import statement:
```javascript
import {withMezzuriteRouter} from '@microsoft/mezzurite-react';
```
2. Wrap your exported component in the **withMezzuriteRouter** [higher order component](#faq). This will add Mezzurite functionality to your app router:
```javascript
// old export
export default App;

// new export
export default withMezzuriteRouter(App);
```
If using Redux, you will need to use the compose component:
```javascript
// add to imports
import {compose} from 'redux';

...

// old Redux export
export default connect(mapStateToProps, mapDispatchToProps)(App);

// new Redux export using Mezzurite
export default compose(connect(mapStateToProps, mapDispatchToProps), withMezzuriteRouter)(App);
```

### Tracking Components([CLT and VLT](#faq))
1. In the component you want to track, add an import statement for mezzurite-react:
```javascript
import {withMezzurite} from '@microsoft/mezzurite-react';
```
2. Wrap your exported component in the **withMezzurite** [higher order component](#faq). This will add Mezzurite functionality to this specific component:
```javascript
// old export
export default ExampleComponent;

// new export
export default withMezzurite(ExampleComponent);
```

### Unit Testing
For Mezzurite to work correctly in Jest/Enzyme test environments (such as create-react-app), [jsdom](https://github.com/jsdom/jsdom) use is required to gain access to the window object:
```javascript
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM(`...`);

// then run code that would utilize Mezzurite
```
## FAQ
### 1. What is a Higher-Order Component (HOC)?
A higher-order component (HOC) is an advanced technique in React for reusing component logic. They are functions that take in a component and return a modified component. We use HOC's within the Mezzurite React library to add tracking functionality to user components.

### 2. What is Component Tracking vs Full App Tracking?
Component tracking is an easy way to calaulate the Component Load Time(CLT) for a specific component irrespective of the performance of other components on the site and site itself. 
While, full app tracking is used to track initial Application Load Time(ALT). And, also for each route change in the app, it also calculates the Viewport Load Time(VLT) and Component Load Time(CLT) for all the tracked components within that viewport.

### 3. How do I check if my timings are logging correctly?
If running from localhost, a console.log should fire with the current timings. An alternate place to look is window.mezzurite.measures, which is where each component timing, as well as ALT and VLT, is saved.