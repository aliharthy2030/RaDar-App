import React, { useState } from 'react';
import { UserCheck, ShieldAlert, CheckCircle2, XCircle, Truck, Link as LinkIcon } from 'lucide-react';
import { verifyDriverEligibility } from '../services/geminiService';

const DriverRegistry: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Mohammed Al-Saleh',
    iqama: '2432000000',
    visaType: 'Resident',
    health: 'Fit',
    criminal: 'Clean'
  });
  const [result, setResult] = useState<{ status: 'Eligible' | 'Banned', reason: string } | null>(null);
  const [linkedTruck, setLinkedTruck] = useState<string>("");

  const handleCheck = async () => {
    if(!process.env.API_KEY) {
      alert("API Key missing");
      return;
    }
    setLoading(true);
    const res = await verifyDriverEligibility(formData.visaType, formData.health, formData.criminal);
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <UserCheck size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">بوابة أهلية السائقين (المرحلة 1)</h2>
            <p className="text-slate-500">التحقق الأمني والنظامي وربط السائق بالشاحنة (ملف تشغيل)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">اسم السائق</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full p-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">رقم الهوية / الإقامة</label>
              <input 
                type="text" 
                value={formData.iqama}
                onChange={e => setFormData({...formData, iqama: e.target.value})}
                className="w-full p-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">نوع التأشيرة / الإقامة</label>
              <select 
                value={formData.visaType}
                onChange={e => setFormData({...formData, visaType: e.target.value})}
                className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white"
              >
                <option value="Resident">إقامة نظامية (سائق عام/خاص)</option>
                <option value="Citizen">مواطن سعودي</option>
                <option value="Visit">تأشيرة زيارة</option>
                <option value="Transit">عبور</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">الحالة الصحية</label>
              <select 
                value={formData.health}
                onChange={e => setFormData({...formData, health: e.target.value})}
                className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white"
              >
                <option value="Fit">لائق طبياً</option>
                <option value="Unfit">غير لائق / أمراض مزمنة خطرة</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">السجل الجنائي</label>
              <select 
                value={formData.criminal}
                onChange={e => setFormData({...formData, criminal: e.target.value})}
                className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white"
              >
                <option value="Clean">سجل نظيف</option>
                <option value="Record">يوجد سوابق</option>
              </select>
            </div>

            <button 
              onClick={handleCheck}
              disabled={loading}
              className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors"
            >
              {loading ? 'جاري التحقق...' : 'التحقق من الأهلية'}
            </button>
          </div>

          <div className="flex flex-col justify-center">
            {!result && !loading && (
              <div className="text-center text-slate-400 p-8 border-2 border-dashed border-slate-200 rounded-xl">
                <ShieldAlert size={48} className="mx-auto mb-4 opacity-50" />
                <p>أدخل بيانات السائق للتحقق من أهليته للعمل في قطاع النقل</p>
              </div>
            )}

            {result && (
              <div className={`p-8 rounded-xl border-2 text-center transition-all ${
                result.status === 'Eligible' 
                  ? 'border-green-100 bg-green-50' 
                  : 'border-red-100 bg-red-50'
              }`}>
                {result.status === 'Eligible' ? (
                  <CheckCircle2 size={64} className="mx-auto mb-4 text-green-600" />
                ) : (
                  <XCircle size={64} className="mx-auto mb-4 text-red-600" />
                )}
                
                <h3 className={`text-2xl font-bold mb-2 ${
                  result.status === 'Eligible' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result.status === 'Eligible' ? 'مؤهل للعمل' : 'ممنوع من القيادة'}
                </h3>
                
                <p className={`text-lg mb-6 ${
                  result.status === 'Eligible' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {result.reason}
                </p>
                
                {result.status === 'Eligible' && (
                   <div className="mt-6 pt-6 border-t border-green-200 text-left">
                     <label className="block text-sm font-bold text-green-800 mb-2 flex items-center gap-2">
                        <LinkIcon size={16} /> ربط بشاحنة (إنشاء ملف تشغيل)
                     </label>
                     <div className="flex gap-2">
                       <input 
                         placeholder="رقم لوحة الشاحنة المعتمدة" 
                         className="flex-1 p-2 rounded border border-green-200 text-sm"
                         value={linkedTruck}
                         onChange={(e) => setLinkedTruck(e.target.value)}
                       />
                       <button className="bg-green-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-green-700">
                         ربط وتفعيل
                       </button>
                     </div>
                     {linkedTruck && (
                       <p className="text-xs text-green-700 mt-2 flex items-center gap-1">
                         <CheckCircle2 size={12}/> تم إنشاء ملف تشغيل للسائق على المركبة {linkedTruck}
                       </p>
                     )}
                   </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverRegistry;