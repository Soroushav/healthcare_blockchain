import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Wallet, 
  ShieldCheck, 
  FileBadge, 
  Users, 
  TrendingUp, 
  Activity,
  Copy
} from 'lucide-react';


// --- Thirdweb Imports ---
import { ConnectButton, useActiveAccount, lightTheme } from "thirdweb/react";
import { sepolia } from "thirdweb/chains";
import { useBlockchain } from "../context/BlockchainContext";

// --- Mock Data ---

const chartData = [
  { date: 'Jan', certificates: 65 },
  { date: 'Feb', certificates: 120 },
  { date: 'Mar', certificates: 90 },
  { date: 'Apr', certificates: 200 },
  { date: 'May', certificates: 278 },
  { date: 'Jun', certificates: 189 },
  { date: 'Jul', certificates: 340 },
];


const customRedTheme = lightTheme({
  colors: {
    primaryButtonBg: "#ef4444", // Matches Tailwind red-500
    primaryButtonText: "#ffffff",
    accentText: "#ef4444",
  },
});
// We will override address with real data if connected
const mockUserStats = {
  role: 'Publisher',
  contributions: 142,
  lastActive: '2 mins ago'
};

const networkStats = {
  publishers: 24,
  totalCertificates: 18932,
  activeUsers: 5420
};

// --- Components ---

const StatCard = ({ title, value, icon: Icon, trend, colorClass }) => (
  <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-300 group">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClass} bg-opacity-10 group-hover:scale-110 transition-transform`}>
      <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <div className="flex items-end gap-2">
        <h4 className="text-xl font-bold text-slate-900">{value}</h4>
        {trend && <span className="text-xs text-emerald-600 flex items-center mb-1"><TrendingUp size={12} className="mr-0.5" /> {trend}</span>}
      </div>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-sm border border-slate-800">
        <p className="font-semibold mb-1">{label}</p>
        <p className="text-red-300">
          Issued: <span className="font-bold text-white">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  // 1. Get Client & Account Status
  const { client } = useBlockchain();
  const account = useActiveAccount();
  const isConnected = !!account;
  const displayAddress = account ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}` : 'Not Connected';
  const fullAddress = account ? account.address : '0x0000000000000000000000000000000000000000';
  const { memberCountValue, publisherCountValue, isPublisher } = useBlockchain();
  return (
    <div className="min-h-screen bg-gray-50/50 p-8 font-sans text-slate-800">
      
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm">Welcome back, here is what's happening on the network today.</p>
        </div>

        {/* TOP ROW: Box 1 (User) & Box 2 (Network) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* BOX 1: User Info Card (With Blur Logic) */}
          <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full overflow-hidden">
            
            {/* --- OVERLAY IF NOT CONNECTED --- */}
            {!isConnected && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm transition-all">
                <p className="text-slate-600 font-medium mb-3">Connect Wallet to View Profile</p>
                <ConnectButton client={client} chain={sepolia} theme={customRedTheme}/>
              </div>
            )}

            {/* Card Content (Blurred if not connected) */}
            <div className={`p-6 h-full flex flex-col justify-between transition-all duration-500 ${!isConnected ? 'blur-md grayscale opacity-50 pointer-events-none select-none' : ''}`}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`}></span>
                    My Profile
                  </h2>
                  <p className="text-sm text-slate-500">Connected Wallet Details</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-100 uppercase tracking-wider">
                  {isPublisher ? "PUBLISHER" : "USER"}
                </span>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Avatar Placeholder */}
                <div className="relative shrink-0">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-rose-600 p-0.5 shadow-lg shadow-red-200">
                    <div className="w-full h-full bg-white rounded-full p-1">
                       <img 
                         src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${fullAddress}`} 
                         alt="User Avatar" 
                         className="w-full h-full rounded-full bg-gray-100"
                       />
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 w-full space-y-4">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center justify-between group cursor-pointer hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <Wallet size={18} className="text-slate-400 shrink-0" />
                      <div className="overflow-hidden">
                        <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Wallet Address</p>
                        <p className="text-sm font-mono font-medium text-slate-900 truncate">{displayAddress}</p>
                      </div>
                    </div>
                    <Copy size={16} className="text-slate-300 group-hover:text-red-600 transition-colors shrink-0" />
                  </div>

                  <div className="flex gap-4">
                     <div className="flex-1 bg-red-50/50 p-3 rounded-lg border border-red-100">
                        <p className="text-xs text-red-600 font-semibold mb-1">My Certificates</p>
                        <p className="text-xl font-bold text-red-900">{mockUserStats.contributions}</p>
                     </div>
                     <div className="flex-1 bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                        <p className="text-xs text-emerald-600 font-semibold mb-1">Trust Score</p>
                        <p className="text-xl font-bold text-emerald-900">98%</p>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BOX 2: Network Reports */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
             <div className="mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Network Status</h2>
                  <p className="text-sm text-slate-500">Real-time report of the ecosystem.</p>
                </div>
                <Activity size={20} className="text-slate-300" />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                <StatCard 
                  title="Total Publishers" 
                  value={publisherCountValue} 
                  icon={ShieldCheck} 
                  colorClass="bg-blue-500/30 text-blue-600"
                  trend="+2 this week"
                />
                <StatCard 
                  title="Active Users" 
                  value={publisherCountValue + memberCountValue} 
                  icon={Users} 
                  colorClass="bg-purple-500/30 text-purple-600"
                  trend="+12% growth"
                />
                <div className="md:col-span-2">
                  <StatCard 
                    title="Certificates Issued" 
                    value={networkStats.totalCertificates.toLocaleString()} 
                    icon={FileBadge} 
                    colorClass="bg-emerald-500/30 text-emerald-600"
                    trend="+850 today"
                  />
                </div>
             </div>
          </div>
        </div>

        {/* BOTTOM ROW: Box 3 (Graph) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Issuance Activity</h2>
              <p className="text-sm text-slate-500">Number of certificates added to the network over time.</p>
            </div>
            
            {/* Date Filter Pills */}
            <div className="bg-gray-100 p-1 rounded-lg flex text-xs font-medium">
              <button className="px-3 py-1.5 rounded-md bg-white text-slate-800 shadow-sm transition-all">12 Months</button>
              <button className="px-3 py-1.5 rounded-md text-slate-500 hover:bg-gray-200 transition-all">30 Days</button>
              <button className="px-3 py-1.5 rounded-md text-slate-500 hover:bg-gray-200 transition-all">7 Days</button>
            </div>
          </div>

          {/* The Chart */}
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCert" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="certificates" 
                  stroke="#ef4444" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorCert)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}