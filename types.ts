
export enum UserRole {
  GOVERNMENT = 'GOVERNMENT',
  COMPANY = 'COMPANY',
  DRIVER = 'DRIVER'
}

export interface Truck {
  id: string;
  plateNumber: string;
  type: string;
  owner: string;
  status: 'Active' | 'Maintenance' | 'Banned';
  lastLocation?: { lat: number; lng: number };
  complianceScore: number;
}

export interface TruckProfile {
  id: string;
  plateNumber: string;
  chassisNumber: string;
  type: string;
  capacity: number; // tons
  insuranceExpiry: string;
  fahasExpiry: string;
  istimaraExpiry: string;
  status: 'Active' | 'Banned' | 'Pending';
  violationReason?: string;
  ownerId: string;
}

export interface ShipmentTimelineEvent {
  status: string;
  timestamp: string;
  location: string;
  description: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string; // Unique Bayan ID
  origin: string;
  destination: string;
  goodsType: string;
  value: number; // SAR
  
  // Resources
  driverName: string;
  driverId: string;
  truckPlate: string;
  
  // Statuses
  status: 'Pending' | 'Loading' | 'In Transit' | 'Arrived' | 'Delivered' | 'Cancelled';
  financialStatus: 'Pending' | 'Escrow' | 'Released'; // Escrow = Funds held
  
  timeline: ShipmentTimelineEvent[];
  complianceCheckId?: string; // Reference to the pre-trip check
}

export interface AiAnalysisResult {
  riskLevel: 'Low' | 'Medium' | 'High';
  complianceIssues: string[];
  recommendations: string[];
  estimatedTax: number;
}

// --- New Types for National System ---

export interface DriverProfile {
  id: string;
  name: string;
  iqamaId: string;
  visaType: 'Citizen' | 'Resident' | 'Visit' | 'Transit';
  healthStatus: 'Fit' | 'Unfit';
  criminalRecord: 'Clean' | 'Has Record';
  status: 'Eligible' | 'Banned' | 'Review';
  rejectionReason?: string;
}

export interface WalletTransaction {
  id: string;
  amount: number;
  vatAmount: number; // 15%
  type: 'Payment' | 'Refund' | 'Settlement';
  status: 'Held' | 'Released' | 'Completed';
  payer: string; // Consumer/Factory
  payee: string; // Transporter/Supplier
  shipmentRef: string;
  timestamp: string;
  releaseDeadline: string; // 24h rule
}

export interface FacilityStats {
  id: string;
  name: string;
  type: 'Factory' | 'Warehouse' | 'Port';
  inboundVolume: number; // tons
  outboundVolume: number; // tons
  financialFlow: number; // SAR
  suspiciousActivity: boolean;
}

export interface GateAccessLog {
  id: string;
  timestamp: string;
  truckPlate: string;
  driverId: string;
  location: string;
  status: 'Allowed' | 'Denied';
  reason?: string;
}
