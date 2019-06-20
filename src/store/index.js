import { createStore } from 'redux';

import components from '../reducers/components';

const store = createStore(components);

export default store;
