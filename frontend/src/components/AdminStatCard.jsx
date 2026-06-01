import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const colorPresets = {
  blue: {
    bg: 'from-blue-50/50 to-white',
    border: 'border-blue-100/50',
    iconBg: 'bg-blue-50 text-blue-500',
    trendUp: 'bg-emerald-50 text-emerald-600',
    trendDown: 'bg-rose-50 text-rose-600',
  },
  green: {
    bg: 'from-emerald-50/50 to-white',
    border: 'border-emerald-100/50',
    iconBg: 'bg-emerald-50 text-emerald-500',
    trendUp: 'bg-emerald-50 text-emerald-600',
    trendDown: 'bg-rose-50 text-rose-600',
  },
  yellow: {
    bg: 'from-yellow-50/30 to-white',
    border: 'border-yellow-100/40',
    iconBg: 'bg-yellow-50 text-yellow-600',
    trendUp: 'bg-emerald-50 text-emerald-600',
    trendDown: 'bg-rose-50 text-rose-600',
  },
  red: {
    bg: 'from-rose-50/50 to-white',
    border: 'border-rose-100/50',
    iconBg: 'bg-rose-50 text-rose-500',
    trendUp: 'bg-emerald-50 text-emerald-600',
    trendDown: 'bg-rose-50 text-rose-600',
  },
  purple: {
    bg: 'from-purple-50/50 to-white',
    border: 'border-purple-100/50',
    iconBg: 'bg-purple-50 text-purple-500',
    trendUp: 'bg-emerald-50 text-emerald-600',
    trendDown: 'bg-rose-50 text-rose-600',
  },
  indigo: {
    bg: 'from-indigo-50/50 to-white',
    border: 'border-indigo-100/50',
    iconBg: 'bg-indigo-50 text-indigo-500',
    trendUp: 'bg-emerald-50 text-emerald-600',
    trendDown: 'bg-rose-50 text-rose-600',
  },
};

const AdminStatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  description, 
  color = 'blue' 
}) => {
  const theme = colorPresets[color] || colorPresets.blue;

  return (
    <div className={`p-5 rounded-2xl border bg-linear-to-br ${theme.bg} ${theme.border} premium-shadow hover-card-lift flex items-center justify-between`}>
      <div className="space-y-2">
        <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
          {title}
        </span>
        <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 font-display">
          {value}
        </h3>
        
        {(trend || description) && (
          <div className="flex items-center gap-2 flex-wrap">
            {trend && (
              <span className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                trend.type === 'up' ? theme.trendUp : theme.trendDown
              }`}>
                {trend.type === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {trend.value}
              </span>
            )}
            {description && (
              <span className="text-[10px] text-gray-400 font-medium">
                {description}
              </span>
            )}
          </div>
        )}
      </div>

      {Icon && (
        <div className={`p-3.5 rounded-xl ${theme.iconBg} shrink-0 shadow-xs`}>
          <Icon size={22} className="stroke-[2.2]" />
        </div>
      )}
    </div>
  );
};

export default AdminStatCard;
