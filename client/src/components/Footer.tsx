import { Link } from "wouter";
import {
  Store,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  Download,
  Smartphone,
} from "lucide-react";
import { startTransition } from "react";

export default function Footer() {
  const handleDownloadAPK = () => {
    startTransition(() => {
      try {
        const link = document.createElement("a");
        link.href = "/SirahaBazaar.apk";
        link.download = "SirahaBazaar.apk";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Download error:", error);
        // Fallback: open in new tab
        window.open("/SirahaBazaar.apk", "_blank");
      }
    });
  };

  return (
    <footer className="bg-gray-800 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Store className="h-6 w-6" />
              <span className="text-xl font-bold">Siraha Bazaar</span>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Your trusted local marketplace connecting you with the best
              vendors in Siraha.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-white transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <span
                  onClick={handleDownloadAPK}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Download App
                </span>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <Link
                  href="/products?category=1"
                  className="hover:text-white transition-colors"
                >
                  Groceries
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=2"
                  className="hover:text-white transition-colors"
                >
                  Clothing
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=3"
                  className="hover:text-white transition-colors"
                >
                  Electronics
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=4"
                  className="hover:text-white transition-colors"
                >
                  Home & Kitchen
                </Link>
              </li>
            </ul>
          </div>

          {/* Download App */}
          <div>
            <h4 className="font-semibold mb-4">Download Our App</h4>
            <div className="space-y-4">
              {/* Animated App Icon */}
              <div className="flex justify-center">
                <div
                  onClick={handleDownloadAPK}
                  className="relative group cursor-pointer animate-float"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg transform group-hover:scale-110 transition-all duration-300 group-hover:shadow-xl group-hover:animate-glow flex items-center justify-center">
                    <Smartphone className="h-8 w-8 text-white group-hover:brightness-110 transition-all duration-300" />
                  </div>
                  {/* Floating animation elements */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full animate-pulse group-hover:animate-sparkle"></div>
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-green-500 rounded-full animate-pulse delay-300 group-hover:animate-sparkle delay-500"></div>
                  <div className="absolute top-1 -left-2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-700 group-hover:animate-sparkle delay-1000"></div>

                  {/* Download indicator */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white text-gray-800 text-xs px-2 py-1 rounded-full shadow-lg whitespace-nowrap">
                      <Download className="h-3 w-3 inline mr-1" />
                      Tap to download
                    </div>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <div
                onClick={handleDownloadAPK}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg px-4 py-3 text-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg group cursor-pointer"
              >
                <div className="flex items-center justify-center space-x-2 text-white">
                  <Download className="h-4 w-4 group-hover:animate-bounce" />
                  <span className="text-sm font-medium">Download APK</span>
                </div>
                <div className="text-xs text-blue-100 mt-1">Free • 5MB</div>
              </div>

              {/* Contact Info */}
              <div className="text-xs text-gray-400 space-y-1">
                <div className="flex items-center space-x-2">
                  <Mail className="h-3 w-3" />
                  <span>sirahabazzar@gamil.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-3 w-3" />
                  <span>+977-9805916598</span>
                </div>
                <div>Siraha, Nepal</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            &copy; 2025 Siraha Bazaar. Developed by Shankar Yadav. All rights
            reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <div
              onClick={handleDownloadAPK}
              className="hover:text-white transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <Smartphone className="h-3 w-3" />
              <span>Mobile App</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
