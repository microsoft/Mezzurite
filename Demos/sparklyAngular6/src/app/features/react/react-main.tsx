import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ReactComponent } from './react-component';

// const reactCom = React.createElement('ReactComponent', {}, 'Calling react component');
const e = React.createElement(
    'div', {id: 'reactdiv'}, <ReactComponent />);

// const e = React.createElement('div', {},
//     React.createElement('h1', {}, 'I am a react component'));

ReactDOM.render(
    e,
    document.getElementById('react-root')
);
