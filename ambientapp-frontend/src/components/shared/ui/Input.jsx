export function Input({ label, error, type = 'text', className = '', rightElement, ...props }) {
  // Si es tipo number, permitir comas como decimales
  const handleChange = (e) => {
    if (type === 'number' && props.onChange) {
      // Permitir comas y puntos
      let value = e.target.value;
      
      // Solo números, comas, puntos y signo negativo
      value = value.replace(/[^\d,.-]/g, '');
      
      // Crear evento modificado
      const modifiedEvent = {
        ...e,
        target: {
          ...e.target,
          value: value
        }
      };
      
      props.onChange(modifiedEvent);
    } else if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="label">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={`input ${error ? 'border-red-500' : ''} ${className} ${rightElement ? 'pr-10' : ''}`}
          type={type === 'number' ? 'text' : type}
          inputMode={type === 'number' ? 'decimal' : undefined}
          {...props}
          onChange={handleChange}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-2 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}