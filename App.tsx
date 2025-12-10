
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ComplianceAI from './pages/ComplianceAI';
import TrackingMap from './pages/TrackingMap';
import DriverRegistry from './pages/DriverRegistry';
import FinancialWallet from './pages/FinancialWallet';
import FacilityMonitor from './pages/FacilityMonitor';
import GateControl from './pages/GateControl';
import FleetRegistry from './pages/FleetRegistry';
import ShipmentManager from './pages/ShipmentManager';
import { UserRole } from './types';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState<UserRole>(UserRole.GOVERNMENT);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'compliance':
        return <ComplianceAI />;
      case 'tracking':
        return <TrackingMap />;
      case 'drivers':
        return <DriverRegistry />;
      case 'wallet':
        return <FinancialWallet />;
      case 'facilities':
        return <FacilityMonitor />;
      case 'gate':
        return <GateControl />;
      case 'fleet':
        return <FleetRegistry />;
      case 'shipments':
        return <ShipmentManager />;
      case 'settings':
        return (
          <div className="p-12 text-center text-slate-500">
            <h2 className="text-2xl font-bold mb-2">الإعدادات</h2>
            <p>يمكن تهيئة إعدادات API وتكاملات ZATCA هنا.</p>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-96 text-slate-400">
            <h2 className="text-xl">قريباً...</h2>
            <p>هذه الصفحة قيد التطوير</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header for Menu Toggle */}
      <div className="md:hidden bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-20">
        <h1 className="font-bold text-slate-800">LogistiKSA</h1>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar - Passed state for mobile control */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }} 
        role={userRole}
        setRole={setUserRole}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      {/* md:mr-64 ensures space is reserved ONLY on desktop. mr-0 on mobile prevents squeeze. */}
      <main className={`transition-all duration-300 p-4 md:p-8 md:mr-64`}>
        <header className="hidden md:flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {activeTab === 'dashboard' && 'لوحة المعلومات الرئيسية'}
              {activeTab === 'compliance' && 'مركز الامتثال والذكاء الاصطناعي'}
              {activeTab === 'tracking' && 'غرفة التحكم والتتبع'}
              {activeTab === 'drivers' && 'سجل السائقين الموحد'}
              {activeTab === 'wallet' && 'نظام المدفوعات والامتثال الضريبي'}
              {activeTab === 'facilities' && 'مراقبة المصانع والمخازن'}
              {activeTab === 'gate' && 'بوابة التحكم والدخول'}
              {activeTab === 'fleet' && 'إدارة الأسطول والشاحنات'}
              {activeTab === 'shipments' && 'إدارة الشحنات'}
              {activeTab === 'settings' && 'الإعدادات'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              مرحباً بك في النظام الوطني، {userRole === UserRole.GOVERNMENT ? 'المشرف العام' : userRole === UserRole.COMPANY ? 'مدير العمليات' : 'الكابتن'}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="text-sm font-bold text-slate-800">وزارة النقل والخدمات اللوجستية</p>
                <p className="text-xs text-slate-500">الرياض، المملكة العربية السعودية</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
                <img src="https://picsum.photos/100/100" alt="User" className="w-full h-full object-cover" />
             </div>
          </div>
        </header>

        {renderContent()}
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
