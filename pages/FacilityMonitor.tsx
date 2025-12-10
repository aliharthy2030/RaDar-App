import React from 'react';
import { Building2, ArrowUpRight, ArrowDownLeft, AlertOctagon, Activity } from 'lucide-react';

const facilities = [
  { id: 'FAC-101', name: 'مصنع الرياض للبلاستيك', type: 'Factory', in: 500, out: 480, flow: 1200000, risk: 'Low' },
  { id: 'FAC-102', name: 'مستودعات جدة المركزية', type: 'Warehouse', in: 1200, out: 300, flow: 200000, risk: 'High' }, // High accumulation, low money flow mismatch
  { id: 'FAC-103', name: 'شركة التوزيع الشرقية', type: 'Distributor', in: 800, out: 800, flow: 3500000, risk: 'Low' },
];

const FacilityMonitor: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-slate-800">مراقبة المصانع والمخازن</h2>
         <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium">
            يتم تحليل البيانات للكشف عن التستر التجاري وغسيل الأموال
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {facilities.map(fac => (
          <div key={fac.id} className={`bg-white p-6 rounded-xl border-t-4 shadow-sm ${
            fac.risk === 'High' ? 'border-t-red-500' : 'border-t-green-500'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <Building2 size={24} className="text-slate-600" />
              </div>
              {fac.risk === 'High' && (
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                  نشاط مشبوه
                </span>
              )}
            </div>
            
            <h3 className="font-bold text-lg text-slate-800 mb-1">{fac.name}</h3>
            <p className="text-sm text-slate-500 mb-4">{fac.type} - {fac.id}</p>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 flex items-center gap-1">
                   <ArrowDownLeft size={14} className="text-blue-500"/> وارد (طن)
                </span>
                <span className="font-medium">{fac.in}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 flex items-center gap-1">
                   <ArrowUpRight size={14} className="text-green-500"/> صادر (طن)
                </span>
                <span className="font-medium">{fac.out}</span>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                 <span className="text-slate-500 text-sm">التدفق المالي</span>
                 <span className="font-bold text-slate-800">{fac.flow.toLocaleString()} SAR</span>
              </div>
            </div>

            {fac.risk === 'High' && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg flex gap-2 items-start">
                 <AlertOctagon size={16} className="mt-0.5 shrink-0" />
                 <p>تنبيه: حجم الوارد أعلى بكثير من الصادر مع تدفق مالي منخفض. احتمال تخزين غير قانوني أو تستر.</p>
              </div>
            )}
            
            <button className="w-full mt-4 border border-slate-200 text-slate-600 hover:bg-slate-50 py-2 rounded-lg text-sm font-medium transition-colors">
               عرض السجل الكامل
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacilityMonitor;