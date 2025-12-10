import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import StatsCard from '../components/StatsCard';
import { AlertTriangle, CheckCircle, Activity, Ban, Wallet, Building2, Landmark, Siren, FileSearch } from 'lucide-react';

const data = [
  { name: 'الرياض', shipments: 4000, compliance: 90 },
  { name: 'جدة', shipments: 3000, compliance: 85 },
  { name: 'الدمام', shipments: 2000, compliance: 92 },
  { name: 'تبوك', shipments: 1200, compliance: 88 },
  { name: 'جازان', shipments: 1890, compliance: 80 },
  { name: 'القصيم', shipments: 2390, compliance: 95 },
];

const trafficData = [
  { time: '00:00', trucks: 120 },
  { time: '04:00', trucks: 300 },
  { time: '08:00', trucks: 2500 },
  { time: '12:00', trucks: 3200 },
  { time: '16:00', trucks: 2800 },
  { time: '20:00', trucks: 1500 },
  { time: '23:59', trucks: 500 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">نظرة عامة على القطاع اللوجستي</h2>
          <p className="text-slate-500">لوحة التحكم الحكومية المركزية (MoT, ZATCA, MOI)</p>
        </div>
        <div className="flex gap-2">
           <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium animate-pulse flex items-center gap-2">
             <div className="w-2 h-2 bg-green-500 rounded-full"></div>
             النظام الوطني متصل
           </span>
        </div>
      </div>

      {/* Government Integrations Status Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center gap-3">
           <div className="bg-slate-100 p-2 rounded text-slate-600"><Siren size={16} /></div>
           <div><p className="text-xs text-slate-500">وزارة الداخلية</p><p className="text-sm font-bold text-green-600">متصل آمن</p></div>
        </div>
        <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center gap-3">
           <div className="bg-slate-100 p-2 rounded text-slate-600"><Landmark size={16} /></div>
           <div><p className="text-xs text-slate-500">الزكاة والضريبة</p><p className="text-sm font-bold text-green-600">مزامنة حية</p></div>
        </div>
        <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center gap-3">
           <div className="bg-slate-100 p-2 rounded text-slate-600"><Activity size={16} /></div>
           <div><p className="text-xs text-slate-500">وزارة الصحة</p><p className="text-sm font-bold text-green-600">فحص اللياقة</p></div>
        </div>
        <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center gap-3">
           <div className="bg-slate-100 p-2 rounded text-slate-600"><FileSearch size={16} /></div>
           <div><p className="text-xs text-slate-500">الجمارك</p><p className="text-sm font-bold text-green-600">ربط الموانئ</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="أموال معلقة (Escrow)" 
          value="45M SAR" 
          icon={<Wallet className="w-6 h-6" />} 
          trend="+15%"
          color="blue"
        />
        <StatsCard 
          title="سائقين محظورين اليوم" 
          value="142" 
          icon={<Ban className="w-6 h-6" />} 
          trend="+12%"
          color="red"
        />
        <StatsCard 
          title="مصانع مراقبة نشطة" 
          value="3,240" 
          icon={<Building2 className="w-6 h-6" />} 
          trend="+5%"
          color="yellow"
        />
        <StatsCard 
          title="الامتثال الضريبي (ZATCA)" 
          value="98.2%" 
          icon={<CheckCircle className="w-6 h-6" />} 
          trend="+0.5%"
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-2">
          <h3 className="font-bold text-lg mb-6">التدفق التجاري مقابل المالي (مليون ريال)</h3>
          <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={50} />
                <Tooltip 
                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="shipments" fill="#006C35" radius={[0, 4, 4, 0]} barSize={20} name="قيمة البضائع" />
                <Bar dataKey="compliance" fill="#eab308" radius={[0, 4, 4, 0]} barSize={20} name="التحصيل الضريبي" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-lg mb-6">حركة الشاحنات (آخر 24 ساعة)</h3>
          <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="trucks" stroke="#3b82f6" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-lg mb-4">تنبيهات أمنية ومالية عاجلة</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
             <div className="flex items-center gap-4">
                <div className="bg-red-100 p-2 rounded-full text-red-600">
                   <AlertTriangle size={20} />
                </div>
                <div>
                   <h4 className="font-bold text-slate-800">محاولة قيادة بتأشيرة زيارة</h4>
                   <p className="text-sm text-slate-600">نقطة تفتيش القدية - الشاحنة رقم T-9921</p>
                </div>
             </div>
             <button className="text-sm bg-white border border-red-200 text-red-700 px-4 py-2 rounded-lg hover:bg-red-50">
               إيقاف فوري
             </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-100">
             <div className="flex items-center gap-4">
                <div className="bg-yellow-100 p-2 rounded-full text-yellow-600">
                   <Activity size={20} />
                </div>
                <div>
                   <h4 className="font-bold text-slate-800">اختلاف في الميزان التجاري</h4>
                   <p className="text-sm text-slate-600">مصنع الأمل للبلاستيك - بضائع خارجة لا تطابق الدخل المالي</p>
                </div>
             </div>
             <button className="text-sm bg-white border border-yellow-200 text-yellow-700 px-4 py-2 rounded-lg hover:bg-yellow-50">
               تدقيق مالي
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;