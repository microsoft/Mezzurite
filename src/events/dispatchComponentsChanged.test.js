import { componentStart } from '../actions/components';
import store from '../store';
import dispatchComponentsChanged from './dispatchComponentsChanged';

describe('componentsChanged.js', () => {
  beforeEach(() => {
    dispatchComponentsChanged();
    jest.clearAllMocks();
  });

  it('should not call window.dispatchEvent when the state does not change', () => {
    jest.spyOn(window, 'dispatchEvent');
    store.dispatch({ type: 'INVALID_EVENT' });
    expect(window.dispatchEvent).not.toHaveBeenCalled();
  });

  it('should call window.dispatchEvent whenever the store updates', () => {
    jest.spyOn(window, 'dispatchEvent');
    store.dispatch(componentStart({
      id: 'testId',
      name: 'testName',
      startTime: 3
    }));
    expect(window.dispatchEvent).toHaveBeenNthCalledWith(1, new CustomEvent('mezzurite/componentsChanged'));
  });

  it('should call window.dispatchEvent multiple times when the store updates multiple times', () => {
    jest.spyOn(window, 'dispatchEvent');
    store.dispatch(componentStart({
      id: 'testId',
      name: 'testName',
      startTime: 3
    }));
    store.dispatch(componentStart({
      id: 'testId-two',
      name: 'testName',
      startTime: 3
    }));
    expect(window.dispatchEvent).toHaveBeenNthCalledWith(1, new CustomEvent('mezzurite/componentsChanged'));
    expect(window.dispatchEvent).toHaveBeenNthCalledWith(2, new CustomEvent('mezzurite/componentsChanged'));
  });
});
