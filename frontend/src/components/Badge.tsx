import React from 'react';

const Badge = () => {
  return (
    <div className="flex justify-center md:justify-start">
      <button className="relative mb-8 inline-flex h-12 overflow-hidden rounded-full p-[1px]">
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#1D7874_0%,transparent_50%,#071E22_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#1D7874_0%,transparent_50%,#55cfc8_100%)]"></span>
        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-muted px-3 py-1 text-sm font-medium backdrop-blur-3xl dark:bg-teal-950 dark:text-white">
          🚀 Business Made Easy
        </span>
      </button>
    </div>
  );
};

export default Badge;
