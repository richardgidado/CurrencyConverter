const axios = require('axios');

async function testCoinMarketCapAPI() {
  console.log('Testing CoinMarketCap API...');
  
  try {
    const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC,ETH,BNB,USDC,XRP,ADA,USDT,SOL&convert=USD', {
      headers: {
        'X-CMC_PRO_API_KEY': 'ac0e9764fdc440c0a44464835bd0b9a4',
        'Accept': 'application/json',
      },
      timeout: 10000
    });
    
    console.log('✅ API Status:', response.status);
    console.log('✅ API Keys:', Object.keys(response.data));
    
    if (response.data.data) {
      console.log('✅ Available Cryptos:', Object.keys(response.data.data));
      Object.keys(response.data.data).forEach(symbol => {
        const crypto = response.data.data[symbol];
        console.log(`✅ ${symbol}: $${crypto.quote.USD.price.toFixed(2)}`);
      });
    } else {
      console.log('❌ No data found');
    }
  } catch (error) {
    console.error('❌ API Test Failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testCoinMarketCapAPI();