import { createContext, useContext, useState, useEffect, useCallback } from "react";
// import { useAddress, useContract, useContractWrite } from 'thirdweb/react';
import { 
  useActiveAccount, 
  useSendTransaction 
} from "thirdweb/react";

import { getContract, prepareContractCall, createThirdwebClient, readContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";

const BlockchainContext = createContext(null);

const client = createThirdwebClient({
  clientId: '849f73bc2fdbd0d8ae071c64cb55287a',
});

const contract = getContract({
  client,
  chain: sepolia,
  address: "0xC9ef3AFF9cd23E19Bbbd67290cf265D9572CC8F3", // your HealthCertAnchor
});
const PUBLISHER_ROLE = "0x0ac90c257048ef1c3e387c26d4a99bde06894efbcbff862dc1885c3a9319308a"
const ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000"

function BlockchainProvider({ children }) {
    const [memberCountValue, setMemberCountValue] = useState(null);
    const [publisherCountValue, setPublisherCountValue] = useState(null);
    const account = useActiveAccount();
    const address  = account?.address || ""
    const [isPublisher, setIsPublisher] = useState(false);
    const [publishersList, setPublishersList] = useState([]);
    const { mutateAsync: sendTransaction, isPending } = useSendTransaction()
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        if (!account) {
            setIsAdmin(false);
            return;
        }
        (async () => {
            const a = await readContract({ contract, method: "function hasRole(bytes32 role, address account) view returns (bool)", params: [ADMIN_ROLE, address] });
            setIsAdmin(a);
        })();
        }, [contract, account]);

    useEffect(() => {
        (async () => {
            const m = await readContract({ contract, method: "function userCount() view returns (uint256)", params: [] });
            const p = await readContract({ contract, method: "function publisherCount() view returns (uint256)", params: [] });
            setMemberCountValue(Number(m));
            setPublisherCountValue(Number(p));
        })();
        }, [contract]);

    useEffect(() => {
        if (!account) {
            setIsPublisher(false);
            return;
        }

        (async () => {
            try {
            const result = await readContract({
                contract,
                method:
                "function isPublisher(address account) view returns (bool)",
                params: [address],
            });

            setIsPublisher(result);
            } catch (error) {
            console.log("contract call failure", error);
            setIsPublisher(false);
            }
        })();
        }, [account, contract]);

    
    
    const addNewPublisher = async (name, addr) => {
        if (!account) {
            throw new Error("No wallet connected");
        }
        try {
            const tx = prepareContractCall({
                contract,
                method: "unction addPublisher(address account, string name)",
                params: [addr, name],
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

    const allPublishers = useCallback(async () => {
        try {
            const result = await readContract({
                contract,
                method: "function getAllPublishers() view returns (address[])",
                params: [],
            });

            setPublishersList(result || []);   // store the real value
        } catch (error) {
            console.log("contract call failure", error);
            setPublishersList([]);            // fallback
        }
    }, [contract]);

    useEffect(() => {
        allPublishers();   // run immediately
    }, [allPublishers]);

    const registerUser = async () => {
        if (!account) {
            throw new Error("No wallet connected");
        }

        try {
            const tx = prepareContractCall({
            contract,
            method:
                "function registerUser(address account)",
            params: [address],
            });

            await sendTransaction(tx)
        } catch (error) {
            console.log("contract call failure", error);
            return false; // safe fallback
        }
    }

    const publisherInfo = async (addr) => {
        try {
            const result = await readContract({
            contract,
            method:
                "function getPublisherInfo(address account) view returns (bool isPub, string name, uint64 joinedAt)",
            params: [addr],
            });

            const [isPub, name, joinedAt] = result;

            return {
            isPub,
            name,
            joinedAt, 
            };
        } catch (error) {
            console.log("contract call failure", error);
            return false; // safe fallback
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
                publishersList,
                publisherCountValue,
                isPublisher,
                isAdmin,
                registerUser,
                memberCountValue,
                publisherInfo,
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

export { BlockchainProvider, useBlockchain }