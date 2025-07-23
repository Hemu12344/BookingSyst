// src/components/ui/button.jsx
export function Button({ children, className = '', ...props }) {
  return (
    <button
      className={`bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md transition duration-300 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
