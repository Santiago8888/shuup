import React, {Component} from 'react';
import {render} from 'react-dom';
import {StaticMap} from 'react-map-gl';
import DeckGL, {HexagonLayer} from 'deck.gl';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoic2FudGlhZ29tcSIsImEiOiJjanRmYmdvM3IwN3ZuNDRsbHExajk1dWV5In0.wAeGpK8rK6_65ZP6wAb1Vg'; 

const INITIAL_VIEW_STATE = {
  latitude: 18.9817431,
  longitude: -99.0984464,
  zoom: 12,
  bearing: -20,
  pitch: 60,
};

class Root extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      data: [],
      z: -10000,
      x: 0,
      y: 0,
      tooltip_text: ''
    };
  }
  componentDidMount(){
    console.log(props.data)
    this.setState({data:props.data})
  }
  render() {      
    const layer = new HexagonLayer({
        id: 'hexagon-layer',
        data: this.state.data,
        pickable: true,
        extruded: true,
        radius: 200,
        elevationScale: 1,
        getPosition: d => d.COORDINATES,
        onHover: ({object, x, y}) => {
          const tooltip = `Count: ${object.points.length}`;
          console.log(x, y, tooltip )
          object
          ?
          this.setState({
              x: x,
              y: y,
              z: 10000,
              tooltip_text: tooltip
          })
          :
          this.setState({
              z: -100000
          })
           
        }
    });

    const tooltip = 
        <div 
            id = "tooltip"
            style={{
                backgroundColor: 'black',
                position: 'absolute', 
                zIndex: this.state.z, 
                pointerEvents: 'none', 
                left: this.state.x,
                top: this.state.y,
                color:'white',
                padding: '5px'
            }}
        >
            { this.state.tooltip_text }
        </div>

    return (
        <div style={{position: 'relative', height:'600px', marginTop: '-50px'}}>
            <DeckGL initialViewState={INITIAL_VIEW_STATE} layers={[layer]} controller={true} >
                <StaticMap mapboxApiAccessToken={MAPBOX_TOKEN} />
                { tooltip }
            </DeckGL>
      </div>
    );
  }
}

render(<Root />, window.react_mount);
