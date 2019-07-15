import { componentEnd } from '../actions/components';
import store from '../store';

async function onComponentEnd (event) {
  if (event != null && event.detail != null) {
    const state = store.getState();

    if (event.detail.id in state) {
      // A COMPONENT_START action has been dispatched for this id
      if (state[event.detail.id].endTime == null) {
        // A COMPONENT_END action has not yet been dispatched
        const endTime = performance.now();

        store.dispatch(componentEnd({
          endTime,
          id: event.detail.id
        }));
      } else {
        // A COMPONENT_END action has already been dispatched for this id
        console.warn(`COMPONENT_END emitted for component id with end time: ${event.detail.id}`);
      }
    } else {
      // A COMPONENT_START action has not been dispatched yet for this id
      console.warn(`COMPONENT_END emitted before COMPONENT_START for component id: ${event.detail.id}`);
    }
  }
}

export default onComponentEnd;
