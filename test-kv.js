const { kv } = require('@vercel/kv');

async function testKV() {
  try {
    console.log('Testing Vercel KV connection...');
    
    // Test writing data
    await kv.set('test-key', 'Hello from KV!');
    console.log('✅ Successfully wrote to KV');
    
    // Test reading data
    const value = await kv.get('test-key');
    console.log('✅ Successfully read from KV:', value);
    
    // Test deleting data
    await kv.del('test-key');
    console.log('✅ Successfully deleted from KV');
    
    console.log('🎉 KV connection is working!');
  } catch (error) {
    console.error('❌ KV connection failed:', error.message);
    console.log('\nMake sure you have set up the environment variables:');
    console.log('- KV_URL');
    console.log('- KV_REST_API_URL');
    console.log('- KV_REST_API_TOKEN');
    console.log('- KV_REST_API_READ_ONLY_TOKEN');
  }
}

testKV(); 