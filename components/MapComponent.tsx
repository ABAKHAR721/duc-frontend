'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// STYLES: Import Leaflet's CSS. This is crucial for the map to render correctly.
import 'leaflet/dist/leaflet.css';

// --- Professional Icon Configuration for Leaflet ---
// This common fix addresses an issue where default marker icons don't appear correctly
// in modern bundlers like Webpack or Vite, which Next.js uses.
const iconUrl = '/marker-icon.png';
const iconRetinaUrl = '/marker-icon-2x.png';
const shadowUrl = '/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
  coordinates: {
    lat: number;
    lng: number;
  };
  address: string[];
}

const MapComponent: React.FC<MapComponentProps> = ({ coordinates, address }) => {
  return (
    <MapContainer 
      center={[coordinates.lat, coordinates.lng]} 
      zoom={17} 
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[coordinates.lat, coordinates.lng]}>
        <Popup>
          <div className="font-semibold text-base">Pizza Le Duc Podensac</div>
          <p>{address.join(', ')}</p>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
