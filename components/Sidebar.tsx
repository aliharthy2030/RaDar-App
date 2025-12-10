
import React from 'react';
import { LayoutDashboard, Truck, Package, ShieldCheck, BarChart3, Users, Settings, LogOut, Wallet, Building2, UserCheck, ScanLine, CarFront, X } from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, role, setRole, isOpen = false, onClose }) => {
  const menuItems = [
    { id: 'dashboard', label: 'لوحة المعلومات', icon: <LayoutDashboard size={20} />, roles: [UserRole.GOVERNMENT, UserRole.COMPANY] },
    { id: 'tracking', label: 'التتبع المباشر', icon: <Truck size={20} />, roles: [UserRole.GOVERNMENT, UserRole.COMPANY, UserRole.DRIVER] },
    { id: 'gate', label: 'بوابة الدخول', icon: <ScanLine size={20} />, roles: [UserRole.COMPANY, UserRole.GOVERNMENT] },
    { id: 'fleet', label: 'إدارة الشاحنات', icon: <CarFront size={20} />, roles: [UserRole.GOVERNMENT, UserRole.COMPANY] },
    { id: 'drivers', label: 'تسجيل السائقين', icon: <UserCheck size={20} />, roles: [UserRole.GOVERNMENT, UserRole.COMPANY] },
    { id: 'wallet', label: 'المحفظة المالية', icon: <Wallet size={20} />, roles: [UserRole.GOVERNMENT, UserRole.COMPANY] },
    { id: 'facilities', label: 'المصانع والمخازن', icon: <Building2 size={20} />, roles: [UserRole.GOVERNMENT] },
    { id: 'shipments', label: 'إدارة الشحنات', icon: <Package size={20} />, roles: [UserRole.GOVERNMENT, UserRole.COMPANY] },
    { id: 'compliance', label: 'الامتثال الذكي', icon: <ShieldCheck size={20} />, roles: [UserRole.GOVERNMENT] },
  ];

  return (
    <div className={`fixed right-0 top-0 h-screen bg-white border-l border-slate-200 flex flex-col shadow-2xl z-40 w-64 transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
    }`}>
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-saudi-green rounded-lg flex items-center justify-center text-white font-bold text-xl">
            L
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-800">LogistiKSA</h1>
            <p className="text-xs text-slate-500">المنصة الوطنية اللوجستية</p>
          </div>
        </div>
        {/* Close Button for Mobile */}
        <button onClick={onClose} className="md:hidden text-slate-400 hover:text-slate-600">
          <X size={24} />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <p className="px-4 text-xs font-semibold text-slate-400 mb-2 mt-2">القائمة الرئيسية</p>
        {menuItems.filter(item => item.roles.includes(role)).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === item.id
                ? 'bg-saudi-light text-saudi-green'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}

        <div className="mt-8 border-t border-slate-100 pt-4">
          <p className="px-4 text-xs font-semibold text-slate-400 mb-2">الإعدادات</p>
           <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'settings'
                ? 'bg-saudi-light text-saudi-green'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Settings size={20} />
            إعدادات النظام
          </button>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 rounded-xl p-4 mb-4">
          <p className="text-xs text-slate-500 mb-2">تبديل الدور (للعرض فقط)</p>
          <select 
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="w-full text-sm p-2 rounded border border-slate-200 bg-white"
          >
            <option value={UserRole.GOVERNMENT}>جهة حكومية (المراقب)</option>
            <option value={UserRole.COMPANY}>شركة لوجستية</option>
            <option value={UserRole.DRIVER}>سائق شاحنة</option>
          </select>
        </div>
        <button className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 p-2 rounded-lg text-sm font-medium transition-colors">
          <LogOut size={18} />
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
