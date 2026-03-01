"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, InputBase, IconButton, Paper, CircularProgress, Divider } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

// Helper component for handling map interaction and centering
function MapController({ position, onPositionChange, pincode }) {
    const map = useMap();

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

    // Fly to position when it changes (from search or parent)
    useEffect(() => {
        if (position && map) {
            map.flyTo(position, 16);
        }
    }, [position, map]);

    // Focus on region when pincode changes
    useEffect(() => {
        if (pincode && pincode.length === 6) {
            const fetchRegion = async () => {
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&postalcode=${pincode}&country=India`);
                    const data = await response.json();
                    if (data && data.length > 0) {
                        const { lat, lon } = data[0];
                        map.flyTo([parseFloat(lat), parseFloat(lon)], 14);
                    }
                } catch (error) {
                    console.error("Pincode search error:", error);
                }
            };
            fetchRegion();
        }
    }, [pincode, map]);

    return position ? <Marker position={position} /> : null;
}

export default function ShopMap({ lat, lng, onLocationSelect, pincode }) {
    const [position, setPosition] = useState([lat || 12.9716, lng || 77.5946]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);

    const handleSetPosition = useCallback((pos) => {
        setPosition(pos);
        onLocationSelect(pos[0], pos[1]);
    }, [onLocationSelect]);

    const handleSearch = async (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const query = searchQuery.trim();
        if (!query) return;

        setSearching(true);
        try {
            // Added User-Agent as per Nominatim Policy
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', India')}&limit=1`,
                {
                    headers: {
                        'Accept-Language': 'en',
                        'User-Agent': 'E-PDS-Admin-App-V1'
                    }
                }
            );

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                const newPos = [parseFloat(lat), parseFloat(lon)];
                handleSetPosition(newPos);
            } else {
                alert(`No results found for "${query}". Please try area names, cities, or landmarks in India.`);
            }
        } catch (error) {
            console.error("Search error:", error);
            alert("Unable to fetch location. Please check your internet connection.");
        } finally {
            setSearching(false);
        }
    };

    // Initialize/Sync position from props with tolerance
    useEffect(() => {
        if (lat && lng) {
            const currentLat = position[0];
            const currentLng = position[1];

            // Check if coordinates have actually changed (using epsilon to avoid floating point issues)
            const diff = Math.abs(lat - currentLat) + Math.abs(lng - currentLng);
            if (diff > 0.00001) {
                setPosition([lat, lng]);
            }
        }
    }, [lat, lng, position]); // Added position to dependency array

    return (
        <Box sx={{
            height: 400,
            width: '100%',
            position: 'relative',
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid #e5e7eb',
            bgcolor: '#f8fafc'
        }}>
            {/* Overlay Search Bar - Increased Z-Index and repositioned */}
            <Paper
                elevation={3}
                onClick={(e) => e.stopPropagation()}
                sx={{
                    p: '4px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    width: { xs: '85%', sm: 340 },
                    position: 'absolute',
                    top: 20,
                    left: { xs: '7.5%', sm: 60 },
                    zIndex: 1200,
                    borderRadius: 2,
                    bgcolor: 'white',
                    border: '1px solid #e2e8f0'
                }}
            >
                <SearchIcon sx={{ color: '#94a3b8', ml: 1, mr: 1, fontSize: 20 }} />
                <InputBase
                    sx={{ ml: 1, flex: 1, fontSize: '0.9rem', color: '#1e293b' }}
                    placeholder="Search area, city or landmark..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSearch();
                        }
                    }}
                />
                {searchQuery && (
                    <IconButton size="small" onClick={() => setSearchQuery('')} sx={{ color: '#94a3b8' }}>
                        <ClearIcon fontSize="small" />
                    </IconButton>
                )}
                <Divider sx={{ height: 28, m: 0.5, borderColor: '#e2e8f0' }} orientation="vertical" />
                <IconButton
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSearch();
                    }}
                    sx={{ p: '8px', color: searching ? '#94a3b8' : '#3b82f6' }}
                    disabled={searching}
                >
                    {searching ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                </IconButton>
            </Paper>

            <MapContainer
                center={position}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapController
                    position={position}
                    onPositionChange={handleSetPosition}
                    pincode={pincode}
                />
            </MapContainer>
        </Box>
    );
}
