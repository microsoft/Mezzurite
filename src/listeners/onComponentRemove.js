import { componentRemove } from '../actions/components';
import store from '../store';

function onComponentRemove (event) {
  if (event != null && event.detail != null) {
    // No need to check the store if the component id exists or not
    store.dispatch(componentRemove({ id: event.detail.id }));
  }
}

export default onComponentRemove;
