import React, {Component} from 'react'
import Header from '../../modules/header';
import { withMezzurite } from '@ms/mezzurite-react';

class About extends Component {

  render(){
    return(<div>
          <Header />
      <h1>About Page</h1>
    </div>)
  }
}

export default withMezzurite(About)

