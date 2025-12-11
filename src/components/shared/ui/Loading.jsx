export function Loading({ size = 'md', text = '' }) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`spinner ${sizes[size]}`} />
      {text && <p className="text-slate-600">{text}</p>}
    </div>
  );
}