import { componentStart } from '../actions/components';
import store from '../store';
import onComponentStart from './onComponentStart';

let spyWarn = null;

describe('onComponentStart.js', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    store.dispatch = jest.fn();
    store.getState = jest.fn(() => ({}));
    spyWarn = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    spyWarn.mockRestore();
  });

  describe('invalid events', () => {
    it('should not dispatch when the event is null', () => {
      onComponentStart(null);

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should not dispatch when the event is undefined', () => {
      onComponentStart(undefined);

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should not dispatch when the event detail is null', () => {
      onComponentStart({
        detail: null
      });

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should not dispatch when the event detail is undefined', () => {
      onComponentStart({
        detail: undefined
      });

      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('valid events', () => {
    it('should not dispatch when the component id already exists in the store', () => {
      store.getState = jest.fn(() => ({ 'id': {} }));
      onComponentStart({
        detail: {
          id: 'id',
          name: 'name'
        }
      });

      expect(store.dispatch).not.toHaveBeenCalled();
      expect(spyWarn).toHaveBeenCalled();
    });

    it('should dispatch the component data to the store', () => {
      performance.now = jest.fn(() => 5);
      onComponentStart({
        detail: {
          id: 'id',
          name: 'name'
        }
      });

      expect(store.dispatch).toHaveBeenCalledWith(componentStart({
        id: 'id',
        name: 'name',
        startTime: 5
      }));
    });
  });
});
