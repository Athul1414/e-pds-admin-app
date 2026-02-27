"use client";

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box } from '@mui/material';

// Helper component for handling map clicks
function LocationPicker({ position, onPositionChange }) {
    const map = useMap();

    // Fix for default marker icons in Leaflet with Next.js
    useEffect(() => {
        const DefaultIcon = L.icon({
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
            iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
        });
        L.Marker.prototype.options.icon = DefaultIcon;
    }, []);

    useMapEvents({
        click(e) {
            onPositionChange([e.latlng.lat, e.latlng.lng]);
        },
    });

    useEffect(() => {
        if (position && map) {
            map.flyTo(position, map.getZoom());
        }
    }, [position, map]);

    return position ? <Marker position={position} /> : null;
}

export default function ShopMap({ lat, lng, onLocationSelect }) {
    const [position, setPosition] = useState([lat || 12.9716, lng || 77.5946]);

    const handleSetPosition = (pos) => {
        setPosition(pos);
        onLocationSelect(pos[0], pos[1]);
    };

    return (
        <Box sx={{
            height: 350,
            width: '100%',
            borderRadius: 3,
            overflow: 'hidden',
            border: '2px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            transition: 'all 0.3s ease'
        }}>
            <MapContainer
                center={position}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationPicker position={position} onPositionChange={handleSetPosition} />
            </MapContainer>
        </Box>
    );
}
