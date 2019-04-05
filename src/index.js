import 'intersection-observer';

function initializeMezzurite () {
  const mezzuriteState = localStorage.getItem('mezzurite/state');

  if (mezzuriteState == null) {
    localStorage.setItem('mezzurite/state', 'active');

    window.addEventListener('unload', () => {
      localStorage.removeItem('mezzurite/state');
    });
  }
}

export default initializeMezzurite;
