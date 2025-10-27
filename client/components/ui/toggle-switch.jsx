import React from 'react';

export function ToggleSwitch({ isActive, onChange, disabled = false, label = 'Active for Listing' }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => !disabled && onChange(!isActive)}
        disabled={disabled}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
          isActive ? 'bg-green-500' : 'bg-gray-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'}`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
            isActive ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className={`text-xs font-semibold ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
          {isActive ? '✅ Active' : '❌ Inactive'}
        </span>
      </div>
    </div>
  );
}
