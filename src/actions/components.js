const componentEnd = (component) => ({
  type: 'COMPONENT_END',
  payload: component
});

const componentStart = (component) => ({
  type: 'COMPONENT_START',
  payload: component
});

const componentRemove = (component) => ({
  type: 'COMPONENT_REMOVE',
  payload: component
});

export {
  componentEnd,
  componentStart,
  componentRemove
};
