import { createContext, useContext } from "react";
// import { useAddress, useContract, useContractWrite } from 'thirdweb/react';
import { 
  useActiveAccount, 
  useSendTransaction 
} from "thirdweb/react";

import { getContract, prepareContractCall, createThirdwebClient } from "thirdweb";
import { sepolia } from "thirdweb/chains";

const BlockchainContext = createContext(null);

const client = createThirdwebClient({
  clientId: '849f73bc2fdbd0d8ae071c64cb55287a',
});

const contract = getContract({
  client,
  chain: sepolia,
  address: "0x1f94F96Ec739f609d45D0383dCCc8DBDF7973aB6", // your HealthCertAnchor
});


function BlockchainProvider({ children }) {
    const account = useActiveAccount();
    const { mutateAsync: sendTransaction, isPending } = useSendTransaction()
    const address  = account?.address || ""

    const addNewPublisher = async (form) => {
        if (!account) {
            throw new Error("No wallet connected");
        }
        try {
            console.log(form.newPublisherAddress)
            const tx = prepareContractCall({
                contract,
                method: "function addPublisher(address account)",
                params: [form.newPublisherAddress],
            })
            await sendTransaction(tx);

            console.log("contract call success")
        } catch (error) {
            console.log("contract call failure", error)
        }
    }
    const removePublisher = async (form) => {
        if (!account) {
            throw new Error("No wallet connected");
        }
        try {
            console.log(form.removePublisherAddress)
            const tx = prepareContractCall({
                contract,
                method: "function removePublisher(address account)",
                params: [form.removePublisherAddress],
            })
            await sendTransaction(tx);

            console.log("contract call success")
        } catch (error) {
            console.log("contract call failure", error)
        }
    }
    return (
        <BlockchainContext.Provider
            value={{
                client,
                contract,
                address,
                addNewPublisher,
                removePublisher,
                isSubmitting: isPending,
            }}>

            {children}
        </BlockchainContext.Provider>
    )
}

function useBlockchain() {
    const context = useContext(BlockchainContext);
    if(context === undefined) throw new Error("Blockchain was used outside of BlockchainContext Provider");
    return context ;
}

export {BlockchainProvider, useBlockchain}