
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Smartphone, ShoppingCart, Utensils, MapPin, Star, Shield, Zap } from "lucide-react";
import { Link } from "wouter";

export default function DownloadPage() {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/SirahaBazaar.apk';
    link.download = 'SirahaBazaar.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const features = [
    {
      icon: <ShoppingCart className="h-6 w-6 text-blue-600" />,
      title: "Easy Shopping",
      description: "Browse and shop from local stores with ease"
    },
    {
      icon: <Utensils className="h-6 w-6 text-red-600" />,
      title: "Food Delivery",
      description: "Order delicious food from local restaurants"
    },
    {
      icon: <MapPin className="h-6 w-6 text-green-600" />,
      title: "Location-Based",
      description: "Find stores and restaurants near you"
    },
    {
      icon: <Star className="h-6 w-6 text-yellow-600" />,
      title: "Reviews & Ratings",
      description: "Read reviews and rate your experiences"
    },
    {
      icon: <Shield className="h-6 w-6 text-purple-600" />,
      title: "Secure Payments",
      description: "Safe and secure payment processing"
    },
    {
      icon: <Zap className="h-6 w-6 text-orange-600" />,
      title: "Fast Delivery",
      description: "Quick delivery to your doorstep"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Smartphone className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Download Siraha Bazaar
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            Get the mobile app for the best shopping and food delivery experience in Siraha
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Badge variant="secondary" className="px-4 py-2">
              Version 1.0.0
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              Android
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              Free Download
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Download Card */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Download for Android
              </CardTitle>
              <p className="text-gray-600">
                Get the latest version of Siraha Bazaar mobile app
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="h-8 w-8 text-white" />
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  APK file size: ~5MB
                </p>
              </div>
              
              <Button 
                onClick={handleDownload}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <Download className="mr-2 h-5 w-5" />
                Download APK
              </Button>
              
              <div className="mt-6 text-sm text-gray-500">
                <p className="mb-2">🔒 Safe and verified download</p>
                <p>Compatible with Android 5.0+</p>
              </div>
            </CardContent>
          </Card>

          {/* Installation Instructions */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">
                Installation Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Download the APK</p>
                    <p className="text-sm text-gray-600">Click the download button above</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Enable Unknown Sources</p>
                    <p className="text-sm text-gray-600">Go to Settings > Security > Unknown Sources</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Install the App</p>
                    <p className="text-sm text-gray-600">Open the downloaded APK file and install</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                    ✓
                  </div>
                  <div>
                    <p className="font-medium">Start Shopping!</p>
                    <p className="text-sm text-gray-600">Open the app and enjoy shopping</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Why Choose Siraha Bazaar?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-lg border-0 bg-white/80 backdrop-blur hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* System Requirements */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur mb-12">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 text-center">
              System Requirements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Minimum Requirements</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Android 5.0 (API level 21) or higher</li>
                  <li>• 2GB RAM</li>
                  <li>• 100MB free storage space</li>
                  <li>• Internet connection</li>
                  <li>• GPS capability (for location services)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Android 8.0 or higher</li>
                  <li>• 4GB RAM or more</li>
                  <li>• 500MB free storage space</li>
                  <li>• High-speed internet (4G/WiFi)</li>
                  <li>• Camera (for QR code scanning)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Section */}
        <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
            <p className="text-blue-100 mb-6">
              If you encounter any issues during installation or while using the app, we're here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
                  Visit Website
                </Button>
              </Link>
              <Button variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600">
          <p>&copy; 2025 Siraha Bazaar. All rights reserved.</p>
          <p className="text-sm mt-2">Developed by Shankar Yadav</p>
        </div>
      </div>
    </div>
  );
}
