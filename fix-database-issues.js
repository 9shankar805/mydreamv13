/**
 * Fix database integrity issues
 */

const BASE_URL = 'http://localhost:5000';

async function fixProductCategories() {
  try {
    const response = await fetch(`${BASE_URL}/api/products`);
    const products = await response.json();
    
    const categoriesResponse = await fetch(`${BASE_URL}/api/categories`);
    const categories = await response.json();
    const categoryIds = categories.map(c => c.id);
    
    const invalidProducts = products.filter(p => !categoryIds.includes(p.categoryId));
    
    console.log(`Found ${invalidProducts.length} products with invalid categories`);
    
    // Fix by setting default category (Electronics - ID 3)
    for (const product of invalidProducts) {
      const updateResponse = await fetch(`${BASE_URL}/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...product, categoryId: 3 })
      });
      
      if (updateResponse.ok) {
        console.log(`Fixed product ${product.id}: ${product.name}`);
      }
    }
    
    console.log('Database integrity fixes completed');
    
  } catch (error) {
    console.error('Error fixing database issues:', error);
  }
}

fixProductCategories();