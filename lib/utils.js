import moment from "moment";

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

export const formatDateCompact = (s) => {
  const nS = Number(s);
  return `${moment.utc(nS * 1000).format("m[ mintes]")}`;
};

export const formatDate = (s) => {
  const nS = Number(s);
  if (nS % 60 == 0) {
    if (nS < 3600) return `${moment.utc(nS * 1000).format("mm[ mintes]")}`;
    if (nS < 24 * 3600)
      return `${moment.utc(nS * 1000).format("hh[ hours ]mm[ mintes]")}`;
    return `${moment.utc(nS * 1000).format("dd [days] and hh:mm")}`;
  }
  if (nS < 60) return `${moment.utc(nS * 1000).format("ss[ seconds]")}`;
  if (nS < 3600)
    return `${moment.utc(nS * 1000).format("mm[ mintes and ]ss[ seconds]")}`;
  if (nS < 24 * 3600)
    return `${moment
      .utc(nS * 1000)
      .format("hh[ hours ]mm[ mintes and ]ss[ seconds]")}`;
  return `${moment.utc(nS * 1000).format("dd [days] and hh:mm:ss")}`;
};
