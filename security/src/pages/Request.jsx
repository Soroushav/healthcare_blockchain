import FormField
 from "../ui/FormField";
import { useState } from "react";
import Button from "../ui/Button";
import { useBlockchain

 } from "../context/BlockchainContext";
function Request() {
    const [addressAdd, setAddressAdd] = useState("")
    const [addressRemove, setAddressRemove] = useState("")
    const { addNewPublisher, isSubmitting, removePublisher } = useBlockchain();
    
    const handleAdd = async(e) => {
        e.preventDefault();
        // implementation
        if (!addressAdd) {
            alert("Please enter an address");
            return;
        }

        try {
            await addNewPublisher({ newPublisherAddress: addressAdd });

            alert("Publisher added successfully!");
            setAddressAdd(""); // clear input if you like
        }   catch (err) {
        console.error(err);
        alert("Failed to add publisher");
        }
    }

    const handleRemove = async(e) => {
        e.preventDefault();
        if (!addressRemove) {
            alert("Please enter an address");
            return;
        }

        try {
            await removePublisher({ removePublisherAddress: addressRemove });

            alert("Publisher removed successfully!");
            setAddressRemove(""); // clear input if you like
        }   catch (err) {
        console.error(err);
        alert("Failed to remove publisher");
        }
    }
    const handleChangeAdd = (e) => {
        setAddressAdd(e.target.value)
    }
    const handleChangeRemove = (e) => {
        setAddressRemove(e.target.value)
    }
  return (
    <div className="flex justify-center items-center flex-col h-full">
        <div className="p-3 bg-red-300/50 w-1/2 h-24 flex justify-center items-center rounded-[10px] text-xl">
            <h2>Add a new publisher</h2>
        </div>
        <div className="w-3/4 h-full mt-5 p-5">
            <form onSubmit={handleAdd}>
                <FormField label="Name" placeholder="Your name" value={addressAdd} onChange={handleChangeAdd}/>
                <Button type="primary">{isSubmitting ? "Submitting..." : "Add Publisher"}</Button>
            </form>
        </div>

        <div className="p-3 bg-red-300/50 w-1/2 h-24 flex justify-center items-center rounded-[10px] text-xl">
            <h2>Remove a publisher</h2>
        </div>
        <div className="w-3/4 h-full mt-5 p-5">
            <form onSubmit={handleRemove}>
                <FormField label="Name" placeholder="Your name" value={addressRemove} onChange={handleChangeRemove}/>
                <Button type="primary">{isSubmitting ? "Removing..." : "Remove Publisher"}</Button>
            </form>
        </div>
    </div>
  );
}

export default Request