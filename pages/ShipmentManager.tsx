import React, { useState } from 'react';
import { Package, Truck, UserCheck, ShieldCheck, ShieldAlert, Navigation, Clock, CheckCircle2, Wallet, AlertTriangle, ArrowRight, Loader2, FileText, Stamp } from 'lucide-react';
import { Shipment, ShipmentTimelineEvent } from '../types';
import { verifyDriverEligibility, verifyTruckCompliance } from '../services/geminiService';

const ShipmentManager: React.FC = () => {
  const [view, setView] = useState<'list' | 'create'>('list');
  const [shipments, setShipments] = useState<Shipment[]>([
    {
      id: 'SH-2024-001',
      trackingNumber: 'KSA-LOG-9921',
      origin: 'Jeddah Islamic Port',
      destination: 'Riyadh Industrial City',
      goodsType: 'Electronics',
      value: 450000,
      driverName: 'Fahad Al-Otaibi',
      driverId: '1029384756',
      truckPlate: '1234 KSA',
      status: 'In Transit',
      financialStatus: 'Escrow',
      timeline: [
        { status: 'Pending', timestamp: '2023-10-25 08:00', location: 'System', description: 'Shipment created and approved' },
        { status: 'Loading', timestamp: '2023-10-25 09:30', location: 'Jeddah Port', description: 'Goods loaded verified' },
        { status: 'In Transit', timestamp: '2023-10-25 10:15', location: 'Jeddah Exit', description: 'Truck departed' },
      ]
    }
  ]);

  // Form State
  const [formData, setFormData] = useState({
    origin: '', destination: '', goods: '', value: '',
    driverName: 'Ahmed Salem', driverIqama: '2345678901', driverVisa: 'Resident',
    truckPlate: '9922 KSA', truckChassis: 'VIN-222', 
    truckInsurance: '2025-01-01', truckFahas: '2025-01-01', truckIstimara: '2025-01-01'
  });

  // Validation State
  const [validating, setValidating] = useState(false);
  const [loadingPermit, setLoadingPermit] = useState<string | null>(null);
  const [complianceResult, setComplianceResult] = useState<{
    driver: { status: 'Eligible' | 'Banned', reason: string } | null;
    truck: { status: 'Active' | 'Banned', violation: string } | null;
  } | null>(null);

  const handlePreCheck = async () => {
    if(!process.env.API_KEY) { alert("API Key missing"); return; }
    setValidating(true);
    setLoadingPermit(null);
    
    // Parallel Check: Driver + Truck
    const [driverRes, truckRes] = await Promise.all([
      verifyDriverEligibility(formData.driverVisa, 'Fit', 'Clean'), // Assume Health/Criminal entered previously
      verifyTruckCompliance(formData.truckPlate, formData.truckChassis, formData.truckInsurance, formData.truckFahas, formData.truckIstimara)
    ]);

    setComplianceResult({ driver: driverRes, truck: truckRes });
    
    // If both valid, generate loading permit
    if (driverRes.status === 'Eligible' && truckRes.status === 'Active') {
      setTimeout(() => {
        setLoadingPermit(`LP-${Math.floor(Math.random() * 100000)}`);
      }, 1000);
    }
    
    setValidating(false);
  };

  const createShipment = () => {
    if (!loadingPermit) return;
    
    const newShipment: Shipment = {
      id: `SH-${Math.floor(Math.random()*10000)}`,
      trackingNumber: `KSA-LOG-${Math.floor(Math.random()*10000)}`,
      origin: formData.origin,
      destination: formData.destination,
      goodsType: formData.goods,
      value: Number(formData.value),
      driverName: formData.driverName,
      driverId: formData.driverIqama,
      truckPlate: formData.truckPlate,
      status: 'Pending',
      financialStatus: 'Pending', 
      timeline: [{
        status: 'Pending',
        timestamp: new Date().toLocaleString(),
        location: 'System',
        description: `Shipment created. Loading Permit ${loadingPermit} Attached.`
      }]
    };
    setShipments([newShipment, ...shipments]);
    setView('list');
    setComplianceResult(null);
    setLoadingPermit(null);
  };

  const updateStatus = (id: string, newStatus: Shipment['status']) => {
    setShipments(prev => prev.map(s => {
      if (s.id !== id) return s;
      
      const newTimeline = [...s.timeline, {
        status: newStatus,
        timestamp: new Date().toLocaleString(),
        location: newStatus === 'Arrived' ? s.destination : 'En Route',
        description: `Status changed to ${newStatus}`
      }];

      let newFinancial = s.financialStatus;
      if (newStatus === 'Loading') newFinancial = 'Escrow'; // Money locked when loading starts
      
      return { ...s, status: newStatus, timeline: newTimeline, financialStatus: newFinancial };
    }));
  };

  const simulateCustomerConfirm = (id: string) => {
    setShipments(prev => prev.map(s => {
      if (s.id !== id) return s;
      return {
        ...s,
        status: 'Delivered',
        financialStatus: 'Released',
        timeline: [...s.timeline, {
          status: 'Delivered',
          timestamp: new Date().toLocaleString(),
          location: s.destination,
          description: 'Customer Confirmed Receipt. Funds Released.'
        }]
      };
    }));
  };

  return (
    <div className="space-y-6">
      {view === 'list' && (
        <>
          <div className="flex justify-between items-center">
            <div>
               <h2 className="text-2xl font-bold text-slate-800">إدارة الشحنات (المراحل 2-5)</h2>
               <p className="text-slate-500">مراقبة، تتبع، وتحرير المدفوعات</p>
            </div>
            <button 
              onClick={() => setView('create')}
              className="bg-saudi-green text-white px-6 py-3 rounded-xl font-bold hover:bg-green-800 transition-colors flex items-center gap-2"
            >
              <Package size={20} />
              تسجيل شحنة جديدة
            </button>
          </div>

          <div className="grid gap-6">
            {shipments.map(shipment => (
              <div key={shipment.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Header */}
                <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white border border-slate-200 rounded-lg">
                      <Package size={24} className="text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{shipment.trackingNumber}</h3>
                      <p className="text-xs text-slate-500">{shipment.id}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                     {/* Financial Badge */}
                     <div className={`px-3 py-1.5 rounded-lg border text-sm font-bold flex items-center gap-2 ${
                       shipment.financialStatus === 'Released' ? 'bg-green-50 border-green-200 text-green-700' :
                       shipment.financialStatus === 'Escrow' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                       'bg-slate-100 border-slate-200 text-slate-500'
                     }`}>
                       <Wallet size={16} />
                       {shipment.financialStatus === 'Released' ? 'تم تحرير الأموال' :
                        shipment.financialStatus === 'Escrow' ? 'أموال معلقة (Escrow)' : 'بانتظار التحميل'}
                     </div>
                     
                     {/* Status Badge */}
                     <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                       shipment.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                       shipment.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                       'bg-slate-100 text-slate-700'
                     }`}>
                       {shipment.status}
                     </span>
                  </div>
                </div>

                <div className="p-6">
                   <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">المسار</p>
                        <div className="font-bold text-slate-800 flex items-center gap-2">
                           {shipment.origin} <ArrowRight size={16} className="text-slate-400"/> {shipment.destination}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">السائق والشاحنة</p>
                        <div className="font-bold text-slate-800">{shipment.driverName}</div>
                        <div className="text-xs text-slate-500">{shipment.truckPlate}</div>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">البضاعة</p>
                        <div className="font-bold text-slate-800">{shipment.goodsType}</div>
                        <div className="text-xs text-slate-500">القيمة: {shipment.value.toLocaleString()} SAR</div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {shipment.status === 'Pending' && (
                           <button onClick={() => updateStatus(shipment.id, 'Loading')} className="w-full bg-slate-800 text-white py-2 rounded text-sm hover:bg-slate-700">بدء التحميل</button>
                        )}
                        {shipment.status === 'Loading' && (
                           <button onClick={() => updateStatus(shipment.id, 'In Transit')} className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-500">إصدار إذن الخروج</button>
                        )}
                        {shipment.status === 'In Transit' && (
                           <button onClick={() => updateStatus(shipment.id, 'Arrived')} className="w-full bg-yellow-500 text-white py-2 rounded text-sm hover:bg-yellow-600">تسجيل الوصول</button>
                        )}
                        {shipment.status === 'Arrived' && (
                           <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-center">
                             <p className="text-xs font-bold text-yellow-800 mb-2">بانتظار تأكيد العميل</p>
                             <p className="text-[10px] text-slate-500 mb-2">سيتم التحرير تلقائياً خلال 24 ساعة</p>
                             <button onClick={() => simulateCustomerConfirm(shipment.id)} className="w-full bg-green-600 text-white py-2 rounded text-sm hover:bg-green-500">محاكاة موافقة العميل</button>
                           </div>
                        )}
                         {shipment.status === 'Delivered' && (
                           <div className="bg-green-50 border border-green-200 p-3 rounded-lg text-center text-green-800 text-sm font-bold flex items-center justify-center gap-2">
                             <CheckCircle2 size={16}/> عملية مكتملة
                           </div>
                        )}
                      </div>
                   </div>

                   {/* Timeline */}
                   <div className="relative">
                      <div className="absolute top-3 right-0 left-0 h-0.5 bg-slate-100"></div>
                      <div className="flex justify-between relative z-10">
                         {['Pending', 'Loading', 'In Transit', 'Arrived', 'Delivered'].map((step, idx) => {
                           const isCompleted = shipment.timeline.some(e => e.status === step);
                           const isCurrent = shipment.status === step;
                           
                           return (
                             <div key={step} className="flex flex-col items-center gap-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] border-2 transition-colors ${
                                  isCompleted || isCurrent ? 'bg-saudi-green border-saudi-green text-white' : 'bg-white border-slate-200 text-slate-300'
                                }`}>
                                   {isCompleted && <CheckCircle2 size={12} />}
                                </div>
                                <span className={`text-[10px] font-bold ${isCurrent ? 'text-saudi-green' : 'text-slate-400'}`}>
                                  {step}
                                </span>
                             </div>
                           );
                         })}
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {view === 'create' && (
        <div className="max-w-4xl mx-auto">
          <button onClick={() => setView('list')} className="mb-4 text-slate-500 hover:text-slate-800 text-sm">
            &rarr; العودة للقائمة
          </button>
          
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
              <div>
                 <h2 className="text-2xl font-bold">المرحلة 2: تسجيل الشحنة وإصدار الإذن</h2>
                 <p className="text-slate-400">إلزامية التحقق من الأهلية قبل التحميل</p>
              </div>
              <ShieldCheck size={32} className="text-saudi-green" />
            </div>

            <div className="p-8 space-y-8">
               {/* Section 1: Cargo Info */}
               <div>
                  <h3 className="font-bold text-slate-800 border-b pb-2 mb-4 flex items-center gap-2">
                     <Package size={18}/> بيانات الشحنة (التخليص الجمركي)
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                     <input placeholder="المصدر (مثال: ميناء جدة)" className="p-3 border rounded-lg bg-slate-50" value={formData.origin} onChange={e => setFormData({...formData, origin: e.target.value})} />
                     <input placeholder="الوجهة (مثال: مستودعات الرياض)" className="p-3 border rounded-lg bg-slate-50" value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} />
                     <input placeholder="نوع البضاعة" className="p-3 border rounded-lg bg-slate-50" value={formData.goods} onChange={e => setFormData({...formData, goods: e.target.value})} />
                     <input type="number" placeholder="القيمة (SAR)" className="p-3 border rounded-lg bg-slate-50" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} />
                  </div>
               </div>

               {/* Section 2: Resources */}
               <div>
                  <h3 className="font-bold text-slate-800 border-b pb-2 mb-4 flex items-center gap-2">
                     <UserCheck size={18}/> ربط السائق والشاحنة (للتدقيق الفوري)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500">بيانات السائق</label>
                        <input className="w-full p-3 border rounded-lg text-sm" placeholder="اسم السائق" value={formData.driverName} onChange={e => setFormData({...formData, driverName: e.target.value})} />
                        <input className="w-full p-3 border rounded-lg text-sm" placeholder="رقم الهوية/الإقامة" value={formData.driverIqama} onChange={e => setFormData({...formData, driverIqama: e.target.value})} />
                        <select className="w-full p-3 border rounded-lg text-sm bg-white" value={formData.driverVisa} onChange={e => setFormData({...formData, driverVisa: e.target.value})}>
                           <option value="Resident">Resident (إقامة)</option>
                           <option value="Visit">Visit Visa (زيارة - مخالف)</option>
                        </select>
                     </div>
                     <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500">بيانات الشاحنة</label>
                        <input className="w-full p-3 border rounded-lg text-sm" placeholder="رقم اللوحة" value={formData.truckPlate} onChange={e => setFormData({...formData, truckPlate: e.target.value})} />
                        <div className="grid grid-cols-3 gap-2">
                           <input type="date" title="تأمين" className="p-2 border rounded text-xs" value={formData.truckInsurance} onChange={e => setFormData({...formData, truckInsurance: e.target.value})} />
                           <input type="date" title="فحص" className="p-2 border rounded text-xs" value={formData.truckFahas} onChange={e => setFormData({...formData, truckFahas: e.target.value})} />
                           <input type="date" title="استمارة" className="p-2 border rounded text-xs" value={formData.truckIstimara} onChange={e => setFormData({...formData, truckIstimara: e.target.value})} />
                        </div>
                     </div>
                  </div>
               </div>

               {/* Section 3: Firewall Action */}
               <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  {!complianceResult && !loadingPermit ? (
                     <div className="text-center">
                        <p className="text-slate-500 mb-4">يجب التحقق من أهلية السائق وسلامة أوراق الشاحنة قبل إصدار إذن النقل</p>
                        <button 
                           onClick={handlePreCheck} 
                           disabled={validating}
                           className="bg-slate-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-700 transition-colors"
                        >
                           {validating ? <span className="flex items-center gap-2"><Loader2 className="animate-spin"/> جاري الاتصال بالجهات الحكومية...</span> : 'تشغيل الفحص وإصدار إذن تحميل'}
                        </button>
                     </div>
                  ) : (
                     <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                           {/* Driver Result */}
                           <div className={`p-4 rounded-lg border ${complianceResult?.driver?.status === 'Eligible' ? 'bg-green-100 border-green-300 text-green-800' : 'bg-red-100 border-red-300 text-red-800'}`}>
                              <h4 className="font-bold flex items-center gap-2">
                                 {complianceResult?.driver?.status === 'Eligible' ? <CheckCircle2 size={18}/> : <ShieldAlert size={18}/>}
                                 السائق: {complianceResult?.driver?.status === 'Eligible' ? 'مؤهل' : 'مرفوض'}
                              </h4>
                              <p className="text-sm mt-1">{complianceResult?.driver?.reason}</p>
                           </div>
                           
                           {/* Truck Result */}
                           <div className={`p-4 rounded-lg border ${complianceResult?.truck?.status === 'Active' ? 'bg-green-100 border-green-300 text-green-800' : 'bg-red-100 border-red-300 text-red-800'}`}>
                              <h4 className="font-bold flex items-center gap-2">
                                 {complianceResult?.truck?.status === 'Active' ? <CheckCircle2 size={18}/> : <ShieldAlert size={18}/>}
                                 الشاحنة: {complianceResult?.truck?.status === 'Active' ? 'سليمة' : 'مخالفة'}
                              </h4>
                              <p className="text-sm mt-1">{complianceResult?.truck?.violation}</p>
                           </div>
                        </div>

                        {loadingPermit ? (
                           <div className="border-2 border-dashed border-saudi-green bg-green-50/50 p-6 rounded-xl text-center">
                              <div className="flex justify-center mb-2 text-saudi-green"><Stamp size={48} /></div>
                              <h3 className="text-xl font-bold text-green-800 mb-1">تم إصدار إذن التحميل بنجاح</h3>
                              <p className="text-3xl font-mono font-bold text-slate-800 tracking-widest my-4">{loadingPermit}</p>
                              <p className="text-sm text-green-700 mb-6">يمكن الآن بدء عملية النقل بشكل نظامي</p>
                              
                              <button 
                                 onClick={createShipment}
                                 className="w-full bg-saudi-green text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 shadow-lg"
                              >
                                 إنشاء الشحنة وبدء الرحلة
                              </button>
                           </div>
                        ) : (
                           <div className="bg-red-50 text-red-600 p-4 text-center font-bold rounded-xl border border-red-200">
                              <AlertTriangle className="inline-block mb-1" /> لا يمكن إنشاء الشحنة: يوجد مخالفات نظامية تمنع النقل.
                              <button onClick={() => { setComplianceResult(null); setLoadingPermit(null); }} className="block w-full text-slate-500 text-sm mt-2 hover:text-slate-600 underline">إعادة الفحص</button>
                           </div>
                        )}
                     </div>
                  )}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipmentManager;