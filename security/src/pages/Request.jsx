import React, { useState } from 'react';
import { 
  Search, 
  UserPlus, 
  AlertCircle 
} from 'lucide-react';
import { useBlockchain } from "../context/BlockchainContext";
import AddPublisherModal from "../components/AddPublisherModal"; 
import PublisherRow from '../components/PublisherRow';

function Request() {
  const { addNewPublisher, removePublisher, isSubmitting, publishersList, isAdmin } = useBlockchain();
  
  // UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // --- Handlers ---

  // 1. Add Publisher (Called by the Modal)
  const handleAddPublisher = async ({name, address}) => {
    try {
      await addNewPublisher(name, address);
      alert("Publisher added successfully! Please wait a couple of seconds because it can take a while...");
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to add publisher");
    }
  };

  // 2. Remove Publisher (Called by the Trash Icon)
  const handleRemovePublisher = async (address) => {
    if (!window.confirm(`Are you sure you want to revoke access for ${address}?`)) return;

    try {
      await removePublisher(address);
      alert("Publisher removed successfully! Please wait a couple of seconds because it can take a while...");
    } catch (err) {
      console.error(err);
      alert("Failed to remove publisher");
    }
  };

  // --- Render ---

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-slate-800">
      
      {/* The Modal Component */}
      {isAdmin && (<AddPublisherModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddPublisher}
        isSubmitting={isSubmitting}
      />)}

      {/* Page Header */}
      <div className="max-w-5xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Publisher Management</h1>
          <p className="text-slate-500 text-sm mt-1">
            Control who is authorized to issue certificates.
          </p>
        </div>
        {isAdmin && <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-all shadow-md shadow-red-200"
        >
          <UserPlus size={18} /> Add Publisher
        </button>}
      </div>

      {/* Main Table Card */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Toolbar / Search */}
        <div className="p-5 border-b border-gray-100 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search publishers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="p-5">Publisher Name</th>
                <th className="p-5">Wallet Address</th>
                <th className="p-5">Date Added</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {publishersList
                .filter((p) => {
                  if (!searchTerm.trim()) return true;
                  const term = searchTerm.toLowerCase();
                  return (
                    p.name.toLowerCase().includes(term) ||
                    p.address.toLowerCase().includes(term)
                  );
                })
                .map((p) => (
                  <PublisherRow 
                    key={p}
                    walletAddress={p}
                    onRemove={handleRemovePublisher}
                  />
                ))
              }
            </tbody>
          </table>
          
          {publishersList.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              No publishers found.
            </div>
          )}
        </div>
      </div>

      {/* Info Footer */}
      <div className="max-w-5xl mx-auto mt-6 flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 text-sm">
        <AlertCircle className="shrink-0 mt-0.5" size={18} />
        <p>
          <strong>Security Note:</strong> Removing a publisher revokes their ability to issue new certificates immediately.
        </p>
      </div>

    </div>
  );
}

export default Request;