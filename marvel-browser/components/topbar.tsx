import React from 'react';

export default function TopBar() {
  return (
    <div className="bg-gray-800 text-white py-4 flex items-center justify-between px-6">
      {/* Logo Image */}
      <img
        src="/logo.png"
        alt="Logo"
        className="w-30 h-12"
      />

      {/* Title */}
      <h1 className="text-2xl font-bold text-center flex-1">Marvel Comics</h1>

      <div className="w-12 h-12"></div>
    </div>
  );
}
