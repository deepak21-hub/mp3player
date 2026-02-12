import React from 'react';

interface RetroButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'default';
  icon?: string;
  label?: string;
}

const RetroButton: React.FC<RetroButtonProps> = ({ 
  variant = 'default', 
  icon, 
  label, 
  className = '',
  ...props 
}) => {
  let bgClass = 'bg-gray-300';
  let textClass = 'text-black';

  if (variant === 'primary') {
    bgClass = 'bg-blue-800';
    textClass = 'text-white';
  } else if (variant === 'danger') {
    bgClass = 'bg-red-700';
    textClass = 'text-white';
  }

  return (
    <button
      className={`
        relative px-2 py-1 min-w-[30px] font-bold uppercase text-xs
        border-t-2 border-l-2 border-white
        border-b-2 border-r-2 border-gray-800
        active:border-t-gray-800 active:border-l-gray-800
        active:border-b-white active:border-r-white
        active:translate-y-[1px]
        flex items-center justify-center gap-2
        ${bgClass} ${textClass} ${className}
      `}
      {...props}
    >
      {icon && <i className={icon}></i>}
      {label && <span>{label}</span>}
    </button>
  );
};

export default RetroButton;
