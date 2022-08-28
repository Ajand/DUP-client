import { createContext, useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import { ethers } from "ethers";

import TokenFactory from "../abis/TokenFactory.json";
import TokenVotes from "../abis/TokenVotes.json";
import Governor from "../abis/Governor.json";

const FACTORY_ADDRESS = "0xeB5Aa8cAB48208d45f870aa0753eE7bf6C471D2A";
const RPC_URL = "https://rpc.l16.lukso.network/";

export const DataContext = createContext({
  getUPAddress: async () => {},
  getTokenFactory: () => {},
  getToken: () => {},
  getGovernor: () => {},
  upAddress: null,
  web3: null,
  ethersProvider: null,
  provider: null,
  erc725Config: null,
});

export const DataProvider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [provider, setProvider] = useState(null);
  const [ethersProvider, setEthersProvider] = useState(null);
  const [upAddress, setUpAddress] = useState(null);

  const erc725Config = {
    ipfsGateway: "https://ipfs.io/ipfs/",
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
    setUpAddress(accounts[0]);
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

  const getToken = useCallback((tokenAddress) => {
    const web3TokenVotes = new web3.eth.Contract(TokenVotes, tokenAddress, {
      gas: 5_000_000,
      gasPrice: "1000000000",
    });
    const signer = ethersProvider.getSigner();
    const ethersTokenVotes = new ethers.Contract(
      tokenAddress,
      TokenVotes,
      signer
    );

    return {
      web3: web3TokenVotes,
      ethers: ethersTokenVotes,
    };
  });

  const getGovernor = useCallback((governorAddress) => {
    const web3Governor = new web3.eth.Contract(Governor, governorAddress, {
      gas: 5_000_000,
      gasPrice: "1000000000",
    });
    const signer = ethersProvider.getSigner();
    const ethersGovernor = new ethers.Contract(
      governorAddress,
      Governor,
      signer
    );

    return {
      web3: web3Governor,
      ethers: ethersGovernor,
    };
  });

  return (
    <DataContext.Provider
      value={{
        getUPAddress,
        getTokenFactory,
        getToken,
        getGovernor,
        web3,
        ethersProvider,
        provider,
        erc725Config,
        upAddress,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
