import React from 'react';
import Earth from '../earth_test.png';
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
    render(){
            return (
                <div style={divStyles}>
                    <img style={imageStyles} src={Earth} alt="Earth"/>
                </div>
            )
    }
}

export default withMezzurite(OffscreenComponent);