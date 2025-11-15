import FormField
 from "../ui/FormField";
import { useState } from "react";
import Button from "../ui/Button";
function Request() {
    const [address, setAddress] = useState("")
    const handleSubmit = (e) => {
        e.preventDefault();
    }
    const handleChange = (e) => {
        setAddress(e.target.value)
    }
  return (
    <div className="flex justify-center items-center flex-col h-full">
        <div className="p-3 bg-red-300/50 w-1/2 h-24 flex justify-center items-center rounded-[10px] text-xl">
            <h2>Request a new certificate</h2>
        </div>
        <div className="w-3/4 h-full m-5 p-5">
            <form onSubmit={handleSubmit}>
                <FormField label="Name" placeholder="Your name" value={address} onChange={handleChange}/>
                <Button type="primary">Request</Button>
            </form>
        </div>
    </div>
  );
}

export default Request