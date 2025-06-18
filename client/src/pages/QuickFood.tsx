
import { useState, useEffect } from 'react';
import { Clock, Filter, Star, Utensils } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import FoodCard from '../components/FoodCard';
import { useQuery } from '@tanstack/react-query';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  images: string[];
  category: string;
  preparationTime?: string;
  isOnOffer: boolean;
  offerPercentage?: string;
  isVegetarian: boolean;
  isVegan: boolean;
  spiceLevel?: string;
  rating?: string;
  totalReviews?: number;
  storeId: number;
  storeName?: string;
}

export default function QuickFood() {
  const [sortBy, setSortBy] = useState<string>('prep-time');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    }
  });

  // Filter quick food items (preparation time <= 20 minutes)
  const quickFoodItems = allProducts.filter((product: Product) => {
    const prepTime = product.preparationTime ? parseInt(product.preparationTime) : 999;
    const isQuickFood = prepTime <= 20 || product.preparationTime?.toLowerCase().includes('quick') || 
                       product.preparationTime?.toLowerCase().includes('fast');
    
    if (categoryFilter === 'all') return isQuickFood;
    return isQuickFood && product.category?.toLowerCase() === categoryFilter.toLowerCase();
  });

  // Sort items
  const sortedItems = [...quickFoodItems].sort((a, b) => {
    switch (sortBy) {
      case 'prep-time':
        const timeA = parseInt(a.preparationTime || '999');
        const timeB = parseInt(b.preparationTime || '999');
        return timeA - timeB;
      case 'rating':
        const ratingA = parseFloat(a.rating || '0');
        const ratingB = parseFloat(b.rating || '0');
        return ratingB - ratingA;
      case 'price-low':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'price-high':
        return parseFloat(b.price) - parseFloat(a.price);
      default:
        return 0;
    }
  });

  // Get unique categories from quick food items
  const categories = ['all', ...new Set(quickFoodItems.map(item => item.category?.toLowerCase()).filter(Boolean))];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading quick food options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
            <Clock className="h-10 w-10 text-green-500" />
            Quick Bites
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Fast food delivery in 20 minutes or less
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-green-500" />
              <span>Quick Preparation</span>
            </div>
            <div className="flex items-center gap-1">
              <Utensils className="h-4 w-4 text-orange-500" />
              <span>Fresh & Hot</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>Top Rated</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{quickFoodItems.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Quick Items</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">≤ 20 min</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Prep Time</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{categories.length - 1}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">Fast</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Delivery</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter & Sort
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prep-time">Preparation Time</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Food Items Grid */}
        {sortedItems.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Quick Food Items Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your filters or check back later for quick bite options.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
            {sortedItems.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        )}

        {/* Quick Food Benefits */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="text-center">Why Choose Quick Bites?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <Clock className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Lightning Fast</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  All items prepared in 20 minutes or less for when you're in a hurry
                </p>
              </div>
              <div>
                <Utensils className="h-12 w-12 text-orange-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Always Fresh</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Quick doesn't mean compromised quality - fresh ingredients always
                </p>
              </div>
              <div>
                <Star className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Top Rated</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Only the best-rated quick food options from trusted restaurants
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
