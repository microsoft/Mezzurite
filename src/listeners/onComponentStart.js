import { componentStart } from '../actions/components';
import store from '../store';

function onComponentStart (event) {
  if (event != null && event.detail != null) {
    const startTime = performance.now();
    store.dispatch(componentStart({
      id: event.detail.id,
      name: event.detail.name,
      startTime
    }));
  }
}

export default onComponentStart;
