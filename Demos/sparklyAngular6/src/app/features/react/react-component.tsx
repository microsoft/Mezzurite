import * as React from 'react';
import * as ReactDOM from 'react-dom';

declare var awa: any;
export class ReactComponent extends React.Component {
    startTime: number;
    constructor(props) {
        super(props);
        this.startTime = new Date().getTime();
    }

    render() {
        return (
            <div>
                <div id="react-lifecycle">
                    <h2>This is a react component displaying the component lifecycle</h2>
                    <img src="https://cdn-images-1.medium.com/max/2000/1*XcGM-8E_hGl4fpAr9wJIsA.png" height="200" width="500" />
                </div>
                <br/>
                <div id="angular-lifecycle">
                    <h2>This is the same react component displaying the angular component lifecycle</h2>
                    <img src="https://image.slidesharecdn.com/angular2-161116174204/95/angular2-61-638.jpg?cb=1479358200" height="300" width="500" />
                </div>
            </div>
        )
    }

    componentDidMount() {
        const endTime = new Date().getTime();
        console.log('sending content update here');
        // awa.ct.captureContentUpdate({
        //     pageUri: window.location.href,
        //     timings: {
        //         metricType: 'Clt',
        //         value: endTime - this.startTime
        //     }
        // });
    }
};