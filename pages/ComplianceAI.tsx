import React, { useState } from 'react';
import { analyzeShipmentCompliance } from '../services/geminiService';
import { AiAnalysisResult } from '../types';
import { ShieldCheck, Search, FileText, AlertOctagon, CheckCircle2, AlertTriangle } from 'lucide-react';

const ComplianceAI: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiAnalysisResult | null>(null);
  
  // Form State
  const [goods, setGoods] = useState("Electronics and Batteries");
  const [origin, setOrigin] = useState("Jeddah Islamic Port");
  const [destination, setDestination] = useState("Riyadh Warehouse District");
  const [value, setValue] = useState(150000);

  const handleAnalysis = async () => {
    if(!process.env.API_KEY) {
      alert("API Key not set in environment.");
      return;
    }
    setLoading(true);
    const data = await analyzeShipmentCompliance(goods, origin, destination, value);
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-saudi-dark to-saudi-green p-8 rounded-2xl text-white shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-bold">المدقق الذكي</h2>
            <p className="text-saudi-light opacity-90">تحليل الامتثال الجمركي والضريبي باستخدام الذكاء الاصطناعي</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Search size={18} />
            بيانات الشحنة
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">وصف البضاعة</label>
              <textarea 
                className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-saudi-green outline-none"
                rows={3}
                value={goods}
                onChange={(e) => setGoods(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">المصدر</label>
              <input 
                type="text" 
                className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">الوجهة</label>
              <input 
                type="text" 
                className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">القيمة المصرحة (SAR)</label>
              <input 
                type="number" 
                className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
              />
            </div>

            <button 
              onClick={handleAnalysis}
              disabled={loading}
              className="w-full bg-saudi-green text-white py-3 rounded-lg font-bold hover:bg-saudi-dark transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {loading ? 'جاري التحليل...' : 'بدء الفحص الذكي'}
              {!loading && <ShieldCheck size={18} />}
            </button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          {!result && !loading && (
            <div className="h-full flex flex-col items-center justify-center bg-slate-50 border border-dashed border-slate-300 rounded-xl p-12 text-slate-400">
              <FileText size={48} className="mb-4" />
              <p>أدخل بيانات الشحنة للبدء في تحليل المخاطر</p>
            </div>
          )}

          {loading && (
            <div className="h-full flex flex-col items-center justify-center bg-white rounded-xl p-12">
              <div className="w-12 h-12 border-4 border-saudi-green border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-saudi-green font-medium">الذكاء الاصطناعي يراجع اللوائح...</p>
            </div>
          )}

          {result && (
            <>
              {/* Risk Score Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                 <div>
                    <h3 className="text-slate-500 font-medium mb-1">مستوى المخاطر</h3>
                    <div className={`text-3xl font-bold flex items-center gap-2 ${
                      result.riskLevel === 'High' ? 'text-red-600' : 
                      result.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {result.riskLevel === 'High' && <AlertOctagon />}
                      {result.riskLevel === 'Medium' && <AlertTriangle />}
                      {result.riskLevel === 'Low' && <CheckCircle2 />}
                      {result.riskLevel === 'High' ? 'عالي الخطورة' : result.riskLevel === 'Medium' ? 'متوسط' : 'منخفض'}
                    </div>
                 </div>
                 <div className="text-left">
                    <h3 className="text-slate-500 font-medium mb-1">الضريبة المقدرة (VAT + Customs)</h3>
                    <p className="text-2xl font-bold text-slate-800">{result.estimatedTax.toLocaleString()} SAR</p>
                 </div>
              </div>

              {/* Analysis Details */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h4 className="font-bold text-lg mb-4 text-slate-800 border-b pb-2">تفاصيل التقرير</h4>
                
                <div className="mb-6">
                  <h5 className="font-semibold text-red-600 mb-2 flex items-center gap-2">
                    <AlertTriangle size={16} />
                    مشاكل الامتثال المرصودة
                  </h5>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 bg-red-50 p-4 rounded-lg">
                    {result.complianceIssues.map((issue, idx) => (
                      <li key={idx}>{issue}</li>
                    ))}
                    {result.complianceIssues.length === 0 && <li>لم يتم رصد مخالفات واضحة.</li>}
                  </ul>
                </div>

                <div>
                  <h5 className="font-semibold text-blue-600 mb-2 flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    التوصيات والإجراءات
                  </h5>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 bg-blue-50 p-4 rounded-lg">
                    {result.recommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplianceAI;