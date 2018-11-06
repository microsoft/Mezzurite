import React, {Component} from 'react'
import Header from '../../modules/header';
import { withMezzurite } from '@microsoft/mezzurite-react';

class About extends Component {

  render(){
    return(<div>
          <Header />
      <h1>About Page</h1>
    </div>)
  }
}

export default withMezzurite(About)

