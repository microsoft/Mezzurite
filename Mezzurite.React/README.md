[![npm version](https://badge.fury.io/js/%40microsoft%2Fmezzurite-react.svg)](https://badge.fury.io/js/%40microsoft%2Fmezzurite-react)

# Mezzurite-React

## Requirements:
**For component tracking:** 
```
    "@microsoft/mezzurite-core": "^1.0.1",
    "react": "^16.4.2"
```
**for full app tracking:**
```json
    "@microsoft/mezzurite-core": "^1.0.1",
    "intersection-observer": "^0.5.0", // legacy browser support
    "react": "^16.4.2",
    "react-dom": "^16.4.2",
    "react-router": "^4.3.1"
```

## Onboarding

### Installation
Install the mezzurite dependencies from npm:
```javascript
  npm install "@microsoft/mezzurite-core"
  npm install "@microsoft/mezzurite-react"
```


### Tracking Components Only
1. In the component you want to track, add an import statement for mezzurite-react:
```javascript
import {withMezzurite} from '@microsoft/mezzurite-react';
```
2. Since **withMezzurite** is a React "Higher Order Component", it will take in an existing component and return a modified version (with component performance timings). We need to modify our export statement:
```javascript
// old export
export default ExampleComponent;

// new export
export default withMezzurite(ExampleComponent);
```

### Full Tracking (ALT, VLT, Components)
****To ensure IE11 support, you must also install the 'Intersection-Observer' polyfill (listed as a Mezzurite peer dependency)****
1. Follow steps from "Tracking Components Only" section above.
2. Inside main App module, add following import statement:
```javascript
import {withMezzuriteRouter} from '@microsoft/mezzurite-react';
```
3. Similar to **withMezzurite**, we will create a new modified component using our **withMezzuriteRouter** HOC:
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
