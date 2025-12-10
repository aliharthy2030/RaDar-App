import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color?: 'green' | 'blue' | 'red' | 'yellow';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend, color = 'green' }) => {
  const colorClasses = {
    green: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600'
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
          {trend && <p className={`text-xs mt-2 ${trend.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>{trend} مقارنة بالشهر الماضي</p>}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;