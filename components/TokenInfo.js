/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  TextField,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import LSP4DigitalAsset from "@erc725/erc725.js/schemas/LSP4DigitalAsset.json";
import { DataContext } from "../lib/DataProvider";
import { ERC725 } from "@erc725/erc725.js";
import { ethers } from "ethers";

const TokenInfo = () => {
  const router = useRouter();
  const { address } = router.query;

  const [loading, setLoading] = useState(false);
  const [tokenData, setTokenData] = useState(null);
  const [balanceOf, setBalanceOf] = useState(null);
  const [transferDialog, setTransferDialog] = useState(false);
  const [transferAmount, setTransferAmount] = useState("");
  const [transferTo, setTransferTo] = useState("");

  const { getToken, web3, provider, erc725Config, upAddress, getUPAddress } =
    useContext(DataContext);

  useEffect(() => {
    const main = async () => {
      const token = new ERC725(
        [LSP4DigitalAsset[0], LSP4DigitalAsset[1], LSP4DigitalAsset[2]],
        address,
        provider,
        erc725Config
      );
      setTokenData(await token.fetchData());
    };

    if (web3 && address) {
      main();
    }
  }, [web3, address]);

  const getTokenBalance = async () => {
    const token = getToken(address);
    setBalanceOf(await token.ethers.balanceOf(upAddress));
  };

  useEffect(() => {
    if (upAddress && address) {
      getTokenBalance();
    }
  }, [upAddress, address]);

  const transfer = async () => {
    setLoading(true);
    const transferAmountInEther = ethers.utils.parseEther(transferAmount);
    const token = getToken(address);
    try {
      const tx = await token.web3.methods
        .transfer(upAddress, transferTo, transferAmountInEther, true, "0x")
        .send({ from: upAddress });

      await getTokenBalance();
      setLoading(false);
      closeTransferModal();
    } catch (err) {
      console.log(err);
    }
  };

  const closeTransferModal = () => {
    setTransferAmount("");
    setTransferTo("");
    setTransferDialog(false);
  };

  return (
    <>
      <Container
        css={css`
          padding-top: 5em;
        `}
      >
        <div>
          <div>
            <Typography variant="h5">
              {tokenData ? `$${tokenData[1].value}` : "Loading Token Name"}
            </Typography>
            <Typography variant="body1">
              {tokenData ? `$${tokenData[2].value}` : "Loading Symbol"}
            </Typography>
            <Typography variant="body2">{address}</Typography>
          </div>
          <div
            css={css`
              margin-top: 2em;
            `}
          >
            <div
              css={css`
                display: flex;
                justify-content: space-between;
              `}
            >
              <Typography variant="h6">
                Your Balance:{" "}
                {upAddress && balanceOf
                  ? `${ethers.utils.formatEther(balanceOf)} $SGT`
                  : "Connect your UP to get the balance"}
              </Typography>
              {upAddress ? (
                <Button
                  onClick={() => setTransferDialog(true)}
                  size="small"
                  variant="contained"
                  color="primary"
                >
                  Transfer
                </Button>
              ) : (
                <Button
                  onClick={async () => {
                    await getUPAddress();
                  }}
                  size="small"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  Connect With Up
                </Button>
              )}
            </div>
          </div>
        </div>
      </Container>
      <Dialog onClose={() => closeTransferModal()} open={transferDialog}>
        <DialogTitle>
          Transfer {tokenData ? `$${tokenData[2].value}` : ""}
        </DialogTitle>

        <DialogContent
          css={css`
            min-width: 400px;
          `}
        >
          <TextField
            variant="outlined"
            label="Amount to transfer"
            fullWidth
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
          />
          <TextField
            variant="outlined"
            label="Transfer To"
            fullWidth
            value={transferTo}
            onChange={(e) => setTransferTo(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => closeTransferModal()}>Cancel</Button>
          <Button
            onClick={() => {
              transfer();
            }}
            autoFocus
            variant="contained"
            disabled={loading}
          >
            Transfer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TokenInfo;
