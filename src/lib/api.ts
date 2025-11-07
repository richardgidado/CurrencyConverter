import axios from 'axios';

const EXCHANGE_RATE_API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY;
const COINMARKETCAP_API_KEY = process.env.NEXT_PUBLIC_COINMARKETCAP_API_KEY;

// Fallback crypto prices (approximate values in USD)
const FALLBACK_CRYPTO_PRICES_USD = {
  BTC: 45000,
  ETH: 2800,
  BNB: 320,
  USDC: 1,
  XRP: 0.62,
  ADA: 0.45,
  USDT: 1,
  SOL: 95,
  PI: 0.0247
};

export async function getExchangeRates() {
  console.log('Fetching exchange rates...');

  try {
    // Primary API - exchangerate-api.com (most reliable)
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD', {
      timeout: 10000
    });
    console.log('Exchange rate API response:', response.data);

    // Convert USD-based rates to NGN-based rates
    const usdToNgn = response.data.rates.NGN;
    const ngnBasedRates: { [key: string]: number } = {};

    // Convert all rates to be NGN-based (1 NGN = X currency)
    // This matches the original working formula
    Object.keys(response.data.rates).forEach(currency => {
      ngnBasedRates[currency] = response.data.rates[currency] / usdToNgn;
    });

    // Ensure NGN is 1
    ngnBasedRates.NGN = 1;

    console.log('Calculated NGN-based rates:', ngnBasedRates);
    return ngnBasedRates;
  } catch (error) {
    console.error('Primary exchange rate API failed:', error);

    // Fallback to secondary API
    try {
      console.log('Trying fallback API...');
      const fallbackResponse = await axios.get(`https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/NGN`, {
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
    // Get USD to NGN rate for conversion
    const usdToNgnResponse = await axios.get('https://api.exchangerate-api.com/v4/latest/USD', {
      timeout: 10000
    });
    const usdToNgn = usdToNgnResponse.data.rates.NGN;
    console.log('Current USD to NGN rate:', usdToNgn);

    const cryptoPrices: { [key: string]: number } = {};

    try {
      // Primary: Use CoinGecko for all cryptocurrencies
      console.log('Fetching from CoinGecko...');
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,usd-coin,ripple,cardano,tether,solana,pi-network&vs_currencies=usd`,
        { timeout: 10000 }
      );

      const data = response.data;
      const coinGeckoMap: { [key: string]: string } = {
        'bitcoin': 'BTC',
        'ethereum': 'ETH',
        'binancecoin': 'BNB',
        'usd-coin': 'USDC',
        'ripple': 'XRP',
        'cardano': 'ADA',
        'tether': 'USDT',
        'solana': 'SOL',
        'pi-network': 'PI'
      };

      let fetchedCount = 0;
      Object.keys(coinGeckoMap).forEach(coinId => {
        if (data[coinId] && data[coinId].usd) {
          const symbol = coinGeckoMap[coinId];
          cryptoPrices[symbol] = data[coinId].usd * usdToNgn;
          console.log(`CG ${symbol}: $${data[coinId].usd} = ₦${cryptoPrices[symbol].toLocaleString()}`);
          fetchedCount++;
        }
      });
     
      // If CoinGecko worked for some coins, fill missing with fallback
      if (fetchedCount > 0) {
        console.log(`CoinGecko successful for ${fetchedCount} coins, using fallbacks for others`);
        Object.keys(FALLBACK_CRYPTO_PRICES_USD).forEach(symbol => {
          if (!cryptoPrices[symbol]) {
            cryptoPrices[symbol] = FALLBACK_CRYPTO_PRICES_USD[symbol as keyof typeof FALLBACK_CRYPTO_PRICES_USD] * usdToNgn;
            console.log(`Fallback ${symbol}: ₦${cryptoPrices[symbol].toLocaleString()}`);
          }
        });
      } else {
        throw new Error('CoinGecko returned no data');
      }

    } catch (cgError) {
      console.error('CoinGecko failed, using CoinMarketCap:', cgError);

      // Fallback to CoinMarketCap if available
      if (COINMARKETCAP_API_KEY) {
        try {
          const cmcResponse = await axios.get(`${'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest'}?symbol=BTC,ETH,BNB,USDC,XRP,ADA,USDT,SOL,PI&convert=USD`, {
            headers: {
              'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY,
              'Accept': 'application/json',
            },
            timeout: 10000
          });

          const cryptoData = cmcResponse.data.data;
          Object.keys(cryptoData).forEach(symbol => {
            const crypto = cryptoData[symbol];
            const usdPrice = crypto.quote.USD.price;
            cryptoPrices[symbol] = usdPrice * usdToNgn;
            console.log(`CMC ${symbol}: $${usdPrice.toFixed(2)} = ₦${cryptoPrices[symbol].toLocaleString()}`);
          });

        } catch (cmcError) {
          console.error('CoinMarketCap also failed, using all fallbacks:', cmcError);
          // Use all fallback prices
          Object.keys(FALLBACK_CRYPTO_PRICES_USD).forEach(symbol => {
            cryptoPrices[symbol] = FALLBACK_CRYPTO_PRICES_USD[symbol as keyof typeof FALLBACK_CRYPTO_PRICES_USD] * usdToNgn;
          });
        }
      } else {
        // Use all fallback prices
        Object.keys(FALLBACK_CRYPTO_PRICES_USD).forEach(symbol => {
          cryptoPrices[symbol] = FALLBACK_CRYPTO_PRICES_USD[symbol as keyof typeof FALLBACK_CRYPTO_PRICES_USD] * usdToNgn;
        });
      }
    }

    console.log('Final crypto prices in NGN:', cryptoPrices);
    return cryptoPrices;

  } catch (error) {
    console.error('Overall crypto fetch failed:', error);
    return null;
  }
}