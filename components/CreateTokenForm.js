/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useContext } from "react";
import {
  TextField,
  Button,
  Paper,
  Container,
  CircularProgress,
} from "@mui/material";
import { DataContext } from "../lib/DataProvider";
import { useRouter } from "next/router";

const CreateTokenForm = () => {
  const router = useRouter();

  const [tokenName, setTokenName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false);

  const { getUPAddress, getTokenFactory } = useContext(DataContext);

  const create = async () => {
    if (!tokenName || !symbol) return;
    setLoading(true);
    const upAddress = await getUPAddress();
    const tokenFactory = getTokenFactory();
    try {
      const tx = await tokenFactory.web3.methods
        .addToken(tokenName, symbol)
        .send({ from: upAddress });
      const tokenAddresses = await tokenFactory.ethers.getTokens();
      setLoading(false);
      router.push(
        `/token-factory/token/${tokenAddresses[tokenAddresses.length - 1]}`
      );
    } catch (err) {
      setLoading(false);
    }
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
          variant="filled"
          size="small"
          css={css`
            margin-bottom: 1em;
          `}
          disabled={loading}
          value={tokenName}
          onChange={(e) => setTokenName(e.target.value)}
        />
        <TextField
          label="Symbol"
          variant="filled"
          fullWidth
          size="small"
          css={css`
            margin-bottom: 1em;
          `}
          disabled={loading}
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={() => {
            create();
          }}
          disabled={!symbol || !tokenName || loading}
        >
          {loading ? <CircularProgress size={22} /> : "Create Token"}
        </Button>
      </Paper>
    </Container>
  );
};

export default CreateTokenForm;
