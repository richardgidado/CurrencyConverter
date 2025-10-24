import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY; // Add your API key in .env.local

// Using high-quality exchange rate APIs (similar to what Google uses)
const PRIMARY_API_URL = 'https://api.exchangerate-api.com/v4/latest/USD'; // High-quality free API
const FALLBACK_API_URL = 'https://v6.exchangerate-api.com/v6'; // Your current API as fallback

// Crypto API - CoinGecko free API
const CRYPTO_API_URL = 'https://api.coingecko.com/api/v3/simple/price';

export async function getExchangeRates() {
  console.log('Fetching exchange rates...');

  // Try Google Finance API first (through a proxy or direct access)
  try {
    console.log('Trying Google Finance API...');
    // Google Finance doesn't have a direct REST API, so we'll use a reliable alternative
    const response = await axios.get(`${PRIMARY_API_URL}`);
    console.log('Alternative API response:', response.data);

    // Convert USD-based rates to NGN-based rates
    const usdToNgn = response.data.rates.NGN;
    const ngnBasedRates: { [key: string]: number } = {};

    // Convert all rates to be NGN-based
    Object.keys(response.data.rates).forEach(currency => {
      ngnBasedRates[currency] = response.data.rates[currency] / usdToNgn;
    });

    // Ensure NGN is 1
    ngnBasedRates.NGN = 1;

    return ngnBasedRates;
  } catch {
    console.log('Alternative API failed, trying fallback API...');

    // Fallback to your current API
    try {
      const response = await axios.get(`${FALLBACK_API_URL}/${API_KEY}/latest/NGN`);
      console.log('Fallback API response:', response.data);
      return response.data.conversion_rates;
    } catch (fallbackError) {
      console.error('Both APIs failed:', fallbackError);
      return null;
    }
  }
}

export async function getCryptoPrices() {
  console.log('Fetching crypto prices...');

  try {
    const response = await axios.get(`${CRYPTO_API_URL}?ids=bitcoin,ethereum,binancecoin,usd-coin,ripple,cardano,tether,solana&vs_currencies=usd`);
    console.log('Crypto API response:', response.data);

    // Convert to NGN using current USD to NGN rate
    const usdToNgnResponse = await axios.get(PRIMARY_API_URL);
    const usdToNgn = usdToNgnResponse.data.rates.NGN;

    const cryptoPrices: { [key: string]: number } = {
      BTC: response.data.bitcoin.usd * usdToNgn,
      ETH: response.data.ethereum.usd * usdToNgn,
      BNB: response.data.binancecoin.usd * usdToNgn,
      USDC: response.data['usd-coin'].usd * usdToNgn,
      XRP: response.data.ripple.usd * usdToNgn,
      ADA: response.data.cardano.usd * usdToNgn,
      USDT: response.data.tether.usd * usdToNgn,
      SOL: response.data.solana.usd * usdToNgn,
    };

    return cryptoPrices;
  } catch (error) {
    console.error('Crypto API failed:', error);
    return null;
  }
}