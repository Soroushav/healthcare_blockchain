
export async function addCertificate(payload, certHash) {
    const now = new Date();
    const nextYear = new Date(
        now.getFullYear() + 1,
        now.getMonth(),
        now.getDate()
        )
    
    const expiresAt = Math.floor(nextYear.getTime() / 1000)

    const res = await fetch("http://localhost:4000/api/cert-requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      payload,
      certHash,
      schemaId: payload.schemaVersion,
      expiresAt
    })
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed with ${res.status}`);
  }

//   return res.json();
console.log(res.json())
}

export async function getAllCertifications() {
    const res = await fetch("http://localhost:4000/api/certs", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
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