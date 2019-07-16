import onComponentEnd from './onComponentEnd';
import onComponentStart from './onComponentStart';
import onComponentRemove from './onComponentRemove';

function addMezzuriteEventListeners () {
  window.addEventListener('mezzurite/componentEnd', onComponentEnd);
  window.addEventListener('mezzurite/componentRemove', onComponentRemove);
  window.addEventListener('mezzurite/componentStart', onComponentStart);
}

export default addMezzuriteEventListeners;
