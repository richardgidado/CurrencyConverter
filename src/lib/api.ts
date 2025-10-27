import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY; // Add your API key in .env.local

// Using reliable, accurate APIs for real-time data
const EXCHANGE_RATE_API_URL = 'https://api.exchangerate-api.com/v4/latest/USD'; // Reliable free exchange rate API
const CRYPTO_API_URL = 'https://api.coingecko.com/api/v3/simple/price'; // CoinGecko for accurate crypto prices
const ALTERNATIVE_CRYPTO_API = 'https://api.coinpaprika.com/v1/tickers'; // Alternative crypto API as backup

export async function getExchangeRates() {
  console.log('Fetching exchange rates...');

  try {
    // Use a more reliable API endpoint
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD', {
      timeout: 10000 // 10 second timeout
    });
    console.log('Exchange rate API response:', response.data);

    // Convert USD-based rates to NGN-based rates
    const usdToNgn = response.data.rates.NGN;
    const ngnBasedRates: { [key: string]: number } = {};

    // Convert all rates to be NGN-based
    Object.keys(response.data.rates).forEach(currency => {
      ngnBasedRates[currency] = response.data.rates[currency] / usdToNgn;
    });

    // Ensure NGN is 1
    ngnBasedRates.NGN = 1;

    console.log('Calculated NGN-based rates:', ngnBasedRates);
    return ngnBasedRates;
  } catch (error) {
    console.error('Exchange rate API failed:', error);

    // Fallback to a different API
    try {
      console.log('Trying fallback API...');
      const fallbackResponse = await axios.get(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/NGN`, {
        timeout: 10000
      });
      console.log('Fallback API response:', fallbackResponse.data);
      return fallbackResponse.data.conversion_rates;
    } catch (fallbackError) {
      console.error('Fallback API also failed:', fallbackError);
      return null;
    }
  }
}

export async function getCryptoPrices() {
  console.log('Fetching crypto prices...');

  try {
    // Use CoinGecko API with proper timeout
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,usd-coin,ripple,cardano,tether,solana,pi-network&vs_currencies=usd', {
      timeout: 10000 // 10 second timeout
    });
    console.log('CoinGecko API response:', response.data);

    // Get current USD to NGN rate for conversion
    const usdToNgnResponse = await axios.get('https://api.exchangerate-api.com/v4/latest/USD', {
      timeout: 10000
    });
    const usdToNgn = usdToNgnResponse.data.rates.NGN;
    console.log('Current USD to NGN rate:', usdToNgn);

    const cryptoPrices: { [key: string]: number } = {
      BTC: response.data.bitcoin.usd * usdToNgn,
      ETH: response.data.ethereum.usd * usdToNgn,
      BNB: response.data.binancecoin.usd * usdToNgn,
      USDC: response.data['usd-coin'].usd * usdToNgn,
      XRP: response.data.ripple.usd * usdToNgn,
      ADA: response.data.cardano.usd * usdToNgn,
      USDT: response.data.tether.usd * usdToNgn,
      SOL: response.data.solana.usd * usdToNgn,
      PI: response.data['pi-network'].usd * usdToNgn,
    };

    console.log('Calculated crypto prices in NGN:', cryptoPrices);
    return cryptoPrices;
  } catch (error) {
    console.error('CoinGecko API failed:', error);
    return null;
  }
}