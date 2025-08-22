'use client'; // if you're using App Router

import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from "leaflet"
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapUpdater({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 13);
  }, [lat, lng, map]);
  return null;
}

export default function AddressMap({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) {
  return (
    <MapContainer
  center={[lat, lng]}
  zoom={13}
  scrollWheelZoom={false}
  style={{ height: '300px', width: '100%', borderRadius: '0.5rem' }}
>
  <TileLayer
    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    attribution='Tiles © Esri'
  />
  <MapUpdater lat={lat} lng={lng} />
  <Marker position={[lat, lng]} icon={defaultIcon} />
</MapContainer>

  );
}