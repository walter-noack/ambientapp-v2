export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-slate-100 text-slate-800 border-slate-200',
    bajo: 'bg-red-100 text-red-800 border-red-200',
    basico: 'bg-orange-100 text-orange-800 border-orange-200',
    intermedio: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    avanzado: 'bg-blue-100 text-blue-800 border-blue-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  return (
    <span className={`badge border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}