/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Container,
  Button,
} from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../lib/DataProvider";
import LSP4DigitalAsset from "@erc725/erc725.js/schemas/LSP4DigitalAsset.json";
import { ERC725 } from "@erc725/erc725.js";

const TokenList = () => {
  const router = useRouter();
  const [tokensAddresses, setTokenAddress] = useState([]);
  const [tokensData, setTokensData] = useState(new Map());
  const [loading, setLoading] = useState(false);
  const { getTokenFactory, web3, provider, erc725Config } =
    useContext(DataContext);

  useEffect(() => {
    const main = async () => {
      setLoading(true);
      const tokenFactory = getTokenFactory();
      setTokenAddress(await tokenFactory.ethers.getTokens());
      setLoading(false);
    };

    if (web3) {
      main();
    }
  }, [web3]);

  useEffect(() => {
    if (tokensAddresses.length) {
      Promise.all(
        tokensAddresses.map((tokenAddress) => {
          const token = new ERC725(
            [LSP4DigitalAsset[0], LSP4DigitalAsset[1], LSP4DigitalAsset[2]],
            tokenAddress,
            provider,
            erc725Config
          );

          return token.fetchData();
        })
      )
        .then((r) => {
          setTokensData(
            r.reduce((pV, cV, i) => {
              const newMap = new Map(pV).set(tokensAddresses[i], cV);
              return newMap;
            }, new Map())
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [tokensAddresses]);

  return (
    <Container
      css={css`
        padding-top: 5em;
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: flex-end;
          margin-bottom: 1em;
        `}
      >
        <Button
          onClick={() => router.push("/token-factory/create")}
          variant="text"
          color="primary"
        >
          Create A Governance Token
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Contract Address</TableCell>
              <TableCell>Token Name</TableCell>
              <TableCell>Symbol</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell colSpan={3}>Loading Tokens List</TableCell>
              </TableRow>
            ) : (
              tokensAddresses.map((tokenAddress) => (
                <TableRow
                  key={tokenAddress}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  css={css`
                    cursor: pointer;
                    transition: 200ms;
                    &:hover {
                      background: #f2f2f2;
                    }
                  `}
                  onClick={() => {
                    router.push(`/token-factory/token/${tokenAddress}`);
                  }}
                >
                  <TableCell>{tokenAddress}</TableCell>
                  <TableCell>
                    {tokensData.get(tokenAddress)
                      ? tokensData.get(tokenAddress)[1].value
                      : "Loading"}
                  </TableCell>
                  <TableCell>
                    {tokensData.get(tokenAddress)
                      ? tokensData.get(tokenAddress)[2].value
                      : "Loading"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default TokenList;
