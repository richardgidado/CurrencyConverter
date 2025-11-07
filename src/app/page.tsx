'use client';

import { useExchangeRates, useCryptoPrices } from '@/hooks';
import CurrencyCard from '@/components/CurrencyCard';
import Calculator from '@/components/Calculator';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isDark, setIsDark] = useState(false);

  const scrollToCalculator = () => {
    const calculatorSection = document.getElementById('calculator');
    if (calculatorSection) {
      calculatorSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Use custom hooks for cleaner code
  const {
    data: rates,
    isLoading: ratesLoading,
    error: ratesError,
    dataUpdatedAt: ratesUpdatedAt
  } = useExchangeRates();

  const {
    data: cryptoPrices,
    isLoading: cryptoLoading,
    error: cryptoError
  } = useCryptoPrices();

  useEffect(() => {
    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(savedTheme === 'dark' || (!savedTheme && prefersDark));

    // Force dark mode for production (Vercel) and Windows
    if (typeof window !== 'undefined' && (window.location.hostname !== 'localhost' || navigator.platform.includes('Win'))) {
      setIsDark(true);
    }
  }, []);

  const lastUpdated = ratesUpdatedAt ? new Date(ratesUpdatedAt) : new Date();

  const currencies = [
    { code: 'USD', country: 'United States', flagUrl: '/flags/us.svg' },
    { code: 'GBP', country: 'United Kingdom', flagUrl: '/flags/gb.svg' },
    { code: 'CNY', country: 'China', flagUrl: '/flags/cn.svg' },
    { code: 'AED', country: 'Dubai (UAE)', flagUrl: '/flags/ae.svg' },
    { code: 'GHS', country: 'Ghana', flagUrl: '/flags/gh.svg' },
    { code: 'CAD', country: 'Canada', flagUrl: '/flags/ca.svg' },
    { code: 'ZAR', country: 'South Africa', flagUrl: '/flags/za.svg' },
    { code: 'JPY', country: 'Japan', flagUrl: '/flags/jp.svg' },
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
    { code: 'PI', name: 'Pi Network', logoUrl: '/crypto/piimage.png' },
  ];

  return (
    <main className={`min-h-screen p-4 sm:p-8 ${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="text-center mb-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-500 bg-clip-text text-transparent mb-2">
              ₦ Currency & Crypto Hub
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Real-time exchange rates & cryptocurrency prices in Nigerian Naira
            </p>
          </div>
          <button
            onClick={scrollToCalculator}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
          >
            Calculate to ₦
          </button>
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
              {ratesLoading ? (
                <div className="col-span-full">
                  <LoadingSpinner />
                </div>
              ) : ratesError ? (
                <div className="col-span-full text-center text-red-500">
                  <p>Error loading exchange rates</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Retry
                  </button>
                </div>
              ) : rates ? (
                currencies.map(({ code, country, flagUrl }) => (
                  <CurrencyCard
                    key={code}
                    currency={code}
                    rate={rates[code]}
                    country={country}
                    flagUrl={flagUrl}
                  />
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500">
                  No data available
                </div>
              )}
            </div>

            {/* Crypto Prices Section */}
            <h1 className="text-2xl font-semibold mb-6 mt-12 text-gray-500 dark:text-gray-600">
              Crypto Prices
              <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">
                Updates every minute
              </span>
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {cryptoLoading ? (
                <div className="col-span-full">
                  <LoadingSpinner />
                </div>
              ) : cryptoError ? (
                <div className="col-span-full text-center text-red-500">
                  <p>Error loading crypto prices</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Retry
                  </button>
                </div>
              ) : cryptoPrices ? (
                cryptos.map(({ code, name, logoUrl }) => (
                  <CurrencyCard
                    key={code}
                    currency={code}
                    rate={cryptoPrices[code]}
                    country={name}
                    isCrypto={true}
                    logoUrl={logoUrl}
                  />
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500">
                  No data available
                </div>
              )}
            </div>
          </div>

          {/* Calculator Section */}
          <div id="calculator" className="lg:col-span-1">
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