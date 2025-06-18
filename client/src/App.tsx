import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./hooks/useAuth";
import { CartProvider } from "./hooks/useCart";
import { WishlistProvider } from "./hooks/useWishlist";
import { AppModeProvider, useAppMode } from "./hooks/useAppMode";
import NotFound from "@/pages/not-found";
import NavbarWrapper from "@/components/NavbarWrapper";
import BottomNavbar from "@/components/BottomNavbar";
import Footer from "@/components/Footer";
import ModeSwiper from "@/components/ModeSwiper";
import MobileNotificationBar from "@/components/MobileNotificationBar";
import NotificationTestButton from "@/components/NotificationTestButton";
import ErrorBoundary from "@/components/ErrorBoundary";
import Homepage from "@/pages/Homepage";
import FoodHomepage from "@/pages/FoodHomepage";
import Products from "@/pages/Products";
import ProductDetail from "./pages/ProductDetail";
import QuickFood from './pages/QuickFood';
import StoreDetail from "./pages/StoreDetail";
import RestaurantDetail from "./pages/RestaurantDetail";
import Cart from "./pages/Cart";
import Checkout from "@/pages/Checkout";
import OrderConfirmation from "@/pages/OrderConfirmation";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Stores from "@/pages/Stores";
import Account from "@/pages/Account";
import ShopkeeperDashboard from "@/pages/ShopkeeperDashboard";
import CustomerDashboard from "@/pages/CustomerDashboard";
import AdminPanel from "./pages/AdminPanel";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import EnhancedAdminDashboard from "@/pages/EnhancedAdminDashboard";
import ComprehensiveAdminDashboard from "@/pages/ComprehensiveAdminDashboard";
import ImprovedAdminDashboard from "./pages/ImprovedAdminDashboard";
import AdminResetPage from "./pages/AdminResetPage";
import StoreMaps from "@/pages/StoreMaps";
import RestaurantMaps from "@/pages/RestaurantMaps";
import Wishlist from "@/pages/Wishlist";
import Categories from "@/pages/Categories";
import SellerDashboard from "@/pages/SellerDashboard";
import SellerInventory from "@/pages/SellerInventory";
import SellerPromotions from "@/pages/SellerPromotions";
import SellerOrders from "@/pages/SellerOrders";
import SellerStore from "@/pages/SellerStore";
import AddProduct from "@/pages/AddProduct";
import DeliveryPartnerDashboard from "./pages/DeliveryPartnerDashboard";
import DeliveryPartnerTest from "./pages/DeliveryPartnerTest";
import DeliveryPartnerNotifications from "./pages/DeliveryPartnerNotifications";
import DeliveryTrackingMap from "@/pages/DeliveryTrackingMap";
import TrackingDemo from "@/pages/TrackingDemo";
import DeliveryTrackingDashboard from "@/pages/DeliveryTrackingDashboard";
import DeliveryPartnerQuickReg from "@/pages/DeliveryPartnerQuickReg";
import AdminDeliveryPartners from "@/pages/AdminDeliveryPartners";
import OrderTracking from "@/pages/OrderTracking";
import DeliveryMap from "@/pages/DeliveryMap";
import NotificationBanner from "@/components/NotificationBanner";
import { lazy, useEffect } from "react";

function AppRouter() {
  const { mode } = useAppMode();

  return (
    <div className="relative">
      <Switch>
        <Route path="/" component={mode === 'shopping' ? Homepage : FoodHomepage} />
        <Route path="/categories" component={Categories} />
        <Route path="/food-categories" component={Categories} />
        <Route path="/products" component={Products} />
        <Route path="/products/:id" component={ProductDetail} />
        <Route path="/food/:id" component={ProductDetail} />
        <Route path="/quick-food" component={QuickFood} />
        <Route path="/cart" component={Cart} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/order-confirmation" component={OrderConfirmation} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/stores" component={Stores} />
        <Route path="/restaurants" component={Stores} />
        <Route path="/stores/:id" component={StoreDetail} />
        <Route path="/restaurants/:id" component={RestaurantDetail} />
        <Route path="/store/:id" component={StoreDetail} />
        <Route path="/restaurant/:id" component={RestaurantDetail} />
        <Route path="/account" component={Account} />
        <Route path="/shopkeeper-dashboard" component={ShopkeeperDashboard} />
        <Route path="/customer-dashboard" component={CustomerDashboard} />
        <Route path="/admin" component={ImprovedAdminDashboard} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin/panel" component={AdminPanel} />
        <Route path="/admin/dashboard" component={ImprovedAdminDashboard} />
        <Route path="/store-maps" component={StoreMaps} />
        <Route path="/restaurant-maps" component={RestaurantMaps} />
        <Route path="/wishlist" component={Wishlist} />
        <Route path="/reset-page" component={AdminResetPage} />

        {/* Seller Hub Routes */}
        <Route path="/seller/dashboard" component={SellerDashboard} />
        <Route path="/seller/store" component={SellerStore} />
        <Route path="/seller/inventory" component={SellerInventory} />
        <Route path="/seller/promotions" component={SellerPromotions} />
        <Route path="/seller/orders" component={SellerOrders} />
        <Route path="/seller/products/add" component={AddProduct} />

        {/* Delivery Partner Routes */}
        <Route path="/delivery-partner-dashboard" component={DeliveryPartnerTest} />
        <Route path="/delivery-partner/test" component={DeliveryPartnerTest} />
        <Route path="/delivery-partner/notifications" component={DeliveryPartnerNotifications} />
        <Route path="/delivery-partner/register" component={DeliveryPartnerQuickReg} />
        <Route path="/delivery-partner/dashboard" component={DeliveryPartnerTest} />

        <Route path="/delivery-map/:id" component={DeliveryMap} />
        <Route path="/admin/delivery-partners" component={AdminDeliveryPartners} />

        {/* Order Tracking Route */}
        <Route path="/orders/:orderId/tracking" component={OrderTracking} />

        {/* Real-time Tracking Demo */}
        <Route path="/tracking-demo" component={TrackingDemo} />
        <Route path="/delete-account" component={lazy(() => import("./pages/DeleteAccount"))} />

        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  const { user, isLoading } = useAuth();
  const { mode } = useAppMode();

  // Professional notification system initialization
  useEffect(() => {
    // Request notification permissions professionally
    const initializeNotifications = async () => {
      if ('Notification' in window && Notification.permission === 'default') {
        // Don't immediately request - wait for user interaction
        console.log('Professional notification system ready');
      }

      // Initialize service worker for push notifications
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        try {
          await navigator.serviceWorker.register('/sw.js');
          console.log('Professional push notification service registered');
        } catch (error) {
          console.log('Service worker registration failed:', error);
        }
      }

      // Mobile-specific optimizations
      if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        // Optimize for mobile performance
        document.addEventListener('visibilitychange', () => {
          if (document.hidden) {
            // App went to background - optimize notifications
            console.log('App backgrounded - notification system optimized');
          } else {
            // App came to foreground - resume normal operation
            console.log('App foregrounded - notification system active');
          }
        });
      }
    };

    initializeNotifications();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <AppModeProvider>
                <TooltipProvider>
                  <ErrorBoundary>
                    <div className="min-h-screen flex flex-col">
                      <ErrorBoundary>
                        <NotificationBanner />
                      </ErrorBoundary>
                      <ErrorBoundary>
                        <MobileNotificationBar className="md:hidden" />
                      </ErrorBoundary>
                      <ErrorBoundary>
                        <NavbarWrapper />
                      </ErrorBoundary>
                      <main className="flex-1 pb-16 md:pb-0">
                        <ErrorBoundary>
                          <AppRouter />
                        </ErrorBoundary>
                      </main>
                      <ErrorBoundary>
                        <Footer />
                      </ErrorBoundary>
                      <ErrorBoundary>
                        <BottomNavbar />
                      </ErrorBoundary>
                      <ErrorBoundary>
                        <NotificationTestButton />
                      </ErrorBoundary>
                    </div>
                    <Toaster />
                  </ErrorBoundary>
                </TooltipProvider>
              </AppModeProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;