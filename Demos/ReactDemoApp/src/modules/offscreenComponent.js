import React from 'react';
import Mountains from '../mountains.jpg';
import { withMezzurite } from '@microsoft/mezzurite-react';


let divStyles = {
    position: 'relative',
    top: '2000px',
    margin: '20px',
    width: '500px',
    backgroundColor: '#aaaaaa',
  };

let imageStyles = {
    "maxWidth": "100%"
}

class OffscreenComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loaded: true
        }
    }

    render(){
            return (
                <div style={divStyles}>
                    <img style={imageStyles} src={Mountains} alt="Mountains"/>
                </div>
            )
    }
}

export default withMezzurite(OffscreenComponent);