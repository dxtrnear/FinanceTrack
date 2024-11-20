// src/components/ui/Card.jsx
export const Card = ({ children, title, className = '', ...props }) => {
    return (
      <div className={`bg-[#262626] rounded-xl p-6 ${className}`} {...props}>
        {title && <h3 className="text-white text-xl font-semibold mb-4">{title}</h3>}
        {children}
      </div>
    );
  };