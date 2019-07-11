import React from 'react';

import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

const hereCredentials = {
   id: 'YOUR-HERE-ID',
   code: 'YOUR-HERE-CODE'
}

class MapContainer extends React.Component {
   constructor(props) {
      super(props);
      this.state = {

      }
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
            <Marker position={this.props.center} />
         </Map>
      );
   }
}


export default MapContainer;