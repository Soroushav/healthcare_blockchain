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

  const customTheme = lightTheme({
    colors: {
      primaryButtonBg: "#ef4444", 
      primaryButtonText: "#ffffff", 
    },
  });

  const shortenAddress = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  const handleLogout = () => {
    if (wallet) {
      disconnect(wallet);
    }
  };

  return (
    <header className="w-full h-20 px-8 flex justify-between items-center bg-red-50 border-b border-red-100 shadow-sm">
      
      <div className="flex items-center gap-8">
        
        <h1 className="text-xl font-bold text-slate-800 tracking-tight hidden md:block">
          Dash<span className="text-red-500">board</span>
        </h1>

        <nav className="flex items-center gap-6">
          <button className="group relative flex items-center gap-2 text-slate-600 hover:text-red-600 text-sm font-medium transition-colors">
            <Info size={18} />
            <span>About Us</span>

            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-max 
                            px-3 py-1.5 bg-slate-900 text-white text-xs rounded-lg opacity-0 
                            group-hover:opacity-100 group-hover:translate-y-1 transition-all pointer-events-none">
              This is a project for the system security course.
            </div>
          </button>
          <button className="group relative flex items-center gap-2 text-slate-600 hover:text-red-600 text-sm font-medium transition-colors">
            <Share2 size={18} />
            <span>Social Media</span>

            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-max 
                            px-3 py-1.5 bg-slate-900 text-white text-xs rounded-lg opacity-0 
                            group-hover:opacity-100 group-hover:translate-y-1 transition-all pointer-events-none">
              <p>Follow us on our social media channels.</p>
              <p>Instagram: @Soroushav</p>
              <p>LinkedIn: soroush-alahvaisi</p>
            </div>
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        
        {account ? (
          <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
            
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

            <button 
              onClick={handleLogout}
              className="p-2 rounded-lg cursor-pointer bg-white border border-red-100 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all shadow-sm"
              title="Disconnect Wallet"
            >
              <LogOut size={18} />
            </button>

          </div>
        ) : (
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