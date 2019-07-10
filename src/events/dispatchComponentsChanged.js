import store from '../store';

// Using require syntax because of crypto dependency
const objectHash = require('object-hash');

function dispatchComponentsChanged () {
  let currentState = {};

  function handleChange () {
    const nextState = store.getState();
    if (objectHash(nextState) !== objectHash(currentState)) {
      currentState = nextState;
      window.dispatchEvent(new CustomEvent('mezzurite/componentsChanged', {
        detail: currentState
      }));
    }
  }

  const unsubscribe = store.subscribe(handleChange);
  return unsubscribe;
}

export default dispatchComponentsChanged;
