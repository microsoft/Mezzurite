import onComponentEnd from './onComponentEnd';
import onComponentStart from './onComponentStart';

function addMezzuriteEventListeners () {
  window.addEventListener('mezzurite/componentEnd', onComponentEnd);
  window.addEventListener('mezzurite/componentStart', onComponentStart);
}

export default addMezzuriteEventListeners;
