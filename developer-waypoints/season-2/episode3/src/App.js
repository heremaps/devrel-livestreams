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
      const numMaps = 9;

      const center = [22.286394, 114.149139];
      const zoom = 16;
      const style = {
         grid: `repeat(${Math.sqrt(numMaps)}, 1fr) / repeat(${Math.sqrt(numMaps)}, 1fr)`
      }
      return (
         <div 
            className="container"
            style={style}
         >
            {
               Array(numMaps).fill(0).map((x, i) => {
                  return (
                     <div key={i}>
                        <MapContainer 
                           center={center}
                           zoom={zoom}
                        />
                     </div> 
                  )
               })
            }
            
         </div>
         
      );
   }
}

export default App;
