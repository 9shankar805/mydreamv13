/**
 * Update store coordinates via API for nearby functionality
 */

const stores = [
  { id: 7, lat: 26.6586, lng: 86.2003 }, // Tech World Electronics - Siraha center
  { id: 8, lat: 26.6750, lng: 86.2150 }, // North area
  { id: 9, lat: 26.6420, lng: 86.1850 }, // South area
  { id: 10, lat: 26.6650, lng: 86.2300 }, // East area
  { id: 11, lat: 26.6500, lng: 86.1700 }, // West area
  { id: 12, lat: 26.6800, lng: 86.2000 }, // North center
  { id: 13, lat: 26.6300, lng: 86.2100 }, // South center
  { id: 14, lat: 26.6600, lng: 86.2400 }, // Far east
  { id: 15, lat: 26.6450, lng: 86.1600 }, // Far west
  { id: 16, lat: 26.6900, lng: 86.2200 }, // Far north
  { id: 17, lat: 26.6550, lng: 86.1900 }, // Southwest
  { id: 18, lat: 26.6700, lng: 86.2250 }, // Northeast
  { id: 19, lat: 26.6350, lng: 86.1950 }, // Southeast
  { id: 20, lat: 26.6850, lng: 86.1800 }, // Northwest
  { id: 21, lat: 26.6400, lng: 86.2200 }, // Central south
  { id: 22, lat: 26.6750, lng: 86.1950 }, // Central north
  { id: 23, lat: 26.6600, lng: 86.1750 }, // Central west
  { id: 24, lat: 26.6500, lng: 86.2350 }, // Central east
  { id: 25, lat: 26.6650, lng: 86.2050 }, // Near center
  { id: 26, lat: 26.6450, lng: 86.2150 }, // Near center south
];

async function updateStoreCoordinates() {
  try {
    console.log('🔄 Updating store coordinates via direct database update...');
    
    const baseUrl = 'http://localhost:5000';
    
    // First get all stores to see what we have
    const response = await fetch(`${baseUrl}/api/stores`);
    const allStores = await response.json();
    
    console.log(`Found ${allStores.length} stores in database`);
    
    for (const store of allStores) {
      // Find coordinates for this store or use default Siraha area
      let coordinates = stores.find(s => s.id === store.id);
      if (!coordinates) {
        // Generate random coordinates around Siraha for stores not in our list
        const baseLat = 26.6586;
        const baseLng = 86.2003;
        const latVariation = (Math.random() - 0.5) * 0.02; // ±0.01 degrees
        const lngVariation = (Math.random() - 0.5) * 0.02; // ±0.01 degrees
        
        coordinates = {
          lat: baseLat + latVariation,
          lng: baseLng + lngVariation
        };
      }
      
      // Update store with PUT request
      const updateResponse = await fetch(`${baseUrl}/api/stores/${store.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...store,
          latitude: coordinates.lat.toString(),
          longitude: coordinates.lng.toString()
        })
      });
      
      if (updateResponse.ok) {
        console.log(`✅ Updated ${store.name} with coordinates: ${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`);
      } else {
        console.log(`❌ Failed to update ${store.name}: ${updateResponse.status}`);
      }
    }
    
    console.log('✅ Store coordinate updates completed');
    
    // Test nearby stores functionality
    console.log('🔄 Testing nearby stores functionality...');
    const testLat = 26.6586;
    const testLng = 86.2003;
    
    const nearbyResponse = await fetch(`${baseUrl}/api/stores/nearby?lat=${testLat}&lon=${testLng}`);
    const nearbyStores = await nearbyResponse.json();
    
    console.log(`✅ Found ${nearbyStores.length} nearby stores`);
    if (nearbyStores.length > 0) {
      console.log('Sample nearby stores:');
      nearbyStores.slice(0, 3).forEach(store => {
        console.log(`  - ${store.name}: ${store.distance.toFixed(2)}km away`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error updating store coordinates:', error);
  }
}

updateStoreCoordinates();