import React, { useState } from 'react';
import { Truck, ShieldCheck, AlertTriangle, FileCheck, Siren, CheckCircle2 } from 'lucide-react';
import { verifyTruckCompliance } from '../services/geminiService';
import { TruckProfile } from '../types';

const FleetRegistry: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    plate: '1234 KSA',
    chassis: 'VIN-992837481',
    type: 'Refrigerated',
    capacity: '20',
    insuranceExpiry: '2024-12-01',
    fahasExpiry: '2024-10-15',
    istimaraExpiry: '2025-01-01'
  });
  
  const [registeredTrucks, setRegisteredTrucks] = useState<TruckProfile[]>([
    {
       id: 'T1',
       plateNumber: '9921 KSA',
       chassisNumber: 'VIN-111',
       type: 'Flatbed',
       capacity: 15,
       insuranceExpiry: '2025-01-01',
       fahasExpiry: '2025-01-01',
       istimaraExpiry: '2025-01-01',
       status: 'Active',
       ownerId: 'CMP-101'
    }
  ]);

  const [checkResult, setCheckResult] = useState<{ status: 'Active' | 'Banned', violation: string } | null>(null);

  const handleRegister = async () => {
    if(!process.env.API_KEY) {
      alert("API Key missing");
      return;
    }
    setLoading(true);
    setCheckResult(null);

    // Call simulated Muroor API
    const result = await verifyTruckCompliance(
      formData.plate,
      formData.chassis,
      formData.insuranceExpiry,
      formData.fahasExpiry,
      formData.istimaraExpiry
    );

    setCheckResult(result);
    setLoading(false);

    if (result.status === 'Active') {
      // Add to list if valid
      const newTruck: TruckProfile = {
        id: `T-${Math.floor(Math.random()*1000)}`,
        plateNumber: formData.plate,
        chassisNumber: formData.chassis,
        type: formData.type,
        capacity: Number(formData.capacity),
        insuranceExpiry: formData.insuranceExpiry,
        fahasExpiry: formData.fahasExpiry,
        istimaraExpiry: formData.istimaraExpiry,
        status: 'Active',
        ownerId: 'CURRENT_USER'
      };
      setRegisteredTrucks(prev => [newTruck, ...prev]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-gradient-to-l from-slate-800 to-slate-900 text-white p-8 rounded-2xl shadow-lg flex justify-between items-center relative overflow-hidden">
        <div className="relative z-10">
           <h2 className="text-3xl font-bold mb-2">إدارة الأسطول والشاحنات</h2>
           <p className="text-slate-300">تسجيل ومراقبة امتثال المركبات عبر الربط المباشر مع المرور</p>
        </div>
        <div className="bg-white/10 p-4 rounded-xl relative z-10">
           <Truck size={48} />
        </div>
        <div className="absolute left-0 top-0 h-full w-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Registration Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-fit">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <FileCheck size={20} className="text-saudi-green" />
            تسجيل شاحنة جديدة
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">معلومات المركبة</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <input 
                  placeholder="رقم اللوحة (1234 ABC)"
                  value={formData.plate}
                  onChange={e => setFormData({...formData, plate: e.target.value})}
                  className="p-2 border rounded-lg text-sm bg-slate-50"
                />
                <input 
                  placeholder="رقم الهيكل (VIN)"
                  value={formData.chassis}
                  onChange={e => setFormData({...formData, chassis: e.target.value})}
                  className="p-2 border rounded-lg text-sm bg-slate-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
               <div>
                  <label className="text-xs font-bold text-slate-500">النوع</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full p-2 border rounded-lg text-sm bg-white mt-1"
                  >
                    <option>Refrigerated</option>
                    <option>Flatbed</option>
                    <option>Tanker</option>
                    <option>Container</option>
                  </select>
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-500">الحمولة (طن)</label>
                  <input 
                    type="number"
                    value={formData.capacity}
                    onChange={e => setFormData({...formData, capacity: e.target.value})}
                    className="w-full p-2 border rounded-lg text-sm bg-slate-50 mt-1"
                  />
               </div>
            </div>

            <hr className="border-slate-100 my-2" />
            
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                 <Siren size={12} className="text-red-500" /> تواريخ الانتهاء (للتحقق الآلي)
              </label>
              <div className="space-y-2 mt-2">
                <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
                   <span className="text-sm">التأمين</span>
                   <input type="date" value={formData.insuranceExpiry} onChange={e => setFormData({...formData, insuranceExpiry: e.target.value})} className="bg-transparent text-sm outline-none text-right"/>
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
                   <span className="text-sm">الفحص الدوري</span>
                   <input type="date" value={formData.fahasExpiry} onChange={e => setFormData({...formData, fahasExpiry: e.target.value})} className="bg-transparent text-sm outline-none text-right"/>
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
                   <span className="text-sm">الاستمارة</span>
                   <input type="date" value={formData.istimaraExpiry} onChange={e => setFormData({...formData, istimaraExpiry: e.target.value})} className="bg-transparent text-sm outline-none text-right"/>
                </div>
              </div>
            </div>

            <button 
              onClick={handleRegister}
              disabled={loading}
              className="w-full py-3 bg-saudi-green text-white rounded-lg font-bold hover:bg-green-800 transition-colors flex justify-center items-center gap-2"
            >
              {loading ? 'جاري الاتصال بالمرور...' : 'التحقق والتسجيل'}
            </button>
            
            {checkResult && checkResult.status === 'Banned' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm flex items-start gap-2 animate-pulse">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold">تم رفض التسجيل</p>
                  <p>{checkResult.violation}</p>
                </div>
              </div>
            )}
            
            {checkResult && checkResult.status === 'Active' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 text-sm flex items-center gap-2">
                <CheckCircle2 size={16} />
                <p>المركبة سليمة وتم تسجيلها بنجاح</p>
              </div>
            )}
          </div>
        </div>

        {/* Fleet List */}
        <div className="lg:col-span-2">
           <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center">
               <h3 className="font-bold text-lg">أسطول الشاحنات المسجل</h3>
               <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded">العدد: {registeredTrucks.length}</span>
             </div>
             <table className="w-full text-right">
               <thead className="bg-slate-50 text-slate-500 text-xs">
                 <tr>
                   <th className="p-4">المركبة</th>
                   <th className="p-4">النوع</th>
                   <th className="p-4">الحمولة</th>
                   <th className="p-4">الحالة</th>
                   <th className="p-4">صلاحية الوثائق</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {registeredTrucks.map(truck => (
                   <tr key={truck.id} className="hover:bg-slate-50 transition-colors">
                     <td className="p-4">
                       <div className="font-bold text-slate-800">{truck.plateNumber}</div>
                       <div className="text-xs text-slate-400 font-mono">{truck.chassisNumber}</div>
                     </td>
                     <td className="p-4 text-sm">{truck.type}</td>
                     <td className="p-4 text-sm">{truck.capacity} طن</td>
                     <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          truck.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {truck.status === 'Active' ? 'نشط' : 'محظور'}
                        </span>
                     </td>
                     <td className="p-4">
                        <div className="flex gap-2">
                           <div className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-100" title="تأمين">
                             تأمين: {truck.insuranceExpiry}
                           </div>
                           <div className="text-[10px] bg-purple-50 text-purple-600 px-2 py-1 rounded border border-purple-100" title="فحص">
                             فحص: {truck.fahasExpiry}
                           </div>
                        </div>
                     </td>
                   </tr>
                 ))}
                 {registeredTrucks.length === 0 && (
                   <tr>
                     <td colSpan={5} className="p-8 text-center text-slate-400">لا توجد شاحنات مسجلة</td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FleetRegistry;