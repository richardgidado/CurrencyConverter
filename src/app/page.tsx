'use client';

import { useEffect, useState } from 'react';
import { getExchangeRates } from '@/lib/api';
import CurrencyCard from '@/components/CurrencyCard';
import Calculator from '@/components/Calculator';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  const [rates, setRates] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const fetchRates = async () => {
      const fetchedRates = await getExchangeRates();
      setRates(fetchedRates);
      setLastUpdated(new Date());
    };
    fetchRates();

    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(savedTheme === 'dark' || (!savedTheme && prefersDark));

    // Set up interval to refresh rates every 1 minute (60000 ms)
    const interval = setInterval(fetchRates, 60000);

    return () => clearInterval(interval);
  }, []);

  const currencies = [
    { code: 'USD', country: 'United States' },
    { code: 'GBP', country: 'United Kingdom' },
    { code: 'CNY', country: 'China' },
    { code: 'AED', country: 'Dubai (UAE)' },
    { code: 'GHS', country: 'Ghana' },
    { code: 'CAD', country: 'Canada' },
    { code: 'ZAR', country: 'South Africa' },
  ];

  return (
    <main className={`min-h-screen p-4 sm:p-8 ${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Currency to Naira Converter
          </h1>
          <ThemeToggle />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Currency Cards Section */}
          <div className="lg:col-span-2">
            <h1 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
              Exchange Rates
              <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">
                Updates every minute • Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {rates &&
                currencies.map(({ code, country }) => (
                  <CurrencyCard
                    key={code}
                    currency={code}
                    rate={rates[code]}
                    country={country}
                  />
                ))}
            </div>
          </div>

          {/* Calculator Section */}
          <div className="lg:col-span-1">
            <h1 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
              Currency Calculator
            </h1>
            {rates && <Calculator rates={rates} />}
          </div>
        </div>
      </div>
    </main>
  );
}