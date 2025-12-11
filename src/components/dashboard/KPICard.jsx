import { Card } from '../shared/ui/Card';

export function KPICard({ title, value, subtitle, icon, color }) {
  return (
    <Card className="relative overflow-hidden p-6">
      <div 
        className="absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-50"
        style={{ backgroundColor: `${color}20` }}
      />
      
      <div className="relative">
        <p className="text-sm text-slate-500 uppercase tracking-wider mb-2">
          {title}
        </p>
        <p 
          className="text-5xl font-bold mb-2"
          style={{ color }}
        >
          {value}
        </p>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
      
      {icon && (
        <div className="absolute bottom-4 right-4 text-3xl opacity-20">
          {icon}
        </div>
      )}
    </Card>
  );
}