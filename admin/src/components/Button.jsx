export default function Button({ children, onClick, type = 'button', variant = 'primary', disabled, className = '' }) {
  const baseClasses = 'px-4 py-2 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-green-700 text-white hover:bg-green-600 hover:shadow-md',
    secondary: 'bg-gray-700 text-white hover:bg-gray-600 hover:shadow-md',
    danger: 'bg-red-700 text-white hover:bg-red-600 hover:shadow-md',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
