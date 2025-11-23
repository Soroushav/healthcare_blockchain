const shortenAddress = (addr) => {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
};

export function formatUnixDate(unixSeconds) {
  if (!unixSeconds) return "N/A";

  const date = new Date(unixSeconds * 1000);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export { shortenAddress }