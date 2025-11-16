import { ConnectButton } from "thirdweb/react";
import { createThirdwebClient, getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
// import { useState } from "react";

const client = createThirdwebClient({
  clientId: '849f73bc2fdbd0d8ae071c64cb55287a',
});

const contract = getContract({
  client,
  chain: sepolia,
  address: "0x1f94F96Ec739f609d45D0383dCCc8DBDF7973aB6", // your HealthCertAnchor
});

function ConnectionTest() {
//   const [hash, setHash] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center gap-6 p-8">
      {/* connect wallet */}
      <ConnectButton client={client} chain={sepolia} />

      {/* simple button to call a read function */}
      <button
        className="px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 text-sm font-medium"
        onClick={async () => {
          // example: call `paused()` from your contract
          const { readContract } = await import("thirdweb");
          const paused = await readContract({
            contract,
            method: "function paused() view returns (bool)",
            params: [],
          });
          alert(`Contract paused: ${paused}`);
        }}
      >
        Check paused
      </button>
    </div>
  );
}

export default ConnectionTest;