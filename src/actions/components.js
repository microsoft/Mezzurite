const componentEnd = (component) => ({
  type: 'COMPONENT_END',
  payload: component
});

const componentRemove = (component) => ({
  type: 'COMPONENT_REMOVE',
  payload: component
});

const componentStart = (component) => ({
  type: 'COMPONENT_START',
  payload: component
});

export {
  componentEnd,
  componentRemove,
  componentStart
};
