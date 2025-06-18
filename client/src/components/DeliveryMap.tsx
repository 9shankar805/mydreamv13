
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Clock, Phone, Truck, AlertCircle } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
}

interface DeliveryMapProps {
  deliveryId?: number;
  deliveryPartnerId?: number;
  pickupLocation?: { lat: number; lng: number; address: string };
  deliveryLocation?: { lat: number; lng: number; address: string };
  currentLocation?: { lat: number; lng: number };
  onLocationUpdate?: (location: { lat: number; lng: number }) => void;
}

export default function DeliveryMap({ 
  deliveryId, 
  deliveryPartnerId, 
  pickupLocation, 
  deliveryLocation, 
  currentLocation, 
  onLocationUpdate 
}: DeliveryMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [markers, setMarkers] = useState<{
    pickup?: L.Marker;
    delivery?: L.Marker;
    current?: L.Marker;
  }>({});

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          if (onLocationUpdate) {
            onLocationUpdate(location);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setMapError('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      setMapError('Geolocation is not supported by this browser.');
    }
  }, [onLocationUpdate]);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    try {
      // Initialize map with Siraha, Nepal as default center
      const map = L.map(mapRef.current, {
        center: [26.6586, 86.2003],
        zoom: 13,
        zoomControl: true,
      });

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstance.current = map;
      setIsMapLoaded(true);
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Failed to initialize map');
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Create custom icons for different locations
  const createCustomIcon = (type: 'pickup' | 'delivery' | 'current') => {
    let color = '#3B82F6';
    let icon = '📍';
    
    switch (type) {
      case 'pickup':
        color = '#10B981';
        icon = '🏪';
        break;
      case 'delivery':
        color = '#EF4444';
        icon = '🏠';
        break;
      case 'current':
        color = '#F59E0B';
        icon = '🚚';
        break;
    }

    return L.divIcon({
      html: `<div style="
        width: 30px; 
        height: 30px; 
        background: ${color}; 
        border: 2px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        font-size: 14px;
      ">${icon}</div>`,
      iconSize: [30, 30],
      className: 'custom-marker',
      iconAnchor: [15, 15],
      popupAnchor: [0, -15]
    });
  };

  // Update markers when locations change
  useEffect(() => {
    if (!mapInstance.current || !isMapLoaded) return;

    const map = mapInstance.current;
    
    // Clear existing markers
    Object.values(markers).forEach(marker => {
      if (marker) map.removeLayer(marker);
    });

    const newMarkers: any = {};
    const bounds = L.latLngBounds([]);

    // Add pickup location marker
    if (pickupLocation) {
      const pickupMarker = L.marker(
        [pickupLocation.lat, pickupLocation.lng],
        { icon: createCustomIcon('pickup') }
      ).addTo(map);
      
      pickupMarker.bindPopup(`
        <div style="padding: 8px; min-width: 150px;">
          <h4 style="margin: 0 0 4px 0; color: #10B981;">🏪 Pickup Location</h4>
          <p style="margin: 0; font-size: 12px;">${pickupLocation.address}</p>
        </div>
      `);
      
      newMarkers.pickup = pickupMarker;
      bounds.extend([pickupLocation.lat, pickupLocation.lng]);
    }

    // Add delivery location marker
    if (deliveryLocation) {
      const deliveryMarker = L.marker(
        [deliveryLocation.lat, deliveryLocation.lng],
        { icon: createCustomIcon('delivery') }
      ).addTo(map);
      
      deliveryMarker.bindPopup(`
        <div style="padding: 8px; min-width: 150px;">
          <h4 style="margin: 0 0 4px 0; color: #EF4444;">🏠 Delivery Location</h4>
          <p style="margin: 0; font-size: 12px;">${deliveryLocation.address}</p>
        </div>
      `);
      
      newMarkers.delivery = deliveryMarker;
      bounds.extend([deliveryLocation.lat, deliveryLocation.lng]);
    }

    // Add current location marker
    if (currentLocation) {
      const currentMarker = L.marker(
        [currentLocation.lat, currentLocation.lng],
        { icon: createCustomIcon('current') }
      ).addTo(map);
      
      currentMarker.bindPopup(`
        <div style="padding: 8px; min-width: 150px;">
          <h4 style="margin: 0 0 4px 0; color: #F59E0B;">🚚 Current Location</h4>
          <p style="margin: 0; font-size: 12px;">Live tracking position</p>
        </div>
      `);
      
      newMarkers.current = currentMarker;
      bounds.extend([currentLocation.lat, currentLocation.lng]);
    }

    // Add route line if both pickup and delivery locations exist
    if (pickupLocation && deliveryLocation) {
      const routeLine = L.polyline([
        [pickupLocation.lat, pickupLocation.lng],
        [deliveryLocation.lat, deliveryLocation.lng]
      ], {
        color: '#3B82F6',
        weight: 3,
        opacity: 0.7,
        dashArray: '5, 10'
      }).addTo(map);
      
      bounds.extend(routeLine.getBounds());
    }

    setMarkers(newMarkers);

    // Fit map to show all markers if any exist
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [pickupLocation, deliveryLocation, currentLocation, isMapLoaded]);

  const handleNavigate = (destination: { lat: number; lng: number; address: string }) => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination.lat},${destination.lng}`;
    window.open(googleMapsUrl, '_blank');
  };

  const handleUpdateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          if (onLocationUpdate) {
            onLocationUpdate(location);
          }
        },
        (error) => {
          console.error('Error updating location:', error);
          setMapError('Failed to update location. Please try again.');
        }
      );
    }
  };

  if (mapError) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{mapError}</p>
              <Button onClick={handleUpdateLocation} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Delivery Map
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Live Tracking
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div 
            ref={mapRef}
            className="w-full h-96 rounded-b-lg"
            style={{ minHeight: '400px' }}
          />
        </CardContent>
      </Card>

      {/* Location Details */}
      {(pickupLocation || deliveryLocation) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pickupLocation && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  Pickup Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">{pickupLocation.address}</p>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleNavigate(pickupLocation)}
                  >
                    <Navigation className="h-3 w-3 mr-1" />
                    Navigate
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {deliveryLocation && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  Delivery Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">{deliveryLocation.address}</p>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleNavigate(deliveryLocation)}
                  >
                    <Navigation className="h-3 w-3 mr-1" />
                    Navigate
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
