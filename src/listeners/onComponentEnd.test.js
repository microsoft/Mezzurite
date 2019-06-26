import { componentEnd } from '../actions/components';
import store from '../store';
import onComponentEnd from './onComponentEnd';

describe('onComponentEnd.js', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    store.dispatch = jest.fn();
  });

  it('should not dispatch when the event is null', () => {
    onComponentEnd(null);

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should not dispatch when the event detail is null', () => {
    onComponentEnd({
      detail: null
    });

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch the component data to the store', async () => {
    performance.now = jest.fn(() => 5);
    await onComponentEnd({
      detail: {
        endTime: 5,
        id: 'id'
      }
    });

    expect(store.dispatch).toHaveBeenCalledWith(componentEnd({
      endTime: 5,
      id: 'id'
    }));
  });
});
