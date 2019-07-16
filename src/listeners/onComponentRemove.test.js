import { componentRemove } from '../actions/components';
import store from '../store';
import onComponentRemove from './onComponentRemove';

describe('onComponentRemove.js', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    store.dispatch = jest.fn();
  });

  it('should not dispatch when the event is null', () => {
    onComponentRemove(null);

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should not dispatch when the event is undefined', () => {
    onComponentRemove(undefined);

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should not dispatch when the event detail is null', () => {
    onComponentRemove({
      detail: null
    });

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should not dispatch when the event detail is undefined', () => {
    onComponentRemove({
      detail: undefined
    });

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch the component removal action to the store', () => {
    store.getState = jest.fn(() => ({ 'id': {} }));
    onComponentRemove({
      detail: {
        id: 'id'
      }
    });

    expect(store.dispatch).toHaveBeenCalledWith(componentRemove({
      id: 'id'
    }));
  });
});
