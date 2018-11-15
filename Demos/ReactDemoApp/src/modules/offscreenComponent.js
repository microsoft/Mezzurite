import React from 'react';
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
                    <img style={imageStyles} src="https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73751/world.topo.bathy.200407.3x5400x2700.jpg" alt="Earth"/>
                </div>
            )
    }
}

export default withMezzurite(OffscreenComponent);