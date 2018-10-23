import React from 'react';

const StateProvider = (Component) => class extends React.Component {   
    render() {
      return Component({...this.props});
    }
  };

  export { StateProvider };