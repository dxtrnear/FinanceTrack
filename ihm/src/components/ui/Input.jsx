// src/components/ui/Input.jsx
export const Input = ({ label, error, className = '', ...props }) => {
    return (
      <div className="w-full">
        {label && <label className="block text-white mb-2 text-sm font-medium">{label}</label>}
        <input
          className={`w-full bg-[#262626] text-white rounded-lg px-4 py-2 border-2 border-transparent focus:border-[#703BF7] focus:outline-none placeholder:text-gray-500 ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  };