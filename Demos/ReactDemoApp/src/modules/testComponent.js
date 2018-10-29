import React from 'react';
import { withMezzurite } from '@ms/mezzurite-react';

let styles = {
    margin: '20px',
    width: '300px',
    height: '250px',
    backgroundColor: '#eeeeee',
    color: 'green'
  };

const TestComponent = () => (
 <div style={styles}>
     <h3>This is a stateless component!</h3>
 </div>
);

export default withMezzurite(TestComponent);