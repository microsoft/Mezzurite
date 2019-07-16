import components from './components';

describe('components.js', () => {
  it('should handle an action of type undefined', () => {
    expect(components({}, { type: undefined })).toMatchObject({});
  });

  it('should handle an action of type COMPONENT_START', () => {
    expect(components({},
      {
        payload: {
          id: 'testId',
          name: 'test',
          startTime: 3
        },
        type: 'COMPONENT_START'
      })).toMatchObject({
      testId: {
        name: 'test',
        startTime: 3
      }
    });
  });

  it('should handle an action of type COMPONENT_END', () => {
    expect(components(
      {
        testId: {
          name: 'test',
          startTime: 3
        }
      }, {
        payload: {
          customProperties: {
            inViewport: true,
            viewportDimensions: {
              height: 1,
              width: 1
            }
          },
          endTime: 5,
          id: 'testId'
        },
        type: 'COMPONENT_END'
      }
    )).toMatchObject({
      testId: {
        customProperties: {
          inViewport: true,
          viewportDimensions: {
            height: 1,
            width: 1
          }
        },
        endTime: 5,
        name: 'test',
        startTime: 3
      }
    });
  });

  it('should handle an action of type COMPONENT_REMOVE', () => {
    const state = {
      testId: {},
      testId2: {}
    };
    const action = {
      type: 'COMPONENT_REMOVE',
      payload: {
        id: 'testId'
      }
    };
    const transformedState = components(state, action);

    const expectedState = {
      testId2: {}
    };

    expect(transformedState).toMatchObject(expectedState);
  });
});
