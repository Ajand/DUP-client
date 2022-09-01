/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useEffect, useContext, useCallback } from "react";
import {
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Dialog,
  TextField,
  Button,
  Typography,
  Tabs,
  Tab,
  Divider,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import UPResolver from "./UPResolver";
import { ethers } from "ethers";
import LSP4DigitalAsset from "@erc725/erc725.js/schemas/LSP4DigitalAsset.json";
import { DataContext } from "../lib/DataProvider";
import { ERC725 } from "@erc725/erc725.js";

const DelegationModal = ({ open, setOpen, dao }) => {
  const [delegateTo, setDelegateTo] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenBalance, setTokenBalance] = useState("");
  const [delegatee, setDelegatee] = useState(ethers.constants.AddressZero);
  const [loading, setLoading] = useState(true);
  const [delegating, setDelegating] = useState(false);
  const [refetcher, setRefetcher] = useState(0);

  const { getToken, web3, provider, erc725Config, upAddress, getUPAddress } =
    useContext(DataContext);

  useEffect(() => {
    setDelegateTo("");
    const main = async () => {
      await getUPAddress();
      if (upAddress) {
        const tokenAddress = dao[0].asset;
        const token = new ERC725(
          [LSP4DigitalAsset[0], LSP4DigitalAsset[1], LSP4DigitalAsset[2]],
          tokenAddress,
          provider,
          erc725Config
        );

        const tokenContract = getToken(tokenAddress);

        const tokenData = await token.fetchData();
        setTokenSymbol(tokenData[2].value);
        setTokenBalance(await tokenContract.ethers.balanceOf(upAddress));
        setDelegatee(await tokenContract.ethers.delegates(upAddress));
        setLoading(false);
      }
    };

    main();
  }, [open, upAddress, refetcher]);

  const handleClose = () => {
    setOpen(false);
  };

  const delegate = async () => {
    if (upAddress) {
      setDelegating(true);
      const tokenAddress = dao[0].asset;

      const tokenContract = getToken(tokenAddress);
      await tokenContract.web3.methods
        .delegate(delegateTo)
        .send({ from: upAddress })
        .on("receipt", function (receipt) {
          console.log(receipt);
          setDelegating(false);
          setRefetcher(refetcher + 1);
          /// Need to handle DAO ID and deployed addresses and resolve it;
        });
    }
  };

  // const delegatee = "0x5cd86aaC1D5450163fdD4DE3e51896Aa39D52CAe";

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle
        css={css`
          width: 600px;
        `}
      >
        Propose
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <>
            <Typography
              css={css`
                margin-bottom: 0.75em;
              `}
              variant="body1"
            >
              Loading delegation data ...
            </Typography>
          </>
        ) : (
          <>
            {" "}
            <Typography
              css={css`
                margin-bottom: 0.75em;
              `}
              variant="body1"
            >
              Balance: {String(tokenBalance)} ${tokenSymbol}
            </Typography>
            <div
              css={css`
                margin-bottom: 1.25em;
              `}
            >
              {delegatee &&
              ethers.utils.isAddress(delegatee) &&
              delegatee !== ethers.constants.AddressZero ? (
                <UPResolver address={delegatee} label="Delegatee:" />
              ) : (
                <Typography variant="body2">No Delegatee Yet!</Typography>
              )}
            </div>
            <div>
              {ethers.utils.isAddress(delegateTo) ? (
                <>
                  <UPResolver
                    address={ethers.utils.getAddress(delegateTo)}
                    onClose={() => {
                      setDelegateTo("");
                    }}
                    label="Delegate To:"
                  />
                </>
              ) : (
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Delegate To"
                  size="small"
                  value={delegateTo}
                  onChange={(e) => setDelegateTo(e.target.value)}
                  error={!!(delegateTo && !ethers.utils.isAddress(delegateTo))}
                  helperText={
                    !!(delegateTo && !ethers.utils.isAddress(delegateTo)) &&
                    "You can only delegate to a a proper address"
                  }
                />
              )}
            </div>
          </>
        )}
      </DialogContent>
      <DialogActions
        css={css`
          padding: 1em;
        `}
      >
        <Button
          onClick={() => {
            handleClose();
          }}
          size="small"
        >
          cancel
        </Button>
        <Button
          disabled={
            !ethers.utils.isAddress(delegateTo) || !upAddress || delegating
          }
          size="small"
          variant="contained"
          onClick={delegate}
        >
          {delegating ? "Delegating" : "Delegate"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DelegationModal;
