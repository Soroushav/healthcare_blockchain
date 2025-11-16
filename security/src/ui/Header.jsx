import { ConnectButton } from "thirdweb/react";
import { sepolia } from "thirdweb/chains";
import {useBlockchain} from "../context/BlockchainContext"

function Header() {
    const { client } = useBlockchain(); 
    return (
        <header className="bg-red-200/45 py-8 px-16 flex justify-between items-center h-20">
            <p className="text-2xl font-stretch-expanded text-gray-800/60">Your Health Certificates, Immutable and Verifiable.</p>
            <p>User Header</p>
            <div>
                <ConnectButton client={client} chain={sepolia} />
            </div>
        </header>
    )
}

export default Header