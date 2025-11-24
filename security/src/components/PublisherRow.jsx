// PublisherRow.jsx
import React, { useEffect, useState } from "react";
import { ShieldCheck, Wallet, Trash2 } from "lucide-react";
import { useBlockchain } from "../context/BlockchainContext";
import { shortenAddress, formatUnixDate } from "../utils/helperFunctions";

function PublisherRow({ walletAddress, onRemove }) {
  const { publisherInfo, isAdmin } = useBlockchain();
  const [ joinedAt, setJoinedAt ] = useState(null);
  const [ name, setName ] = useState(null);
  const [ isPub, setIsPub ] = useState(true);

  useEffect(() => {
    (async () => {
      const { isPub, name, joinedAt } = await publisherInfo(walletAddress);
      setJoinedAt(joinedAt);
      setName(name);
      setIsPub(isPub)
    })();
  }, [walletAddress]);

  return (
      <tr className="hover:bg-gray-50/80 transition-colors group">
      {/* Name */}
      <td className="p-5">
      <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
      <ShieldCheck size={20} />
      </div>
      <span className="font-semibold text-slate-900">
      {!name ? "Admin" : name}
      </span>
      </div>
      </td>
      
      {/* Address */}
      <td className="p-5">
      <div className="flex items-center gap-2 text-slate-600 font-mono text-sm bg-gray-100 px-2 py-1 rounded w-fit">
      <Wallet size={14} className="text-slate-400" />
      {shortenAddress(walletAddress)}
      </div>
      </td>
      
      {/* Date Joined */}
      <td className="p-5 text-sm text-slate-500">
      {formatUnixDate(Number(joinedAt)) || "—"}
      </td>
      
      {/* Remove button */}
      <td className="p-5 text-right">
      <button
      onClick={() => onRemove && onRemove(walletAddress)}
      // disabled={true}
      className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      title="Remove Publisher"
      >
          {isAdmin ? <Trash2 size={18} /> : "Only Admin have access"}
        </button>
      </td>
    </tr>
  );
};

export default PublisherRow;