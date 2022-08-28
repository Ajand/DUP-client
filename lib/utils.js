export const formatAddress = (addr) => {
  if (!addr) return "";
  return `${addr.substring(0, 6)}...${addr.substring(
    addr.length - 6,
    addr.length
  )}`;
};

export const convertIPFS = (addr) => {
  return addr.replace("ipfs://", "https://ipfs.io/ipfs/");
};
