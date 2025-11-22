import React from 'react';
import { ConnectButton, useActiveAccount, useDisconnect, useActiveWallet } from "thirdweb/react";
import { useBlockchain } from "../context/BlockchainContext"; 
import { sepolia } from "thirdweb/chains";
import { lightTheme } from "thirdweb/react";
import { 
  Info, 
  Share2, 
  ChevronDown,
  LogOut
} from 'lucide-react';

export default function Header() {
  const account = useActiveAccount();
  const { client } = useBlockchain();
  const wallet = useActiveWallet();
  const { disconnect } = useDisconnect();

  // Custom Theme for the Connect Button (Red style to match theme)
  const customTheme = lightTheme({
    colors: {
      primaryButtonBg: "#ef4444", // Red background
      primaryButtonText: "#ffffff", // White text
    },
  });

  // Helper to shorten address for the "Name" slot
  const shortenAddress = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  const handleLogout = () => {
    if (wallet) {
      disconnect(wallet);
    }
  };

  return (
    <header className="w-full h-20 px-8 flex justify-between items-center bg-red-50 border-b border-red-100 shadow-sm">
      
      {/* --- LEFT SIDE: Navigation --- */}
      <div className="flex items-center gap-8">
        
        {/* Brand / Tagline */}
        <h1 className="text-xl font-bold text-slate-800 tracking-tight hidden md:block">
          Dash<span className="text-red-500">board</span>
        </h1>

        {/* Nav Links */}
        <nav className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-slate-600 hover:text-red-600 text-sm font-medium transition-colors">
            <Info size={18} />
            <span>About Us</span>
          </button>
          <button className="flex items-center gap-2 text-slate-600 hover:text-red-600 text-sm font-medium transition-colors">
            <Share2 size={18} />
            <span>Social Media</span>
          </button>
        </nav>
      </div>

      {/* --- RIGHT SIDE: User Profile --- */}
      <div className="flex items-center gap-4">
        
        {account ? (
          // CONNECTED STATE
          <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
            
            {/* Profile Info */}
            <div className="flex items-center gap-3 text-right">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${account.address}`} 
                alt="Avatar" 
                className="w-10 h-10 rounded-full border-2 border-red-200 bg-white"
              />
              <div className="hidden lg:block">
                <div className="flex items-center gap-1 text-slate-900 font-semibold text-sm justify-end">
                  {shortenAddress(account.address)}
                  <ChevronDown size={14} className="text-slate-400" />
                </div>
                <p className="text-slate-500 text-xs font-medium text-left">Authorized User</p>
              </div>
            </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="p-2 rounded-lg cursor-pointer bg-white border border-red-100 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all shadow-sm"
              title="Disconnect Wallet"
            >
              <LogOut size={18} />
            </button>

          </div>
        ) : (
          // DISCONNECTED STATE (Connect Button)
          <ConnectButton 
            client={client} 
            chain={sepolia} 
            theme={customTheme}
            connectButton={{ label: "Connect Wallet", className: "font-semibold" }}
          />
        )}
      </div>

    </header>
  );
}