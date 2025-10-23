import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY; // Add your API key in .env.local

// Using high-quality exchange rate APIs (similar to what Google uses)
const PRIMARY_API_URL = 'https://api.exchangerate-api.com/v4/latest/USD'; // High-quality free API
const SECONDARY_API_URL = 'https://api.fixer.io/latest?access_key=YOUR_FIXER_API_KEY'; // Premium option
const FALLBACK_API_URL = 'https://v6.exchangerate-api.com/v6'; // Your current API as fallback

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
  } catch (error) {
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