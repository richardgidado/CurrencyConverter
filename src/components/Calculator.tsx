'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface CalculatorProps {
  rates: { [key: string]: number };
}

export default function Calculator({ rates }: CalculatorProps) {
  const [amount, setAmount] = useState<number>(1);
  const [currency, setCurrency] = useState<string>('USD');
  const result = rates[currency] ? (amount / rates[currency]).toFixed(2) : '0.00';

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 sticky top-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-200 flex items-center gap-2">
        <span className="text-2xl">🧮</span>
        Calculator
      </h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Amount in {currency}
          </label>
          <input
            type="number"
            value={amount === 0 ? '' : amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            min="0"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            From Currency
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            {['USD', 'GBP', 'CNY', 'AED', 'GHS', 'CAD', 'ZAR'].map((curr) => (
              <option key={curr} value={curr}>
                {curr}
              </option>
            ))}
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
          {amount} {currency} = ₦{result} NGN
        </div>
      </div>
    </motion.div>
  );
}