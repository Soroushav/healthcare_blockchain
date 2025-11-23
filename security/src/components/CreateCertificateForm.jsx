import React, { useState } from 'react';
import { X, Upload, Wallet } from 'lucide-react';
import { useBlockchain } from '../context/BlockchainContext';
import { shortenAddress } from '../utils/helperFunctions';
import { useForm } from 'react-hook-form';
import canonicalize from "canonical-json";
import { keccak256, toUtf8Bytes } from "ethers";
import { addCertificate } from '../services/apiCertificate';

export default function CreateCertificateModal({ isOpen, onClose }) {
  const [certType, setCertType] = useState('vaccination');
  const { address } = useBlockchain();
  const { register, handleSubmit, formState: { errors } } = useForm();

  if (!isOpen) return null;

  function computeCertHash(payload){
    const canon = canonicalize(payload);
    const bytes32Certificate = keccak256(toUtf8Bytes(canon))
    return bytes32Certificate
  }

  async function onSubmit(data) {
    const certHash = computeCertHash(data);
    await addCertificate(data, certHash); 
  }

  return (
    // 1. Overlay (Backdrop)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      
      {/* 2. Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900">New Certificate</h2>
            <p className="text-sm text-slate-500">Issue a new credential on the blockchain.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* FIX: Added 'flex flex-col flex-1 overflow-hidden' to the form.
           This ensures the form takes up available space and doesn't expand beyond the parent.
        */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">

          {/* FIX: Added 'flex-1' here.
             This tells the scrollable area to fill the form's available space.
          */}
          <div className="p-6 overflow-y-auto custom-scrollbar space-y-8 flex-1">
            
            {/* --- Section 1: Personal Info --- */}
            <section>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">1</span>
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Full Name</label>
                  <input type="text" placeholder="e.g. Jane Doe" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" {...register("fullName", {required: true})}/>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Date of Birth</label>
                  <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" {...register("birthDate", {required: true})}/>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">ID Number <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="text" placeholder="Passport / National ID" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" {...register("idNumber", {required: false})} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Wallet Address</label>
                  <div className="relative">
                    <Wallet className="absolute left-3 top-2.5 text-red-500" size={16} />
                    <input 
                      type="text" 
                      value={shortenAddress(address)} 
                      readOnly 
                      className="w-full pl-10 pr-3 py-2 bg-red-50 border border-red-100 text-red-700 rounded-lg font-mono text-sm cursor-not-allowed" 
                      {...register("walletAddress", {required: true})}
                    />
                  </div>
                  <p className="text-xs text-red-400 mt-1">Auto-filled from MetaMask</p>
                </div>
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* --- Section 2: Certificate Info --- */}
            <section>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">2</span>
                Certificate Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Certificate Type</label>
                  <select 
                    value={certType}
                    onChange={(e) => setCertType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white"
                    {...register("certType", {required: true})}
                  >
                    <option value="vaccination">Vaccination</option>
                    <option value="test">Test Result</option>
                    <option value="recovery">Recovery</option>
                  </select>
                </div>
                
                <div className="space-y-1">
                   <label className="text-sm font-medium text-slate-700">Schema Version</label>
                   <input type="text" value="v1.4.2 (Latest)" disabled className="w-full px-3 py-2 bg-gray-50 border border-gray-200 text-gray-500 rounded-lg" {...register("schemaVersion", {required: true})}/>
                </div>

                <div className="col-span-full">
                  <label className="text-sm font-medium text-slate-700 block mb-2">Supporting Documents</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer group">
                    <div className="p-3 bg-red-50 text-red-600 rounded-full mb-3 group-hover:scale-110 transition-transform">
                      <Upload size={20} />
                    </div>
                    <p className="text-sm text-slate-600 font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs text-slate-400">PDF, PNG, JPG (max 5MB)</p>
                  </div>
                </div>
              </div>
            </section>

             <hr className="border-gray-100" />

            {/* --- Section 3: Type Specific --- */}
            <section className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">3</span>
                {certType.charAt(0).toUpperCase() + certType.slice(1)} Specifics
              </h3>
              
              {/* VACCINATION FORM */}
              {certType === 'vaccination' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className="col-span-2 space-y-1">
                    <label className="text-sm font-medium text-slate-700">Vaccine Name / Manufacturer</label>
                    <input type="text" placeholder="e.g. Pfizer-BioNTech" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" {...register("vaccineName")}/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Date of Vaccination</label>
                    <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" {...register("vaccineDate")}/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Dose Number</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white" {...register("dossNumber")}>
                      <option>1/2</option>
                      <option>2/2</option>
                      <option>Booster</option>
                    </select>
                  </div>
                </div>
              )}

              {/* TEST FORM */}
              {certType === 'test' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2">
                   <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Test Type</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white" {...register("testType")}>
                      <option>PCR</option>
                      <option>Antigen Rapid Test</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Result</label>
                     <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white" {...register("testResult")}>
                      <option className="text-red-600">Positive</option>
                      <option className="text-emerald-600">Negative</option>
                    </select>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-sm font-medium text-slate-700">Lab / Facility Name</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" {...register("testLab")}/>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-sm font-medium text-slate-700">Date & Time of Test</label>
                    <input type="datetime-local" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" {...register("testDate")}/>
                  </div>
                </div>
              )}

              {/* RECOVERY FORM */}
              {certType === 'recovery' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className="col-span-2 space-y-1">
                     <label className="text-sm font-medium text-slate-700">Date of First Positive Result</label>
                     <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" {...register("recoveryDate")}/>
                  </div>
                  <div className="space-y-1">
                     <label className="text-sm font-medium text-slate-700">Valid From</label>
                     <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" {...register("recoveryValidFrom")}/>
                  </div>
                  <div className="space-y-1">
                     <label className="text-sm font-medium text-slate-700">Valid Until</label>
                     <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" {...register("recoveryValidUntil")}/>
                  </div>
                </div>
              )}

            </section>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-700 font-medium hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 shadow-lg shadow-red-200 transition-all">
              Issue Certificate
            </button>
          </div>
        </form>        
      </div>
    </div>
  );
}