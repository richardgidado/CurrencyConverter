'use client';

import { useEffect, useState } from 'react';
import { getExchangeRates, getCryptoPrices } from '@/lib/api';
import CurrencyCard from '@/components/CurrencyCard';
import Calculator from '@/components/Calculator';

export default function Home() {
  const [rates, setRates] = useState<{ [key: string]: number } | null>(null);
  const [cryptoPrices, setCryptoPrices] = useState<{ [key: string]: number } | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const fetchRates = async () => {
      const fetchedRates = await getExchangeRates();
      setRates(fetchedRates);
      setLastUpdated(new Date());
    };
    fetchRates();
    // Set up interval to refresh rates every 1 minute (60000 ms)
    const interval = setInterval(fetchRates, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchCryptoPrices = async () => {
      if (rates) {
        const prices = await getCryptoPrices();
        setCryptoPrices(prices);
      }
    };
    fetchCryptoPrices();

    // Refresh crypto prices every 30 seconds
    const cryptoInterval = setInterval(fetchCryptoPrices, 30000);

    return () => clearInterval(cryptoInterval);
  }, [rates]);

  useEffect(() => {
    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(savedTheme === 'dark' || (!savedTheme && prefersDark));

    // Force dark mode for production (Vercel)
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      setIsDark(true);
    }
  }, []);

  const currencies = [
    { code: 'USD', country: 'United States', flagUrl: '/flags/us.svg' },
    { code: 'GBP', country: 'United Kingdom', flagUrl: '/flags/gb.svg' },
    { code: 'CNY', country: 'China', flagUrl: '/flags/cn.svg' },
    { code: 'AED', country: 'Dubai (UAE)', flagUrl: '/flags/ae.svg' },
    { code: 'GHS', country: 'Ghana', flagUrl: '/flags/gh.svg' },
    { code: 'CAD', country: 'Canada', flagUrl: '/flags/ca.svg' },
    { code: 'ZAR', country: 'South Africa', flagUrl: '/flags/za.svg' },
  ];

  const cryptos = [
    { code: 'BTC', name: 'Bitcoin', logoUrl: '/crypto/btc.svg' },
    { code: 'ETH', name: 'Ethereum', logoUrl: '/crypto/eth.svg' },
    { code: 'BNB', name: 'Binance Coin', logoUrl: '/crypto/bnb.svg' },
    { code: 'USDC', name: 'USD Coin', logoUrl: '/crypto/usdc.svg' },
    { code: 'XRP', name: 'XRP', logoUrl: '/crypto/xrp.svg' },
    { code: 'ADA', name: 'Cardano', logoUrl: '/crypto/ada.svg' },
    { code: 'USDT', name: 'Tether', logoUrl: '/crypto/usdt.svg' },
    { code: 'SOL', name: 'Solana', logoUrl: '/crypto/sol.svg' },
  ];

  return (
    <main className={`min-h-screen p-4 sm:p-8 ${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-500 bg-clip-text text-transparent mb-2">
              ₦ Currency & Crypto Hub
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Real-time exchange rates & cryptocurrency prices in Nigerian Naira
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Currency Cards Section */}
          <div className="lg:col-span-2">
            <h1 className="text-2xl font-semibold mb-6 text-gray-500 dark:text-gray-200">
              Exchange Rates
              <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">
                Updates every minute • Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {rates &&
                currencies.map(({ code, country, flagUrl }) => (
                  <CurrencyCard
                    key={code}
                    currency={code}
                    rate={rates[code]}
                    country={country}
                    flagUrl={flagUrl}
                  />
                ))}
            </div>

            {/* Crypto Prices Section */}
            <h1 className="text-2xl font-semibold mb-6 mt-12 text-gray-500 dark:text-gray-600">
              Crypto Prices
              <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">
                Updates every 30 seconds
              </span>
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {cryptoPrices &&
                cryptos.map(({ code, name, logoUrl }) => (
                  <CurrencyCard
                    key={code}
                    currency={code}
                    rate={cryptoPrices[code]}
                    country={name}
                    isCrypto={true}
                    logoUrl={logoUrl}
                  />
                ))}
            </div>
          </div>

          {/* Calculator Section */}
          <div className="lg:col-span-1">
            <h1 className="text-2xl font-semibold mb-6 text-gray-500 dark:text-gray-600">
              Currency Calculator
            </h1>
            {rates && <Calculator rates={rates} cryptoPrices={cryptoPrices || undefined} />}
          </div>
        </div>
      </div>
    </main>
  );
}