'use client';

import { motion } from 'framer-motion';

interface CurrencyCardProps {
  currency: string;
  rate: number;
  country: string;
  isCrypto?: boolean;
  flagUrl?: string;
  logoUrl?: string;
}

export default function CurrencyCard({ currency, rate, country, isCrypto = false, flagUrl, logoUrl }: CurrencyCardProps) {
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:scale-105"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          {flagUrl && <img src={flagUrl} alt="flag" className="w-6 h-4 rounded-sm" />}
          {logoUrl && <img src={logoUrl} alt="logo" className="w-6 h-6 rounded-full" />}
          {country}
        </h3>
        <span className="text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
          {currency}
        </span>
      </div>
      <div className="space-y-2">
        <p className="text-2xl font-bold text-green-600 dark:text-green-400 break-all">
          ₦{isCrypto ? rate.toLocaleString('en-US', { maximumFractionDigits: 2 }) : (1 / rate).toFixed(2)}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          1 {currency} = ₦{isCrypto ? rate.toLocaleString('en-US', { maximumFractionDigits: 2 }) : (1 / rate).toFixed(2)}
        </p>
      </div>
    </motion.div>
  );
}