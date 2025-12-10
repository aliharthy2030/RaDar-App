import React, { useEffect, useState } from 'react';
import { Truck, MapPin, Navigation } from 'lucide-react';

// Simulated Truck Data
const initialTrucks = [
  { id: 'T-1023', lat: 40, lng: 30, status: 'Moving', speed: 85, driver: 'Ahmed Al-Saud', route: 'Riyadh -> Dammam' },
  { id: 'T-2041', lat: 60, lng: 50, status: 'Stopped', speed: 0, driver: 'Mohammed Ali', route: 'Jeddah -> Makkah' },
  { id: 'T-3921', lat: 20, lng: 70, status: 'Moving', speed: 92, driver: 'Khalid Otaibi', route: 'Tabuk -> Neom' },
  { id: 'T-9921', lat: 50, lng: 40, status: 'Warning', speed: 110, driver: 'Fahad Salem', route: 'Qassim -> Hail' },
];

const TrackingMap: React.FC = () => {
  const [trucks, setTrucks] = useState(initialTrucks);
  const [selectedTruck, setSelectedTruck] = useState<any>(null);

  // Simulate movement
  useEffect(() => {
    const interval = setInterval(() => {
      setTrucks(prev => prev.map(t => ({
        ...t,
        lat: t.status === 'Moving' || t.status === 'Warning' ? t.lat + (Math.random() - 0.5) * 5 : t.lat,
        lng: t.status === 'Moving' || t.status === 'Warning' ? t.lng + (Math.random() - 0.5) * 5 : t.lng,
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[calc(100vh-2rem)] flex gap-4 overflow-hidden">
      {/* Map Area (Simulated with a relative container) */}
      <div className="flex-1 bg-slate-100 rounded-xl relative overflow-hidden border border-slate-300 shadow-inner group">
        <div className="absolute inset-0 opacity-10" 
             style={{ 
               backgroundImage: 'radial-gradient(#006C35 1px, transparent 1px)', 
               backgroundSize: '20px 20px' 
             }}>
        </div>
        
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-sm z-10">
          <h3 className="font-bold text-slate-800">خريطة المملكة الحية</h3>
          <p className="text-xs text-slate-500">تحديث فوري للمواقع</p>
        </div>

        {trucks.map(truck => (
          <button
            key={truck.id}
            onClick={() => setSelectedTruck(truck)}
            className="absolute transition-all duration-1000 ease-linear transform hover:scale-110"
            style={{ 
              top: `${truck.lat}%`, 
              left: `${truck.lng}%`,
            }}
          >
            <div className={`p-2 rounded-full text-white shadow-lg ${
              truck.status === 'Warning' ? 'bg-red-500 animate-pulse' : 
              truck.status === 'Stopped' ? 'bg-slate-500' : 'bg-saudi-green'
            }`}>
              <Truck size={20} />
            </div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap">
              {truck.id}
            </div>
          </button>
        ))}
        
        {/* Placeholder for map background image if we had one */}
        <div className="absolute bottom-4 right-4 text-slate-400 text-xs select-none">
          Map Simulation Mode
        </div>
      </div>

      {/* Sidebar Details */}
      <div className="w-80 bg-white rounded-xl shadow-lg border border-slate-100 flex flex-col">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-bold text-lg">تفاصيل الوحدة</h3>
        </div>
        
        {selectedTruck ? (
          <div className="p-4 space-y-4">
             <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${
                  selectedTruck.status === 'Warning' ? 'bg-red-500' : 'bg-saudi-green'
                }`}>
                  <Truck size={24} />
                </div>
                <div>
                  <h2 className="font-bold text-xl">{selectedTruck.id}</h2>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedTruck.status === 'Warning' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {selectedTruck.status}
                  </span>
                </div>
             </div>

             <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                   <span className="text-slate-500 text-sm flex items-center gap-2"><MapPin size={14}/> السائق</span>
                   <span className="font-medium text-sm">{selectedTruck.driver}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                   <span className="text-slate-500 text-sm flex items-center gap-2"><Navigation size={14}/> المسار</span>
                   <span className="font-medium text-sm">{selectedTruck.route}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                   <span className="text-slate-500 text-sm">السرعة الحالية</span>
                   <span className="font-medium text-sm">{selectedTruck.speed} km/h</span>
                </div>
             </div>

             <div className="mt-6">
                <button className="w-full bg-slate-900 text-white py-2 rounded-lg text-sm hover:bg-slate-800 transition-colors">
                  عرض سجل الرحلة
                </button>
                <button className="w-full mt-2 border border-slate-200 text-slate-700 py-2 rounded-lg text-sm hover:bg-slate-50 transition-colors">
                  تواصل مع السائق
                </button>
             </div>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 flex flex-col items-center">
            <MapPin size={48} className="mb-2 opacity-20" />
            <p>اختر شاحنة من الخريطة لعرض التفاصيل</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingMap;