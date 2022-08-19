import { createContext, useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import { ethers } from "ethers";

import TokenFactory from "../abis/TokenFactory.json";

const FACTORY_ADDRESS = "0xeB5Aa8cAB48208d45f870aa0753eE7bf6C471D2A";
const RPC_URL = "https://rpc.l16.lukso.network/";

export const DataContext = createContext({
  getUPAddress: async () => {},
  getTokenFactory: () => {},
  web3: null,
  ethersProvider: null,
  provider: null,
  erc72Config: null,
});

export const DataProvider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [provider, setProvider] = useState(null);
  const [ethersProvider, setEthersProvider] = useState(null);

  const erc72Config = {
    ipfsGateway: "https://ipfs.lukso.network/ipfs/",
  };

  useEffect(() => {
    setWeb3(new Web3(window?.ethereum || RPC_URL));
    setEthersProvider(new ethers.providers.Web3Provider(window.ethereum));
    setProvider(new Web3.providers.HttpProvider(RPC_URL));
  }, []);

  const getUPAddress = useCallback(async () => {
    let accounts = await web3.eth.getAccounts();
    if (!accounts.length) {
      await web3.eth.requestAccounts();
      accounts = await web3.eth.getAccounts();
    }
    return accounts[0];
  });

  const getTokenFactory = useCallback(() => {
    const web3TokenFactory = new web3.eth.Contract(
      TokenFactory,
      FACTORY_ADDRESS,
      {
        gas: 5_000_000,
        gasPrice: "1000000000",
      }
    );
    const signer = ethersProvider.getSigner();
    const ethersTokenFactory = new ethers.Contract(
      FACTORY_ADDRESS,
      TokenFactory,
      signer
    );

    return {
      web3: web3TokenFactory,
      ethers: ethersTokenFactory,
    };
  });

  return (
    <DataContext.Provider
      value={{
        getUPAddress,
        getTokenFactory,
        web3,
        ethersProvider,
        provider,
        erc72Config,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};