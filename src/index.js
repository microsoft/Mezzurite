import dispatchComponentsChanged from './events/dispatchComponentsChanged';
import addMezzuriteEventListeners from './listeners';

function initializeMezzurite () {
  dispatchComponentsChanged();
  addMezzuriteEventListeners();
}

export default initializeMezzurite;
