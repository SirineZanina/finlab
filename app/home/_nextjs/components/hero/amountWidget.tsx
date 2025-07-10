'use client';
import React from 'react';
import { motion } from 'motion/react'; // 🛠 Fix here: 'framer-motion', not 'motion/react'
import { Button } from '@/components/ui/button';

const AmountWidget = () => {
  return (
    <motion.div
      className="absolute top-8 right-20 z-10"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="w-[262px] h-[78px] backdrop-blur-xl bg-white/70 rounded-lg shadow-md px-4 pt-3 pb-2 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <p className="text-sm text-secondary-400">Enter amount</p>
            <p className="text-xl font-semibold tracking-tight">$450.00</p>
          </div>
          <Button className="bg-dark-blue hover:bg-dark-blue/90 transition text-white rounded-full px-4 py-2 text-sm font-medium">
            Send
          </Button>
        </div>
        {/* underline */}
        <div className="border-b border-secondary-200 mt-2" />
      </div>
    </motion.div>
  );
};

export default AmountWidget;
