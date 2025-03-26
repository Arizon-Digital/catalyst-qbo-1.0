import React from 'react';

export const ApplePayIcon: React.FC<React.ComponentPropsWithoutRef<'svg'>> = ({ ...props }) => (
  <svg
    fill="currentColor"
    width="48" height="40" viewBox="0 0 57 32"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <text x="1" y="20" fontFamily="Arial, sans-serif" fontSize="20" fill="#ffffff" fontWeight="bold">G</text><text x="20" y="20" fontFamily="Arial, sans-serif" fontSize="20" fill="#ffffff">Pay</text>
  </svg>
);
