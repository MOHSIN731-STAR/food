// LoadingSpinner.tsx
'use client';
import React from 'react';

const LoadingSpinner: React.FC<{ label?: string }> = ({ label = 'Loading...' }) => {
  return (
    <>
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        {/* SVG canvas */}
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          className="drop-shadow-sm"
          aria-label="loading"
        >
          {/* Background faint track (optional aesthetic) */}
          <circle cx="60" cy="60" r="46" strokeWidth="10" className="opacity-10" stroke="currentColor" fill="none" />
          <circle cx="60" cy="60" r="36" strokeWidth="10" className="opacity-10" stroke="currentColor" fill="none" />
          <circle cx="60" cy="60" r="26" strokeWidth="10" className="opacity-10" stroke="currentColor" fill="none" />
          <circle cx="60" cy="60" r="16" strokeWidth="10" className="opacity-10" stroke="currentColor" fill="none" />

          {/* FULL ring (outer) */}
          <g className="spin-slow">
            <circle
              cx="60"
              cy="60"
              r="46"
              strokeWidth="10"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray="100 0"
            />
          </g>

          {/* HALF ring #1 */}
          <g className="spin-reverse">
            <circle
              cx="60"
              cy="60"
              r="36"
              strokeWidth="10"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              pathLength={100}
              /* 50% visible, 50% gap */
              strokeDasharray="50 50"
              /* offset to start at top */
              strokeDashoffset="25"
            />
          </g>

          {/* HALF ring #2 (different speed/phase) */}
          <g className="spin">
            <circle
              cx="60"
              cy="60"
              r="26"
              strokeWidth="10"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray="50 50"
              strokeDashoffset="0"
            />
          </g>

          {/* ONE-THIRD ring (inner) */}
          <g className="spin-fast">
            <circle
              cx="60"
              cy="60"
              r="16"
              strokeWidth="10"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              pathLength={100}
              /* ~33% arc, 67% gap */
              strokeDasharray="33 67"
              strokeDashoffset="8"
            />
          </g>
        </svg>
      </div>

      <p className="mt-4 text-sm text-center text-muted-foreground absolute">{label}</p>

      {/* Component-scoped animations */}
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          to { transform: rotate(-360deg); }
        }
        .spin        { transform-origin: 60px 60px; animation: spin 1.2s linear infinite; }
        .spin-slow   { transform-origin: 60px 60px; animation: spin 2.2s linear infinite; }
        .spin-fast   { transform-origin: 60px 60px; animation: spin 0.9s linear infinite; }
        .spin-reverse{ transform-origin: 60px 60px; animation: spin-reverse 1.6s linear infinite; }
      `}</style>
    </div>
    </>
  );
};

export default LoadingSpinner;
