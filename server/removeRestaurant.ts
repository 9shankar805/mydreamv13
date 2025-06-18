
import { db } from "./db.ts";
import { stores, products } from "../shared/schema.ts";
import { eq } from "drizzle-orm";

async function removeFakeRestaurant() {
  try {
    console.log("🗑️ Removing fake restaurant 'Flavor Town Restaurant'...");
    
    // First, remove all products associated with this store
    const deletedProducts = await db.delete(products)
      .where(eq(products.storeId, 8))
      .returning();
    
    console.log(`✅ Removed ${deletedProducts.length} products from store ID 8`);
    
    // Then remove the store itself
    const deletedStore = await db.delete(stores)
      .where(eq(stores.id, 8))
      .returning();
    
    if (deletedStore.length > 0) {
      console.log(`✅ Successfully removed restaurant: ${deletedStore[0].name}`);
    } else {
      console.log("❌ Restaurant not found or already removed");
    }
    
  } catch (error) {
    console.error("❌ Error removing restaurant:", error);
  }
}

// Run the function
removeFakeRestaurant().then(() => {
  console.log("🏁 Cleanup completed");
  process.exit(0);
}).catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
