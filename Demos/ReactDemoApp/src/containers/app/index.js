import React from 'react'
import { Route, Link } from 'react-router-dom'
import Home from '../home'
import About from '../about'
import { withMezzuriteRouter } from '@ms/mezzurite-react';

class App extends React.Component{
  
  render(){
    return ( <div>
      <header>
        <Link to="/">Home</Link>
        <Link to="/about-us">About</Link>
        <br/>
      </header>
      <main>
        <Route exact path="/" component={Home} />
        <Route exact path="/about-us" component={About} />
      </main>
    </div>)
  } 
}

// export default compose(connect(mapStateToProps),
//                         MezzuriteRouterHOC)(App);

export default withMezzuriteRouter(App);