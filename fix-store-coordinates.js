/**
 * Fix store coordinates for nearby functionality
 */

import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function updateStoreCoordinates() {
  try {
    console.log('🔄 Updating store coordinates...');

    // Siraha, Nepal coordinates and surrounding areas
    const sirahaCoordinates = [
      { lat: 26.6586, lng: 86.2003 }, // Siraha center
      { lat: 26.6750, lng: 86.2150 }, // North area
      { lat: 26.6420, lng: 86.1850 }, // South area
      { lat: 26.6650, lng: 86.2300 }, // East area
      { lat: 26.6500, lng: 86.1700 }, // West area
      { lat: 26.6800, lng: 86.2000 }, // North center
      { lat: 26.6300, lng: 86.2100 }, // South center
      { lat: 26.6600, lng: 86.2400 }, // Far east
      { lat: 26.6450, lng: 86.1600 }, // Far west
      { lat: 26.6900, lng: 86.2200 }, // Far north
    ];

    // Get all stores
    const storesResult = await pool.query('SELECT id, name FROM stores ORDER BY id');
    const stores = storesResult.rows;

    console.log(`Found ${stores.length} stores to update`);

    // Update each store with coordinates
    for (let i = 0; i < stores.length; i++) {
      const store = stores[i];
      const coordinates = sirahaCoordinates[i % sirahaCoordinates.length];
      
      // Add some random variation to make locations more realistic
      const latVariation = (Math.random() - 0.5) * 0.01; // ±0.005 degrees
      const lngVariation = (Math.random() - 0.5) * 0.01; // ±0.005 degrees
      
      const finalLat = coordinates.lat + latVariation;
      const finalLng = coordinates.lng + lngVariation;

      await pool.query(
        'UPDATE stores SET latitude = $1, longitude = $2 WHERE id = $3',
        [finalLat.toString(), finalLng.toString(), store.id]
      );

      console.log(`✅ Updated ${store.name} with coordinates: ${finalLat.toFixed(6)}, ${finalLng.toFixed(6)}`);
    }

    console.log('✅ All store coordinates updated successfully');
  } catch (error) {
    console.error('❌ Error updating store coordinates:', error);
  } finally {
    await pool.end();
  }
}

updateStoreCoordinates();