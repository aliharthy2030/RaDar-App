import React, { useState } from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, AlertCircle, Timer } from 'lucide-react';
import { WalletTransaction } from '../types';

const initialTransactions: WalletTransaction[] = [
  { id: 'TRX-9921', amount: 5000, vatAmount: 750, type: 'Payment', status: 'Held', payer: 'مصنع الأغذية الحديث', payee: 'شركة النقل السريع', shipmentRef: 'SH-2021', timestamp: '2023-10-25 09:30', releaseDeadline: '2023-10-26 09:30' },
  { id: 'TRX-9922', amount: 12000, vatAmount: 1800, type: 'Payment', status: 'Released', payer: 'متجر التجزئة', payee: 'المورد الرئيسي', shipmentRef: 'SH-2019', timestamp: '2023-10-24 14:20', releaseDeadline: '2023-10-25 14:20' },
  { id: 'TRX-9923', amount: 750, vatAmount: 0, type: 'Settlement', status: 'Completed', payer: 'ZATCA', payee: 'System', shipmentRef: 'TAX-OCT', timestamp: '2023-10-24 10:00', releaseDeadline: '-' },
];

const FinancialWallet: React.FC = () => {
  const [transactions, setTransactions] = useState<WalletTransaction[]>(initialTransactions);

  const confirmDelivery = (id: string) => {
    setTransactions(prev => prev.map(t => 
      t.id === id ? { ...t, status: 'Released' } : t
    ));
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-saudi-green rounded-full filter blur-3xl opacity-20 -mr-16 -mt-16"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <p className="text-slate-400 mb-2 font-medium">الرصيد الكلي (المرحلة 5: مكافحة التستر)</p>
            <h2 className="text-4xl font-bold">142,500.00 <span className="text-lg text-saudi-green">SAR</span></h2>
            <div className="flex gap-4 mt-6">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm">متاح للسحب: 97,500 SAR</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-yellow-500/30">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span className="text-sm">معلق (Escrow): 45,000 SAR</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
             <button className="bg-saudi-green hover:bg-green-700 transition-colors px-6 py-3 rounded-xl font-bold flex items-center gap-2">
                <ArrowDownLeft size={18} />
                إيداع أموال
             </button>
             <button className="bg-white/10 hover:bg-white/20 transition-colors px-6 py-3 rounded-xl font-bold flex items-center gap-2">
                <ArrowUpRight size={18} />
                سحب للأيبان
             </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-blue-50/50">
          <h3 className="font-bold text-lg text-slate-800">سجل العمليات المالية والضريبية</h3>
          <div className="flex items-center gap-2 text-sm text-blue-700 bg-white px-4 py-2 rounded-lg border border-blue-100 shadow-sm">
            <Timer size={18} className="text-blue-600" />
            <span className="font-bold">قاعدة الـ 24 ساعة:</span> يتم تحرير الأموال المعلقة تلقائياً للبائع إذا لم يعترض المستهلك.
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 text-slate-500 text-sm">
              <tr>
                <th className="p-4 font-medium">رقم العملية</th>
                <th className="p-4 font-medium">{'التفاصيل (من -> إلى)'}</th> 
                <th className="p-4 font-medium">المبلغ</th>
                <th className="p-4 font-medium">ضريبة 15%</th>
                <th className="p-4 font-medium">الحالة</th>
                <th className="p-4 font-medium">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map(trx => (
                <tr key={trx.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-medium text-slate-700">{trx.id}</td>
                  <td className="p-4">
                    <div className="text-sm font-bold text-slate-800">{trx.payer}</div>
                    <div className="text-xs text-slate-400">إلى: {trx.payee}</div>
                    <div className="text-xs text-blue-500 mt-1">شحنة #{trx.shipmentRef}</div>
                  </td>
                  <td className="p-4 font-bold text-slate-800">{trx.amount.toLocaleString()} SAR</td>
                  <td className="p-4 text-red-600 text-sm">{trx.vatAmount.toLocaleString()} SAR</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                      trx.status === 'Held' ? 'bg-yellow-100 text-yellow-700' :
                      trx.status === 'Released' ? 'bg-green-100 text-green-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {trx.status === 'Held' && <Clock size={12} />}
                      {trx.status === 'Released' && <CheckCircle2 size={12} />}
                      {trx.status === 'Held' ? 'معلق (Escrow)' : trx.status === 'Released' ? 'تم التحرير' : 'مكتمل'}
                    </span>
                    {trx.status === 'Held' && (
                       <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                          <Timer size={10}/> يحرر: {trx.releaseDeadline.split(' ')[1]}
                       </div>
                    )}
                  </td>
                  <td className="p-4">
                    {trx.status === 'Held' ? (
                      <button 
                        onClick={() => confirmDelivery(trx.id)}
                        className="text-xs bg-saudi-green text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        تأكيد المستهلك (تحرير)
                      </button>
                    ) : (
                      <span className="text-slate-300 text-xs">مكتمل</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinancialWallet;