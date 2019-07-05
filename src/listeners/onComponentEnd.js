import { componentEnd } from '../actions/components';
import store from '../store';

async function onComponentEnd (event) {
  if (event != null && event.detail != null) {
    const endTime = performance.now();

    store.dispatch(componentEnd({
      endTime,
      id: event.detail.id
    }));
  }
}

export default onComponentEnd;
