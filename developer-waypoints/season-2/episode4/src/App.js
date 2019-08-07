import React from 'react';
import './App.css';
import MapContainer from './MapContainer';

class App extends React.Component {
   constructor(props) {
      super(props);
      this.state = {

      }
   }
   render() {
      const center = [41.890251, 12.492373];
      const zoom = 14;
      return (
         <MapContainer 
            center={center}
            zoom={zoom}
         />
      );
   }
}

export default App;
