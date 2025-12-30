export function Card({ children, className = '', hover = false }) {
  return (
    <div className={`card ${hover ? 'hover:shadow-xl transition-shadow' : ''} ${className}`}>
      {children}
    </div>
  );
}