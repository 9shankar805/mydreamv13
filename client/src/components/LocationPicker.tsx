import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Search } from "lucide-react";

interface LocationPickerProps {
  address?: string;
  latitude?: number | string;
  longitude?: number | string;
  onLocationChange: (data: {
    address: string;
    latitude: number;
    longitude: number;
  }) => void;
}

export function LocationPicker({
  address = "",
  latitude = 0,
  longitude = 0,
  onLocationChange,
}: LocationPickerProps) {
  const [searchAddress, setSearchAddress] = useState(address);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetCurrentLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Reverse geocoding would go here in a real implementation
          // For now, we'll just use the coordinates
          onLocationChange({
            address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            latitude: lat,
            longitude: lng,
          });
          setSearchAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoading(false);
        }
      );
    } else {
      setIsLoading(false);
    }
  };

  const handleSearchAddress = () => {
    if (searchAddress.trim()) {
      // In a real implementation, you would geocode the address
      // For now, we'll just use default coordinates
      onLocationChange({
        address: searchAddress,
        latitude: 27.7172,
        longitude: 85.3240,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Store Location
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter store address"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleSearchAddress}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        <Button
          type="button"
          variant="outline"
          onClick={handleGetCurrentLocation}
          disabled={isLoading}
          className="w-full"
        >
          <MapPin className="h-4 w-4 mr-2" />
          {isLoading ? "Getting Location..." : "Use Current Location"}
        </Button>

        {address && (
          <div className="text-sm text-muted-foreground">
            <p>Selected: {address}</p>
            {latitude && longitude && (
              <p>Coordinates: {Number(latitude).toFixed(6)}, {Number(longitude).toFixed(6)}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}