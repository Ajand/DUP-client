/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useEffect } from "react";
import { TextField, Button, Paper, Container } from "@mui/material";
import Web3 from "web3";
import TokenFactory from "../abis/TokenFactory.json";
import { ethers } from "ethers";

const FACTORY_ADDRESS = "0xeB5Aa8cAB48208d45f870aa0753eE7bf6C471D2A"; //"0x0DB5B2471E83f1D834833475671F41bAfEE341e4";
const RPC_ENDPOINT = "https://rpc.l16.lukso.network";

const CreateTokenForm = () => {
  const [tokenName, setTokenName] = useState("");
  const [symbol, setSymbol] = useState("");

  useEffect(() => {
    const main = async () => {};

    main();
  }, []);

  const create = async () => {
    if (!tokenName || !symbol) return;

    const web3 = new Web3(window.ethereum);

    //const accountsRequest =
    let accounts = await web3.eth.getAccounts();
    if (!accounts.length) {
      await web3.eth.requestAccounts();
      accounts = await web3.eth.getAccounts();
    }

    const tokenFactory = new web3.eth.Contract(TokenFactory, FACTORY_ADDRESS, {
      gas: 5_000_000,
      gasPrice: "1000000000",
    });

    const tokens = await tokenFactory.methods.getTokens().call();

    console.log(tokens);

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    console.log(await provider.getCode(FACTORY_ADDRESS));

    const signer = provider.getSigner();
    // //
    // ////
    // const tFac = new ethers.Contract(FACTORY_ADDRESS, TokenFactory, signer);
    // //
    // console.log(await tFac.addToken("123", "adsxzcv"));
    //console.log(await tFac.getTokens());

    try {
      const a = await tokenFactory.methods
        .addToken(tokenName, symbol)
        .send({ from: accounts[0] });
      console.log(a);
      //.on("receipt", (receipt) => {
      //  console.log("receipt: ", receipt);
      //})
      //.once("sending", (payload) => {
      //  console.log("payload: ", payload);
      //});
    } catch (err) {
      console.log(err);
    }

    //tokenFactory.methods
    //  .addToken(tokenName, symbol)
    //  .then((r) => console.log(r))
    //  .catch((err) => console.log(err))
    //  .send({ from: accounts[0] })
    //  .on("receipt", (receipt) => {
    //    console.log("receipt: ", receipt);
    //  })
    //  .once("sending", (payload) => {
    //    console.log("payload: ", payload);
    //  });

    // Connect to UP
    // Get the token factory
    // addToken
    // w8 for it to mine
    // go to Token page
  };

  return (
    <Container
      css={css`
        padding-top: 4em;
      `}
    >
      <Paper
        css={css`
          padding: 2em;
        `}
      >
        <TextField
          label="Token Name"
          fullWidth
          size="small"
          css={css`
            margin-bottom: 1em;
          `}
          value={tokenName}
          onChange={(e) => setTokenName(e.target.value)}
        />
        <TextField
          label="Symbol"
          fullWidth
          size="small"
          css={css`
            margin-bottom: 1em;
          `}
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={() => {
            create();
          }}
          disabled={!symbol || !tokenName}
        >
          Create Token
        </Button>
      </Paper>
    </Container>
  );
};

export default CreateTokenForm;
