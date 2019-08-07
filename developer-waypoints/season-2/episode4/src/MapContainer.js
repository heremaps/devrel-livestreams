import React from 'react';

import { Map, TileLayer, Marker, Polygon } from 'react-leaflet';

const hereCredentials = {
   id: 'YOUR-APP-ID',
   code: 'YOUR-APP-CODE'
}

const hereIsolineUrl = (center, range) => `https://isoline.route.api.here.com/routing/7.2/calculateisoline.json
?app_id=${hereCredentials.id}
&app_code=${hereCredentials.code}
&mode=shortest;car;traffic:disabled
&start=geo!${center[0]},${center[1]}
&range=${range}
&rangetype=distance`;

class MapContainer extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         isoline: [],
         markerPosition: this.props.center,
         range: 2000
      }
   }
   
   createIsoline = async (evt) => {
      let data;
      if(evt !== undefined) {
         const coordinates = evt.target.getLatLng();
         const markerPosition = [coordinates.lat, coordinates.lng];
         //this.setState({ markerPosition }, () => this.createIsoline());
         data = await fetch(
            hereIsolineUrl(markerPosition, this.state.range)
         ).then(res => res.json());
      } else {
         data = await fetch(
            hereIsolineUrl(this.state.markerPosition, this.state.range)
         ).then(res => res.json());
      }
      const isoline = data.response.isoline[0].component[0].shape
                        .map(p => p.split(",").map(y => Number(y)) )

      this.setState({ isoline })
   }
   componentDidMount = () => this.createIsoline();

   handleMarkerDrag = (evt) => {
      const coordinates = evt.target.getLatLng();
      const markerPosition = [coordinates.lat, coordinates.lng];
      this.setState({ markerPosition }, () => this.createIsoline());
   }

   render() {
      const hereTileUrl = `https://2.base.maps.api.here.com/maptile/2.1/maptile/newest/reduced.night/{z}/{x}/{y}/512/png8?app_id=${hereCredentials.id}&app_code=${hereCredentials.code}&ppi=320`;
      return (
         <Map
            zoomControl={false}
            attributionControl={false}
            center={this.props.center}
            zoom={this.props.zoom}
         >
            <TileLayer
               attribution="&copy; HERE 2019"
               url={hereTileUrl}
            />
            {
               this.state.isoline.length > 0 &&
               <Polygon
                  positions={this.state.isoline}
                  color="#5DDCCF"
                  fillOpacity={0.1}
                  weight={2}
               />
            }
            
            <Marker 
               draggable={true} 
               position={this.state.markerPosition}
               onDragEnd={this.createIsoline}
            />
         </Map>
      );
   }

}


export default MapContainer;