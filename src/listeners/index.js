import onComponentEnd from './onComponentEnd';
import onComponentRemove from './onComponentRemove';
import onComponentStart from './onComponentStart';

function addMezzuriteEventListeners () {
  window.addEventListener('mezzurite/componentEnd', onComponentEnd);
  window.addEventListener('mezzurite/componentRemove', onComponentRemove);
  window.addEventListener('mezzurite/componentStart', onComponentStart);
}

export default addMezzuriteEventListeners;
