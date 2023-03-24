import React, { useState } from 'react';
import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';

interface Location {
  lat: number;
  lng: number;
}

interface Props {
  locations: Location[];
}

const GMap: React.FC<Props> = ({ locations }) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_KEY || "AIzaSyBHHRrlEe96sS_ELvWDVPhx3CuUBBlJFlI",
  });
  // console.log(isLoaded, process.env.REACT_APP_GOOGLE_KEY);
  
  const onLoad = (map: google.maps.Map) => {
    setMap(map);
  };

  const renderMarkers = () => {
    return locations.map((location, index) => {
      return <Marker key={index} position={location} />;
    });
  };

  const renderPolyline = () => {
    return <Polyline path={locations} options={{ strokeColor: '#000000' }} />;
  };

  return (
    isLoaded ? (
      <GoogleMap
        mapContainerStyle={{ height: '400px', width: '100%' }}
        center={locations[0]}
        zoom={12}
        onLoad={onLoad}
      >
        {renderMarkers()}
        {renderPolyline()}
      </GoogleMap>
    ) :
    <div>
      Loading ...
    </div>
  );
};

export default GMap;