import { createContext, useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import { ethers } from "ethers";

import TokenFactory from "../abis/TokenFactory.json";

const FACTORY_ADDRESS = "0xeB5Aa8cAB48208d45f870aa0753eE7bf6C471D2A";
const RPC_URL = "https://rpc.l16.lukso.network/";

export const DataContext = createContext({
  getUPAddress: async () => {},
  getTokenFactory: () => {},
});

export const DataProvider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [ethersProvider, setEthersProvider] = useState(null);

  useEffect(() => {
    setWeb3(new Web3(window?.ethereum || RPC_URL));
    setEthersProvider(new ethers.providers.Web3Provider(window.ethereum));
  }, []);

  const getUPAddress = async () => {
    let accounts = await web3.eth.getAccounts();
    if (!accounts.length) {
      await web3.eth.requestAccounts();
      accounts = await web3.eth.getAccounts();
    }
    return accounts[0];
  };

  const getTokenFactory = () => {
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
  };

  return (
    <DataContext.Provider value={{ getUPAddress, getTokenFactory }}>
      {children}
    </DataContext.Provider>
  );
};
