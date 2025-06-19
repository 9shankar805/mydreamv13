import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, Camera, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ImageUpload from "@/components/ImageUpload";

const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  categoryId: z.number().min(1, "Category is required"),
  description: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  originalPrice: z.string().optional(),
  stock: z.number().min(0, "Stock cannot be negative"),
  images: z.array(z.string()).min(1, "At least 1 image is required").max(6, "Maximum 6 images allowed"),
  imageUrl: z.string().optional(),
  productType: z.enum(["retail", "food"]).default("retail"),
  isFastSell: z.boolean().default(false),
  isOnOffer: z.boolean().default(false),
  offerPercentage: z.number().min(0).max(100).default(0),
  offerEndDate: z.string().optional(),
  // Food-specific fields
  preparationTime: z.string().optional(),
  ingredients: z.array(z.string()).default([]),
  allergens: z.array(z.string()).default([]),
  spiceLevel: z.string().optional(),
  isVegetarian: z.boolean().default(false),
  isVegan: z.boolean().default(false),
  nutritionInfo: z.string().optional(),
});

type ProductForm = z.infer<typeof productSchema>;

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Store {
  id: number;
  name: string;
  storeType: string;
}

interface AddProductFormProps {
  editingProduct?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
  showHeader?: boolean;
}

export default function AddProductForm({ 
  editingProduct, 
  onSuccess, 
  onCancel, 
  showHeader = true 
}: AddProductFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>(editingProduct?.ingredients || []);
  const [allergens, setAllergens] = useState<string[]>(editingProduct?.allergens || []);
  const [newIngredient, setNewIngredient] = useState("");
  const [newAllergen, setNewAllergen] = useState("");

  // Categories query
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Store query to get current store info
  const { data: stores = [] } = useQuery<Store[]>({
    queryKey: [`/api/stores/owner`, user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await fetch(`/api/stores/owner/${user.id}`);
      if (!response.ok) throw new Error('Failed to fetch stores');
      return response.json();
    },
    enabled: !!user,
  });

  const currentStore = stores[0];
  const isRestaurant = currentStore?.storeType === 'restaurant';
  const defaultProductType = isRestaurant ? 'food' : 'retail';

  const form = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: editingProduct?.name || "",
      categoryId: editingProduct?.categoryId || 1,
      description: editingProduct?.description || "",
      price: editingProduct?.price || "",
      originalPrice: editingProduct?.originalPrice || "",
      stock: editingProduct?.stock || 0,
      images: editingProduct?.images || [],
      imageUrl: "",
      productType: editingProduct?.productType || defaultProductType,
      isFastSell: editingProduct?.isFastSell || false,
      isOnOffer: editingProduct?.isOnOffer || false,
      offerPercentage: editingProduct?.offerPercentage || 0,
      offerEndDate: editingProduct?.offerEndDate || "",
      preparationTime: editingProduct?.preparationTime || "",
      ingredients: editingProduct?.ingredients || [],
      allergens: editingProduct?.allergens || [],
      spiceLevel: editingProduct?.spiceLevel || "",
      isVegetarian: editingProduct?.isVegetarian || false,
      isVegan: editingProduct?.isVegan || false,
      nutritionInfo: editingProduct?.nutritionInfo || "",
    },
  });

  const watchProductType = form.watch("productType");
  const watchIsOnOffer = form.watch("isOnOffer");

  const handleAddIngredient = () => {
    if (newIngredient.trim() && !ingredients.includes(newIngredient.trim())) {
      const updated = [...ingredients, newIngredient.trim()];
      setIngredients(updated);
      form.setValue("ingredients", updated);
      setNewIngredient("");
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    const updated = ingredients.filter(i => i !== ingredient);
    setIngredients(updated);
    form.setValue("ingredients", updated);
  };

  const handleAddAllergen = () => {
    if (newAllergen.trim() && !allergens.includes(newAllergen.trim())) {
      const updated = [...allergens, newAllergen.trim()];
      setAllergens(updated);
      form.setValue("allergens", updated);
      setNewAllergen("");
    }
  };

  const handleRemoveAllergen = (allergen: string) => {
    const updated = allergens.filter(a => a !== allergen);
    setAllergens(updated);
    form.setValue("allergens", updated);
  };

  const onSubmit = async (data: ProductForm) => {
    if (!currentStore) {
      toast({
        title: "Error",
        description: "Please create a store first",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const productData = {
        ...data,
        storeId: currentStore.id,
        ingredients,
        allergens,
        productType: isRestaurant ? 'food' : data.productType,
      };

      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error(editingProduct ? 'Failed to update product' : 'Failed to create product');
      }

      const successMessage = editingProduct 
        ? (isRestaurant ? "Menu item updated successfully!" : "Product updated successfully!")
        : (isRestaurant ? "Menu item added successfully!" : "Product added successfully!");
      
      toast({ title: successMessage });
      
      // Invalidate all relevant queries to refresh data
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [`/api/products/store/${currentStore.id}`] }),
        queryClient.invalidateQueries({ queryKey: ["/api/products"] }),
        queryClient.invalidateQueries({ queryKey: ["/api/products/store", user?.id] }),
        queryClient.invalidateQueries({ queryKey: ["/api/seller/inventory", user?.id] }),
        queryClient.invalidateQueries({ queryKey: ["/api/seller/dashboard", user?.id] })
      ]);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: editingProduct 
          ? (isRestaurant ? "Failed to update menu item" : "Failed to update product")
          : (isRestaurant ? "Failed to add menu item" : "Failed to add product"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentStore) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              You need to create a store before adding products.
            </p>
            <Button onClick={onCancel}>Create Store</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      {showHeader && (
        <CardHeader>
          <CardTitle>
            {editingProduct 
              ? (isRestaurant ? 'Edit Menu Item' : 'Edit Product')
              : (isRestaurant ? 'Add New Menu Item' : 'Add New Product')
            }
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {isRestaurant ? 'Menu Item Name *' : 'Product Name *'}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={isRestaurant ? "Enter menu item name" : "Enter product name"} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))} 
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={isRestaurant ? "Describe your menu item..." : "Describe your product..."} 
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price * ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="originalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Price ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isRestaurant ? 'Quantity Available' : 'Stock Quantity'}</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        placeholder="0" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Product Images */}
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Images * (1-6 images)</FormLabel>
                  <FormControl>
                    <ImageUpload
                      label="Product Images"
                      maxImages={6}
                      minImages={1}
                      onImagesChange={field.onChange}
                      initialImages={field.value || []}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Product Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="isFastSell"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-medium">
                        Fast Sell Product
                      </FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Mark as fast-selling/trending item
                      </div>
                    </div>
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="w-4 h-4"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isOnOffer"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-medium">
                        On Offer
                      </FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Mark as discounted item
                      </div>
                    </div>
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="w-4 h-4"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Offer Details */}
            {watchIsOnOffer && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="offerPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Offer Percentage (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          max="100" 
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="offerEndDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Offer End Date</FormLabel>
                      <FormControl>
                        <Input 
                          type="datetime-local" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Food-specific fields */}
            {(isRestaurant || watchProductType === 'food') && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="preparationTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preparation Time</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 15-20 minutes" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="spiceLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Spice Level</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select spice level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="mild">Mild</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hot">Hot</SelectItem>
                            <SelectItem value="very_hot">Very Hot</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Dietary Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="isVegetarian"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-medium">
                            Vegetarian
                          </FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Contains no meat
                          </div>
                        </div>
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="w-4 h-4"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isVegan"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-medium">
                            Vegan
                          </FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Contains no animal products
                          </div>
                        </div>
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="w-4 h-4"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Ingredients */}
                <div className="space-y-4">
                  <FormLabel>Ingredients</FormLabel>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add ingredient"
                      value={newIngredient}
                      onChange={(e) => setNewIngredient(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddIngredient())}
                    />
                    <Button type="button" onClick={handleAddIngredient}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ingredients.map((ingredient) => (
                      <Badge key={ingredient} variant="secondary" className="flex items-center gap-1">
                        {ingredient}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleRemoveIngredient(ingredient)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Allergens */}
                <div className="space-y-4">
                  <FormLabel>Allergens</FormLabel>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add allergen"
                      value={newAllergen}
                      onChange={(e) => setNewAllergen(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAllergen())}
                    />
                    <Button type="button" onClick={handleAddAllergen}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {allergens.map((allergen) => (
                      <Badge key={allergen} variant="destructive" className="flex items-center gap-1">
                        {allergen}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleRemoveAllergen(allergen)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="nutritionInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nutrition Information</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter nutrition information..." 
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="order-2 sm:order-1"
                >
                  Cancel
                </Button>
              )}
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="order-1 sm:order-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                {isSubmitting 
                  ? (editingProduct ? "Updating..." : "Adding...")
                  : (editingProduct 
                    ? (isRestaurant ? "Update Menu Item" : "Update Product")
                    : (isRestaurant ? "Add Menu Item" : "Add Product")
                  )
                }
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}