import React, { useState } from 'react';
import { Shield, Wallet, AlertCircle } from 'lucide-react';
import Modal from '../ui/Modal'; 

export default function AddPublisherModal({ isOpen, onClose, onSubmit, isSubmitting }) {
  // Local state for form fields
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  // Handle Form Submission
  const handleSubmit = () => {
    // 1. Basic Validation
    if (!name.trim() || !address.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (!address.startsWith('0x')) {
      setError('Invalid Ethereum address (must start with 0x).');
      return;
    }

    // 2. Clear errors and call the parent function
    setError('');
    onSubmit({ name, address });
    
    setName('');
    setAddress('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Publisher"
      description="Authorize a new entity to issue certificates."
      maxWidth="max-w-lg"
    >
      <div className="space-y-6">
        
        {/* Error Alert (only shows if there is an error) */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 text-red-600 text-sm animate-in fade-in slide-in-from-top-1">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Name Input */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Publisher Name</label>
          <div className="relative group">
            <Shield className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-red-500 transition-colors" size={18} />
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Red Cross Organization" 
              disabled={isSubmitting}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400" 
            />
          </div>
        </div>

        {/* Address Input */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Ethereum Address</label>
          <div className="relative group">
            <Wallet className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-red-500 transition-colors" size={18} />
            <input 
              type="text" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x..." 
              disabled={isSubmitting}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none font-mono text-sm transition-all disabled:bg-gray-100 disabled:text-gray-400" 
            />
          </div>
          <p className="text-xs text-slate-500">The wallet address that will sign the transactions.</p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button 
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-slate-600 font-medium hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 shadow-lg shadow-red-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              "Authorize Publisher"
            )}
          </button>
        </div>

      </div>
    </Modal>
  );
}