import React from 'react';

const WheatIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M12 2C12 2 13.5 4.5 15 6C16.5 7.5 19 8 19 8C19 8 17 10 16 12C15 14 15 17 15 17L12 22L9 17C9 17 9 14 8 12C7 10 5 8 5 8C5 8 7.5 7.5 9 6C10.5 4.5 12 2 12 2ZM12 4.5C11.5 5.5 10 7 10 7C10 7 11.5 7.5 12 8C12.5 7.5 14 7 14 7C14 7 12.5 5.5 12 4.5Z" />
  </svg>
);

export default WheatIcon;