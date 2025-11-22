// import FormField
//  from "../ui/FormField";
// import { useState } from "react";
// import Button from "../ui/Button";
// import { useBlockchain

//  } from "../context/BlockchainContext";
// function Request() {
//     const [addressAdd, setAddressAdd] = useState("")
//     const [addressRemove, setAddressRemove] = useState("")
//     const { addNewPublisher, isSubmitting, removePublisher } = useBlockchain();
    
//     const handleAdd = async(e) => {
//         e.preventDefault();
//         // implementation
//         if (!addressAdd) {
//             alert("Please enter an address");
//             return;
//         }

//         try {
//             await addNewPublisher({ newPublisherAddress: addressAdd });

//             alert("Publisher added successfully!");
//             setAddressAdd(""); // clear input if you like
//         }   catch (err) {
//         console.error(err);
//         alert("Failed to add publisher");
//         }
//     }

//     const handleRemove = async(e) => {
//         e.preventDefault();
//         if (!addressRemove) {
//             alert("Please enter an address");
//             return;
//         }

//         try {
//             await removePublisher({ removePublisherAddress: addressRemove });

//             alert("Publisher removed successfully!");
//             setAddressRemove(""); // clear input if you like
//         }   catch (err) {
//         console.error(err);
//         alert("Failed to remove publisher");
//         }
//     }
//     const handleChangeAdd = (e) => {
//         setAddressAdd(e.target.value)
//     }
//     const handleChangeRemove = (e) => {
//         setAddressRemove(e.target.value)
//     }
//   return (
//     <div className="flex justify-center items-center flex-col h-full">
//         <div className="p-3 bg-red-300/50 w-1/2 h-24 flex justify-center items-center rounded-[10px] text-xl">
//             <h2>Add a new publisher</h2>
//         </div>
//         <div className="w-3/4 h-full mt-5 p-5">
//             <form onSubmit={handleAdd}>
//                 <FormField label="Name" placeholder="Your name" value={addressAdd} onChange={handleChangeAdd}/>
//                 <Button type="primary">{isSubmitting ? "Submitting..." : "Add Publisher"}</Button>
//             </form>
//         </div>

//         <div className="p-3 bg-red-300/50 w-1/2 h-24 flex justify-center items-center rounded-[10px] text-xl">
//             <h2>Remove a publisher</h2>
//         </div>
//         <div className="w-3/4 h-full mt-5 p-5">
//             <form onSubmit={handleRemove}>
//                 <FormField label="Name" placeholder="Your name" value={addressRemove} onChange={handleChangeRemove}/>
//                 <Button type="primary">{isSubmitting ? "Removing..." : "Remove Publisher"}</Button>
//             </form>
//         </div>
//     </div>

//   );
// }

// export default Request



import React, { useState } from 'react';
import { 
  Search, 
  UserPlus, 
  Trash2, 
  ShieldCheck, 
  Wallet, 
  AlertCircle 
} from 'lucide-react';
import { useBlockchain } from "../context/BlockchainContext";
import AddPublisherModal from "../components/AddPublisherModal"; 
// Mock data to make the UI look good immediately (Replace with real data from blockchain later)
const MOCK_PUBLISHERS = [
  { id: 1, name: 'Health Ministry', address: '0x71C...9A23', addedDate: 'Jan 12, 2024' },
  { id: 2, name: 'Central Hospital', address: '0x3De...B12F', addedDate: 'Feb 20, 2024' },
];

function Request() {
  const { addNewPublisher, removePublisher, isSubmitting } = useBlockchain();
  
  // UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [publishers, setPublishers] = useState(MOCK_PUBLISHERS); 
  const [searchTerm, setSearchTerm] = useState("");

  // --- Handlers ---

  // 1. Add Publisher (Called by the Modal)
  const handleAddPublisher = async (data) => {
    try {
      // Call your Blockchain Context
      await addNewPublisher({ newPublisherAddress: data.address });
      
      // Update UI (Optimistic update)
      setPublishers([
        ...publishers, 
        { id: Date.now(), name: data.name, address: data.address, addedDate: new Date().toLocaleDateString() }
      ]);
      
      alert("Publisher added successfully!");
      setIsModalOpen(false); // Close modal on success
    } catch (err) {
      console.error(err);
      alert("Failed to add publisher");
    }
  };

  // 2. Remove Publisher (Called by the Trash Icon)
  const handleRemovePublisher = async (address, id) => {
    if (!window.confirm(`Are you sure you want to revoke access for ${address}?`)) return;

    try {
      // Call your Blockchain Context
      await removePublisher({ removePublisherAddress: address });

      // Update UI
      setPublishers(publishers.filter(p => p.id !== id));
      alert("Publisher removed successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to remove publisher");
    }
  };

  // --- Render ---

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-slate-800">
      
      {/* The Modal Component */}
      <AddPublisherModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddPublisher} // Pass the handler to the modal
        isSubmitting={isSubmitting}
      />

      {/* Page Header */}
      <div className="max-w-5xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Publisher Management</h1>
          <p className="text-slate-500 text-sm mt-1">Control who is authorized to issue certificates.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-all shadow-md shadow-red-200"
        >
          <UserPlus size={18} /> Add Publisher
        </button>
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
              {publishers.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.address.includes(searchTerm)).map((pub) => (
                <tr key={pub.id} className="hover:bg-gray-50/80 transition-colors group">
                  
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                        <ShieldCheck size={20} />
                      </div>
                      <span className="font-semibold text-slate-900">{pub.name}</span>
                    </div>
                  </td>
                  
                  <td className="p-5">
                    <div className="flex items-center gap-2 text-slate-600 font-mono text-sm bg-gray-100 px-2 py-1 rounded w-fit">
                      <Wallet size={14} className="text-slate-400" />
                      {pub.address}
                    </div>
                  </td>

                  <td className="p-5 text-sm text-slate-500">
                    {pub.addedDate}
                  </td>

                  <td className="p-5 text-right">
                    <button 
                      onClick={() => handleRemovePublisher(pub.address, pub.id)}
                      disabled={isSubmitting}
                      className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all"
                      title="Remove Publisher"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {publishers.length === 0 && (
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