import React, { useState } from 'react';
import CreateCertificateModal from '../components/CreateCertificateForm'; // Adjust path as needed

import { 
  CheckCircle, 
  XCircle, 
  PauseCircle, 
  Eye, 
  Filter, 
  Plus, 
  Copy, 
  MoreVertical 
} from 'lucide-react';

// Mock Data
const initialData = [
  {
    id: '1',
    hash: '0xab...12cd',
    requester: { name: 'Jhon Clavio', role: 'Product Designer', avatar: 'https://i.pravatar.cc/150?u=1' },
    status: 'Pending',
    issuedAt: 'April 14, 2022',
    issuedTime: '5:20 PM',
    expiry: 'April 14, 2024',
  },
  {
    id: '2',
    hash: '0xde...34fg',
    requester: { name: 'Alex Smith', role: 'Product Designer', avatar: 'https://i.pravatar.cc/150?u=2' },
    status: 'Active',
    issuedAt: 'April 10, 2022',
    issuedTime: '4:22 PM',
    expiry: 'April 10, 2025',
  },
  {
    id: '3',
    hash: '0xgh...56ij',
    requester: { name: 'Saleh Mohasoy', role: 'Product Designer', avatar: 'https://i.pravatar.cc/150?u=3' },
    status: 'Suspended',
    issuedAt: 'April 05, 2022',
    issuedTime: '6:20 PM',
    expiry: 'April 05, 2024',
  },
  {
    id: '4',
    hash: '0xkl...78mn',
    requester: { name: 'Power Boy', role: 'Product Designer', avatar: 'https://i.pravatar.cc/150?u=4' },
    status: 'Revoked',
    issuedAt: 'April 04, 2022',
    issuedTime: '6:30 PM',
    expiry: 'N/A',
  },
  {
    id: '5',
    hash: '0xop...90qr',
    requester: { name: 'Ruhan Ibn Tajul', role: 'Product Designer', avatar: 'https://i.pravatar.cc/150?u=5' },
    status: 'Active',
    issuedAt: 'April 02, 2022',
    issuedTime: '10:20 AM',
    expiry: 'April 02, 2025',
  },
];

const StatusChip = ({ status }) => {
  const styles = {
    Pending: 'bg-amber-100 text-amber-700 border-amber-200',
    Active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Suspended: 'bg-orange-100 text-orange-700 border-orange-200',
    Revoked: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
};

const ActionButtons = ({ status, userRole = 'publisher' }) => {
  // Logic based on your requirements
  if (status === 'Pending' && userRole === 'publisher') {
    return (
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-1 text-emerald-600 hover:text-emerald-800 text-sm font-medium transition-colors">
          <CheckCircle size={16} /> 
        </button>
        <button className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium transition-colors">
          <XCircle size={16} /> 
        </button>
      </div>
    );
  }

  if (status === 'Active') {
    return (
      <div className="flex items-center gap-3">
        <button className="group relative flex items-center gap-1 text-orange-500 hover:text-orange-700 text-sm font-medium transition-colors">
           <PauseCircle size={16} /> 
           <span className="hidden group-hover:inline"></span>
        </button>
        <button className="group relative flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium transition-colors">
           <XCircle size={16} />
           <span className="hidden group-hover:inline"></span>
        </button>
        <button className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors">
          <Eye size={16} />
        </button>
      </div>
    );
  }

  // Default for Suspended/Revoked
  return (
    <button className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors">
      <Eye size={16} /> View Details
    </button>
  );
};

export default function Certifications() {
  const [data] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-slate-800">
      <CreateCertificateModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Certificates</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and verify digital credentials.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-slate-600 hover:bg-gray-50 font-medium transition-all shadow-sm">
            <Filter size={18} /> Filters
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-all shadow-md shadow-red-200"
          >
            <Plus size={18} /> New Certificate
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="p-6 w-10">
                   <input type="checkbox" className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                </th>
                <th className="p-6">Cert ID / Hash</th>
                <th className="p-6">Requester</th>
                <th className="p-6">Status</th>
                <th className="p-6">Issued At</th>
                <th className="p-6">Expiry</th>
                <th className="p-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="p-6">
                    <input type="checkbox" className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                  </td>
                  
                  {/* ID / Hash */}
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-700 font-medium">{row.hash}</span>
                      <button className="text-gray-300 hover:text-red-600 transition-colors">
                        <Copy size={14} />
                      </button>
                    </div>
                  </td>

                  {/* Requester */}
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <img 
                        src={row.requester.avatar} 
                        alt={row.requester.name} 
                        className="w-10 h-10 rounded-full object-cover border border-gray-100"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{row.requester.name}</div>
                        <div className="text-xs text-slate-400">{row.requester.role}</div>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="p-6">
                    <StatusChip status={row.status} />
                  </td>

                  {/* Issued At */}
                  <td className="p-6">
                    <div className="text-sm font-medium text-slate-900">{row.issuedAt}</div>
                    <div className="text-xs text-slate-400">{row.issuedTime}</div>
                  </td>

                  {/* Expiry */}
                  <td className="p-6">
                    <div className="text-sm font-medium text-slate-900">{row.expiry}</div>
                    {row.expiry !== 'N/A' && (
                       <div className="text-xs text-slate-400">{row.issuedTime}</div>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-6">
                    <ActionButtons status={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer (Optional Visual) */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center text-sm text-slate-500">
           <span>Showing 1-5 of 24 results</span>
           <div className="flex gap-2">
             <button className="px-3 py-1 border rounded hover:bg-gray-50">Previous</button>
             <button className="px-3 py-1 border rounded hover:bg-gray-50">Next</button>
           </div>
        </div>
      </div>
    </div>
  );
}