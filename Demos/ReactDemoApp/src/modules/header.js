import React from 'react';
import { withMezzurite } from '@ms/mezzurite-react';
import Pie from '../pie.jpg';

class Header extends React.Component{
    render(){
    return (<div>
    <h2>This is a header!!</h2>
    <img src={Pie} alt="Pie"/>
    </div>)
    }
}

export default withMezzurite(Header);