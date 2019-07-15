import { componentEnd } from '../actions/components';
import store from '../store';
import onComponentEnd from './onComponentEnd';

let spyWarn = null;

describe('onComponentEnd.js', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    store.dispatch = jest.fn();
    store.getState = jest.fn(() => ({}));
    spyWarn = jest.spyOn(console, 'warn');
  });

  afterEach(() => {
    spyWarn.mockRestore();
  });

  describe('invalid events', () => {
    it('should not dispatch when the event is null', () => {
      onComponentEnd(null);

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should not dispatch when the event is undefined', () => {
      onComponentEnd(undefined);

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should not dispatch when the event detail is null', () => {
      onComponentEnd({
        detail: null
      });

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should not dispatch when the event detail is undefined', () => {
      onComponentEnd({
        detail: undefined
      });

      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('valid events', () => {
    it('should not dispatch when the component id does not exist in the store', () => {
      onComponentEnd({
        detail: {
          endTime: 5,
          id: 'id'
        }
      });

      expect(store.dispatch).not.toHaveBeenCalled();
      expect(spyWarn).toHaveBeenCalled();
    });

    it('should not dispatch when the component id exists in the store and has an end time', () => {
      store.getState = jest.fn(() => ({ 'id': { endTime: new Date(0) } }));
      onComponentEnd({
        detail: {
          endTime: 5,
          id: 'id'
        }
      });

      expect(store.dispatch).not.toHaveBeenCalled();
      expect(spyWarn).toHaveBeenCalled();
    });

    it('should dispatch the component data to the store', async () => {
      store.getState = jest.fn(() => ({ 'id': {} }));
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
});
