import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import axios from 'axios';
import { Icon } from "@iconify/react";

  
const LocationPin = ({ text }) => (
    <div className="pin">
        <Icon icon="mdi:location" className="pin-icon" />
        <p className="pin-text">{text ? text : ""}</p>
    </div>
);


function MapComponent() {

  const [points, setPoints] = useState([]);

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/points');
        console.log(response)
        setPoints(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

  }, []);

  return (
    <div style={{ height: '400px', width: '100%' }}>
       {/* <GoogleMapReact
        bootstrapURLKeys={{ key: '' ,libraries:['visualization']}} 
        defaultCenter={{ lat: 30.3165, lng: 78.0322 }} 
        defaultZoom={14}
        yesIWantToUseGoogleMapApiInternals 
        
        onGoogleApiLoaded={({ map, maps }) => {
          const updatePosition = () => {
            const bounds = map.getBounds();
            const zoom = map.getZoom();

            points.forEach((point, index) => {
              const markerElement = document.getElementById(`marker-${index}`);
              const position = new maps.LatLng(point.lat, point.lng);

              const pixelPosition = map.getProjection().fromLatLngToPoint(position);
              const pointOffset = new maps.Point(
                (pixelPosition.x * (1 << zoom)) / 2,
                (pixelPosition.y * (1 << zoom)) / 2
              );

              markerElement.style.left = `${pixelPosition.x}px`;
              markerElement.style.top = `${pixelPosition.y}px`;
            });
          };

          map.addListener('zoom_changed', updatePosition);
          map.addListener('bounds_changed', updatePosition);
        }}
      >
        {points.map(point => (
          <LocationPin key={point.id} lat={point.lat} lng={point.lng} />
        ))}
      </GoogleMapReact> */}

    </div>
  );
}

export default MapComponent;
