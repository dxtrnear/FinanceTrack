
export const Button = ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    className = '', 
    ...props 
  }) => {
    const variants = {
      primary: 'bg-[#703BF7] hover:bg-[#5f32d1] text-white',
      secondary: 'bg-[#262626] hover:bg-[#333333] text-white',
      outline: 'border-2 border-[#703BF7] text-[#703BF7] hover:bg-[#703BF7] hover:text-white',
    };
  
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };
  
    return (
      <button
        className={`${variants[variant]} ${sizes[size]} rounded-lg font-medium transition-all duration-200 ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  };
  