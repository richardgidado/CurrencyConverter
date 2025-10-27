// Calculator.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CalculatorProps {
  rates: { [key: string]: number };
  cryptoPrices?: { [key: string]: number };
}

export default function Calculator({ rates, cryptoPrices }: CalculatorProps) {
  // Use a string state to accurately capture decimal input like "0."
  const [amountInput, setAmountInput] = useState<string>('1');
  const [currency, setCurrency] = useState<string>('USD');
  const [isCrypto, setIsCrypto] = useState<boolean>(false);

  // Reset currency when switching between crypto and currency
  useEffect(() => {
    if (isCrypto) {
      setCurrency('BTC');
    } else {
      setCurrency('USD');
    }
  }, [isCrypto]);

  const amount = parseFloat(amountInput) || 0;

  const result = isCrypto
    ? (cryptoPrices && cryptoPrices[currency] ? (amount * cryptoPrices[currency]).toLocaleString('en-US', { maximumFractionDigits: 2 }) : '0.00')
    : (rates[currency] ? (amount / rates[currency]).toFixed(2) : '0.00');

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 sticky top-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-200 flex items-center gap-2">
        <span className="text-2xl">🧮</span>
        Calculate crypto & currency to Naira
      </h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Amount in {currency}
          </label>
          <input
            type="text"
            // Use the string state directly for the input value
            value={amountInput}
            onChange={(e) => {
              const value = e.target.value;
              // Allow empty string, numbers, and decimal points (including '0.' or '.')
              // The regex /^\d*\.?\d*$/ allows for: "", "1", "123.45", "0.", "."
              if (value === '' || /^\d*\.?\d*$/.test(value)) {
                // Set the raw string input
                setAmountInput(value);
              }
            }}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder={isCrypto ? "0.00000000" : "0.00"}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Type
          </label>
          <select
            value={isCrypto ? 'crypto' : 'currency'}
            onChange={(e) => setIsCrypto(e.target.value === 'crypto')}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors mb-4"
          >
            <option value="currency">Currency</option>
            <option value="crypto">Cryptocurrency</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            From {isCrypto ? 'Cryptocurrency' : 'Currency'}
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            {isCrypto
              ? ['BTC', 'ETH', 'BNB', 'USDC', 'XRP', 'ADA', 'USDT', 'SOL', 'PI'].map((curr) => (
                  <option key={curr} value={curr}>
                    {curr}
                  </option>
                ))
              : ['USD', 'GBP', 'CNY', 'AED', 'GHS', 'CAD', 'ZAR', 'JPY'].map((curr) => (
                  <option key={curr} value={curr}>
                    {curr}
                  </option>
                ))
            }
          </select>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Converts to</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              ₦{result}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Nigerian Naira
            </p>
          </div>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          {amountInput || '0'} {currency} = ₦{result} NGN
        </div>
        {isCrypto && (
          <div className="text-xs text-orange-500 dark:text-orange-400 text-center mt-2">
            Note: Crypto prices are in NGN per unit
          </div>
        )}
      </div>
    </motion.div>
  );
}