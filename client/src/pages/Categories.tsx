import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAppMode } from "@/hooks/useAppMode";
import { useQuery } from "@tanstack/react-query";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export default function Categories() {
  const { mode } = useAppMode();

  // Fetch categories from API
  const { data: categories = [], isLoading, error } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    retry: 3,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Filter categories based on mode
  const shoppingCategoryIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // IDs 1-12 are shopping categories
  const foodCategoryIds = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]; // IDs 13-24 are food categories

  const filteredCategories = mode === 'shopping' 
    ? categories.filter(cat => shoppingCategoryIds.includes(cat.id))
    : categories.filter(cat => foodCategoryIds.includes(cat.id));

  const pageTitle = mode === 'shopping' ? 'All Categories' : 'Food Menu';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load categories</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">{pageTitle}</h1>
        </div>
        
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-4">
          {filteredCategories.map((category) => (
            <Link key={category.id} href={`/products?category=${category.id}`}>
              <div className="category-card text-center hover:shadow-lg transition-shadow p-2 sm:p-4">
                <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{category.icon}</div>
                <div className="text-xs sm:text-sm font-semibold text-foreground">{category.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}