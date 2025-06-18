
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Star, Clock, Phone, ArrowLeft, Bike } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FoodCard from "@/components/FoodCard";
import type { Store, Product } from "@shared/schema";

export default function RestaurantDetail() {
  const { id } = useParams();

  const { data: restaurant, isLoading: restaurantLoading, error: restaurantError } = useQuery<Store>({
    queryKey: [`/api/stores/${id}`],
    enabled: !!id,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: menuItems = [], isLoading: menuLoading, error: menuError } = useQuery<Product[]>({
    queryKey: [`/api/products/store/${id}`],
    enabled: !!id && !!restaurant,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (restaurantLoading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading restaurant details...</p>
        </div>
      </div>
    );
  }

  if (restaurantError) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error Loading Restaurant</h2>
          <p className="text-gray-600 mb-4">There was an error loading the restaurant details.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/restaurants">
              <Button variant="outline">Back to Restaurants</Button>
            </Link>
            <Link href="/">
              <Button>Go to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Restaurant not found</h2>
          <p className="text-gray-600 mb-4">The restaurant you're looking for doesn't exist or has been removed.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/restaurants">
              <Button variant="outline">Browse Restaurants</Button>
            </Link>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const deliveryFee = restaurant.deliveryFee ? `₹${restaurant.deliveryFee}` : "Free";
  const minimumOrder = restaurant.minimumOrder ? `₹${restaurant.minimumOrder}` : "";

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Restaurants
            </Button>
          </Link>
        </div>

        

        {/* Restaurant Header */}
        <Card className="mb-8 overflow-hidden">
          <CardContent className="p-0">
            {/* Restaurant Banner */}
            {restaurant.coverImage && (
              <div className="w-full h-32 sm:h-40 md:h-48 bg-gray-200 overflow-hidden">
                <img
                  src={restaurant.coverImage}
                  alt={`${restaurant.name} banner`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400";
                  }}
                />
              </div>
            )}
            
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Restaurant Logo */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
                  <img
                    src={restaurant.logo || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200";
                    }}
                  />
                </div>

                {/* Restaurant Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2">{restaurant.name}</h1>
                  
                  <div className="flex items-center justify-center sm:justify-start mb-3">
                    <div className="flex text-yellow-400 mr-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(Number(restaurant.rating)) ? "fill-current" : ""
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-muted-foreground text-sm">
                      {restaurant.rating} ({restaurant.totalReviews} reviews)
                    </span>
                    <Badge variant="secondary" className="ml-3">
                      {restaurant.isActive ? "Open" : "Closed"}
                    </Badge>
                  </div>

                  {restaurant.description && (
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{restaurant.description}</p>
                  )}

                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-4">
                    {restaurant.cuisineType && (
                      <Badge variant="outline" className="text-xs">
                        {restaurant.cuisineType}
                      </Badge>
                    )}
                    {restaurant.isDeliveryAvailable && (
                      <Badge className="bg-green-500 hover:bg-green-600 text-xs">
                        <Bike className="h-3 w-3 mr-1" />
                        Delivery Available
                      </Badge>
                    )}
                  </div>

                  {/* Restaurant Details Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center justify-center sm:justify-start">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{restaurant.deliveryTime || "25-35 mins"}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start">
                      <Bike className="h-3 w-3 mr-1" />
                      <span>{deliveryFee}</span>
                    </div>
                    {minimumOrder && (
                      <div className="flex items-center justify-center sm:justify-start col-span-2">
                        <span>Min order: {minimumOrder}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center justify-center sm:justify-start">
                      <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="line-clamp-1">{restaurant.address}</span>
                    </div>
                    {restaurant.phone && (
                      <div className="flex items-center justify-center sm:justify-start">
                        <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span>{restaurant.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-row sm:flex-col gap-2 sm:gap-3 w-full sm:w-auto justify-center">
                  {restaurant.phone && (
                    <Button 
                      size="sm"
                      className="flex-1 sm:flex-none"
                      onClick={() => window.open(`tel:${restaurant.phone}`, '_self')}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                  )}
                  
                  {restaurant.latitude && restaurant.longitude && (
                    <Button 
                      size="sm"
                      variant="outline"
                      className="flex-1 sm:flex-none"
                      onClick={() => {
                        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${restaurant.latitude},${restaurant.longitude}`;
                        window.open(mapsUrl, '_blank');
                      }}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Directions
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Menu</span>
              <Badge variant="outline">{menuItems.length} items</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {menuLoading ? (
              <div className="text-center py-8">Loading menu...</div>
            ) : menuItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No menu items available at the moment</p>
                <p className="text-muted-foreground text-sm mt-2">Check back later for delicious options</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
                {menuItems.map((item) => (
                  <FoodCard key={item.id} product={item} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
