import { ethers } from "ethers";

export async function addCertificate(payload, certHash) {
  const now = new Date();
  const nextYear = new Date(
      now.getFullYear() + 1,
      now.getMonth(),
      now.getDate()
      )
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const expiresAt = Math.floor(nextYear.getTime() / 1000)
  const datastring = JSON.stringify(payload)
  const signature = await signer.signMessage(datastring);
  const userAddress = await signer.getAddress();
    const res = await fetch("http://localhost:4000/api/cert-requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      payload,
      certHash,
      schemaId: payload.schemaVersion,
      expiresAt,
      walletAddress: userAddress,
      signature
    })
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed with ${res.status}`);
  }

//   return res.json();
console.log(res.json())
}

export async function getAllCertifications({ address }) {
    
    const res = await fetch("http://localhost:4000/api/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: address
        })
    })

    const data = await res.json()
    const certs = data.certs
    const filtered = certs.filter(item => item.expiresAt !== null && 
        item.expiresAt !== undefined &&
        item.payload !== null &&
        item.payload !== undefined && 
        item.payload !== 0);
    return filtered
}


export async function getAllCertificationsForUser({ address }) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();
    const datastring = JSON.stringify({
      address: userAddress,
      intent: "getCertsByWallet"
    })
    const signature = await signer.signMessage(datastring);
    const res = await fetch("http://localhost:4000/api/list-wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: userAddress,
          signature: signature
        })
    })

    const data = await res.json()
    console.log(data)
    const certs = data.certs
    const filtered = certs.filter(item => item.expiresAt !== null && 
        item.expiresAt !== undefined &&
        item.payload !== null &&
        item.payload !== undefined && 
        item.payload !== 0);
    return filtered
}

export async function changeStatus({ walletAddress, certHash, newStatus }) {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const datastring = JSON.stringify(certHash)
    const signature = await signer.signMessage(datastring);
    const res = await fetch("http://localhost:4000/api/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        walletAddress: walletAddress,
        certHash: certHash,
        status: newStatus,
        signature
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to update status");
    }

    alert("Status updated successfully!");
    return data;

  } catch (err) {
    console.error("Status update failed:", err);
    alert("Failed to update status. Please try again.");
    return null;
  }
}

export async function extendExpiry({ walletAddress, certHash, newExpiry }) {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const datastring = JSON.stringify({
      certHash: certHash,
      newExpiry: newExpiry
    })
    const signature = await signer.signMessage(datastring);
    const res = await fetch("http://localhost:4000/api/extend-expiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        walletAddress: walletAddress,
        certHash: certHash,
        newExpiry: newExpiry,
        signature
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to update expiry");
    }

    alert("Expire Date updated successfully!");
    return data;

  } catch (err) {
    console.error("Expiry update failed:", err);
    alert("Failed to update Expiry date. Please try again.");
    return null;
  }
}

export async function certificatesCount() {
  try {
    const res = await fetch("http://localhost:4000/api/count", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to get count");
    }
    return data.count

  } catch (err) {
    console.error("Count get failed:", err);
    return null;
  }
}