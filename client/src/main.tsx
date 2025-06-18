import { createRoot } from "react-dom/client";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";

try {
  console.log("🔄 Initializing React application...");
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }
  
  // Add a temporary loading indicator
  rootElement.innerHTML = '<div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;"><h2>🏪 Loading Siraha Bazaar...</h2><p>Please wait while we prepare your marketplace experience.</p></div>';
  
  const root = createRoot(rootElement);
  root.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
  
  console.log("✅ React app mounted successfully");
} catch (error: any) {
  console.error("❌ Failed to mount React app:", error);
  console.error("Error details:", error);
  const errorMessage = error?.message || String(error);
  document.body.innerHTML = `
    <div style="padding: 20px; color: red; text-align: center; font-family: Arial, sans-serif;">
      <h2>⚠️ Application Error</h2>
      <p>Error mounting React app: ${errorMessage}</p>
      <p>Please check the console for more details and refresh the page.</p>
    </div>
  `;
}
