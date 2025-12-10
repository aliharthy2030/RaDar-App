import React, { useState } from 'react';
import { ScanLine, CheckCircle2, XCircle, Loader2, ArrowDownToLine } from 'lucide-react';
import { evaluateGateAccess } from '../services/geminiService';
import { GateAccessLog } from '../types';

const GateControl: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [plate, setPlate] = useState('1234 KSA');
  const [driver, setDriver] = useState('Ahmed Salem');
  const [visa, setVisa] = useState('Resident');
  const [logs, setLogs] = useState<GateAccessLog[]>([]);
  const [lastResult, setLastResult] = useState<{ allowed: boolean; message: string } | null>(null);

  const handleScan = async () => {
    if (!process.env.API_KEY) {
      alert("API Key missing");
      return;
    }
    setLoading(true);
    setLastResult(null);
    
    // Simulate AI check
    const result = await evaluateGateAccess(plate, driver, visa);
    
    setLastResult(result);
    setLogs(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      truckPlate: plate,
      driverId: driver,
      location: 'Gate A-1',
      status: result.allowed ? 'Allowed' : 'Denied',
      reason: result.message
    }, ...prev]);
    
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-lg flex justify-between items-center">
        <div>
           <h2 className="text-3xl font-bold mb-2">بوابة التحكم (المرحلة 3)</h2>
           <p className="text-slate-400">فحص أمني وتسجيل الوارد للمستودعات/المصانع</p>
        </div>
        <div className="bg-white/10 p-4 rounded-xl">
           <ScanLine size={48} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scanner Panel */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
           <h3 className="font-bold text-xl mb-6 text-slate-800 border-b pb-4">بيانات نقطة العبور</h3>
           
           <div className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-slate-600 mb-1">رقم اللوحة</label>
               <input 
                 type="text" 
                 value={plate}
                 onChange={e => setPlate(e.target.value)}
                 className="w-full p-4 border border-slate-200 rounded-xl text-lg font-mono tracking-widest bg-slate-50 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-saudi-green"
                 placeholder="1234 ABC"
               />
             </div>
             
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-medium text-slate-600 mb-1">اسم السائق</label>
                 <input 
                   type="text" 
                   value={driver}
                   onChange={e => setDriver(e.target.value)}
                   className="w-full p-3 border border-slate-200 rounded-lg"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-600 mb-1">نوع الإقامة/التأشيرة</label>
                 <select 
                   value={visa}
                   onChange={e => setVisa(e.target.value)}
                   className="w-full p-3 border border-slate-200 rounded-lg bg-white"
                 >
                   <option value="Resident">إقامة نظامية</option>
                   <option value="Citizen">مواطن</option>
                   <option value="Visit">تأشيرة زيارة (مخالف)</option>
                   <option value="Transit">عبور (مؤقت)</option>
                 </select>
               </div>
             </div>

             <button 
               onClick={handleScan}
               disabled={loading}
               className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all transform active:scale-95 ${
                 loading ? 'bg-slate-400' : 'bg-saudi-green hover:bg-green-700 shadow-lg hover:shadow-xl'
               }`}
             >
               {loading ? (
                 <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin"/> جاري التحقق من الداخلية...</span>
               ) : (
                 'تنفيذ الفحص وتسجيل الدخول'
               )}
             </button>
           </div>
           
           {/* Result Area */}
           {lastResult && (
             <div className={`mt-8 p-6 rounded-xl border-2 text-center animate-in fade-in slide-in-from-bottom-4 duration-500 ${
               lastResult.allowed ? 'border-green-100 bg-green-50' : 'border-red-100 bg-red-50'
             }`}>
               {lastResult.allowed ? (
                 <CheckCircle2 size={64} className="mx-auto mb-4 text-green-600" />
               ) : (
                 <XCircle size={64} className="mx-auto mb-4 text-red-600" />
               )}
               <h2 className={`text-3xl font-bold mb-2 ${lastResult.allowed ? 'text-green-800' : 'text-red-800'}`}>
                 {lastResult.allowed ? 'مسموح بالدخول' : 'دخول مرفوض'}
               </h2>
               <p className={`text-lg font-medium ${lastResult.allowed ? 'text-green-700' : 'text-red-700'}`}>
                 {lastResult.message}
               </p>
               
               {lastResult.allowed && (
                 <div className="mt-4 pt-4 border-t border-green-200">
                    <div className="flex items-center justify-center gap-2 text-green-800 font-bold">
                       <ArrowDownToLine />
                       تم تسجيل الشحنة في سجل الوارد
                    </div>
                 </div>
               )}
             </div>
           )}
        </div>

        {/* History Log */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
           <div className="p-6 border-b border-slate-100 bg-slate-50">
             <h3 className="font-bold text-lg text-slate-800">سجل الدخول اليومي (Inbound Log)</h3>
           </div>
           <div className="overflow-y-auto flex-1 p-0">
             {logs.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                 <ScanLine size={48} className="mb-4 opacity-20" />
                 <p>لا توجد عمليات مسجلة اليوم</p>
               </div>
             ) : (
               <table className="w-full text-right">
                 <thead className="bg-slate-50 text-slate-500 text-xs sticky top-0">
                   <tr>
                     <th className="p-4">الوقت</th>
                     <th className="p-4">المركبة</th>
                     <th className="p-4">السائق</th>
                     <th className="p-4">الحالة</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {logs.map((log) => (
                     <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                       <td className="p-4 font-mono text-slate-500 text-sm">{log.timestamp}</td>
                       <td className="p-4 font-bold text-slate-700">{log.truckPlate}</td>
                       <td className="p-4 text-sm text-slate-600">{log.driverId}</td>
                       <td className="p-4">
                         <span className={`px-2 py-1 rounded text-xs font-bold ${
                           log.status === 'Allowed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                         }`}>
                           {log.status === 'Allowed' ? 'دخول' : 'منع'}
                         </span>
                         {log.reason && (
                           <div className="text-[10px] text-red-500 mt-1 truncate max-w-[150px]">{log.reason}</div>
                         )}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default GateControl;