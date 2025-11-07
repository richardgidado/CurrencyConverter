const axios = require('axios');

async function testHybridCryptoAPI() {
  console.log('Testing Hybrid Crypto API Approach...');
  console.log('=====================================');
  
  try {
    // Test CoinMarketCap for mainstream crypto
    console.log('1. Testing CoinMarketCap API...');
    const cmcResponse = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC,ETH,BNB&convert=USD', {
      headers: {
        'X-CMC_PRO_API_KEY': 'ac0e9764fdc440c0a44464835bd0b9a4',
        'Accept': 'application/json',
      },
      timeout: 10000
    });
    
    console.log('✅ CoinMarketCap Status:', cmcResponse.status);
    const cmcData = cmcResponse.data.data;
    Object.keys(cmcData).forEach(symbol => {
      const crypto = cmcData[symbol];
      console.log(`✅ CMC ${symbol}: $${crypto.quote.USD.price.toFixed(2)}`);
    });
    
    // Test CoinGecko for Pi Network
    console.log('\n2. Testing CoinGecko API for Pi Network...');
    const cgResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=pi-network&vs_currencies=usd', {
      timeout: 10000
    });
    
    console.log('✅ CoinGecko Status:', cgResponse.status);
    if (cgResponse.data['pi-network'] && cgResponse.data['pi-network'].usd) {
      const piPrice = cgResponse.data['pi-network'].usd;
      console.log(`✅ CG PI: $${piPrice.toFixed(4)}`);
    } else {
      console.log('❌ Pi Network price not found in CoinGecko response');
      console.log('Available data:', Object.keys(cgResponse.data));
    }
    
    // Test USD to NGN conversion
    console.log('\n3. Testing USD to NGN conversion...');
    const fxResponse = await axios.get('https://api.exchangerate-api.com/v4/latest/USD', {
      timeout: 10000
    });
    
    const usdToNgn = fxResponse.data.rates.NGN;
    console.log(`✅ USD to NGN: 1 USD = ₦${usdToNgn.toFixed(2)}`);
    
    // Calculate final NGN prices
    console.log('\n4. Final NGN Prices:');
    Object.keys(cmcData).forEach(symbol => {
      const crypto = cmcData[symbol];
      const ngnPrice = crypto.quote.USD.price * usdToNgn;
      console.log(`✅ ${symbol}: ₦${ngnPrice.toLocaleString()}`);
    });
    
    if (cgResponse.data['pi-network'] && cgResponse.data['pi-network'].usd) {
      const piPrice = cgResponse.data['pi-network'].usd;
      const piNgnPrice = piPrice * usdToNgn;
      console.log(`✅ PI: ₦${piNgnPrice.toLocaleString()}`);
    }
    
    console.log('\n✅ Hybrid API test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testHybridCryptoAPI();