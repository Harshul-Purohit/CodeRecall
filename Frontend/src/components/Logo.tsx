import React from 'react';

export const Logo: React.FC = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mr-[10px] flex-shrink-0 inline-block align-middle"
      aria-label="CodeRecall Logo"
    >
      {/* Rounded quadrant segment: #FFFFFF (Pure White) */}
      <path
        d="M 3 13 C 3 7.477 7.477 3 13 3 L 13 13 Z"
        fill="#FFFFFF"
      />
      {/* Rounded triangle wedge: #F25912 (Burnt Orange) */}
      <path
        d="M 13 13 L 21 13 C 21 17.418 17.418 21 13 21 Z"
        fill="#F25912"
      />
      {/* Small circle dot: #F25912 (Burnt Orange) */}
      <circle cx="18" cy="6" r="2.5" fill="#F25912" />
    </svg>
  );
};
