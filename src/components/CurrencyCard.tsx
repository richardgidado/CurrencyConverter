'use client';

import { motion } from 'framer-motion';

interface CurrencyCardProps {
  currency: string;
  rate: number;
  country: string;
}

export default function CurrencyCard({ currency, rate, country }: CurrencyCardProps) {
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:scale-105"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{country}</h3>
        <span className="text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
          {currency}
        </span>
      </div>
      <div className="space-y-2">
        <p className="text-3xl font-bold text-green-600 dark:text-green-400">
          ₦{(1 / rate).toFixed(2)}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          1 {currency} = ₦{(1 / rate).toFixed(2)}
        </p>
      </div>
    </motion.div>
  );
}