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
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import UPResolver from "./UPResolver";
import { ethers } from "ethers";
import LSP4DigitalAsset from "@erc725/erc725.js/schemas/LSP4DigitalAsset.json";
import { upload } from "../lib/web3StorageHelpers";
import { DataContext } from "../lib/DataProvider";
import { ERC725 } from "@erc725/erc725.js";

const DelegationModal = ({ open, setOpen, dao, proposalId }) => {
  const [voting, setVoting] = useState(false);

  const [selectedVote, setSelectedVote] = useState(null);
  const [reason, setReason] = useState("");

  const { getGovernor, upAddress, getUPAddress } = useContext(DataContext);

  useEffect(() => {
    setSelectedVote(null);
    const main = async () => {
      await getUPAddress();
    };

    main();
  }, [open, upAddress]);

  const handleClose = () => {
    setOpen(false);
    setVoting(false);
  };

  const vote = async () => {
    if (upAddress) {
      setVoting(true);
      const governorAddress = dao[0].governor;
      if (reason) {
        const reasonCid = await upload(reason);
        const governorContract = getGovernor(governorAddress);
        await governorContract.web3.methods
          .castVoteWithReason(proposalId, selectedVote, `ipfs://${reasonCid}`)
          .send({ from: upAddress })
          .on("receipt", function (receipt) {
            handleClose();
            setVoting(false);
          });
      } else {
        const governorContract = getGovernor(governorAddress);
        await governorContract.web3.methods
          .castVote(proposalId, selectedVote)
          .send({ from: upAddress })
          .on("receipt", function (receipt) {
            handleClose();
            setVoting(false);
          });
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle
        css={css`
          width: 600px;
        `}
      >
        Vote
      </DialogTitle>
      <DialogContent>
        <FormControl
          css={css`
            margin-bottom: 0.75em;
          `}
        >
          <FormLabel>Your Vote</FormLabel>
          <RadioGroup
            value={selectedVote}
            onChange={(e) => setSelectedVote(e.target.value)}
          >
            <FormControlLabel value={0} control={<Radio />} label="Against" />
            <FormControlLabel value={1} control={<Radio />} label="For" />
            <FormControlLabel value={2} control={<Radio />} label="Abstain" />
          </RadioGroup>
        </FormControl>
        <TextField
          css={css`
            margin-bottom: 0.75em;
            border-radius: 20px;
          `}
          multiline
          variant="outlined"
          size="small"
          label="Reason"
          value={reason}
          fullWidth
          onChange={(e) => setReason(e.target.value)}
        />
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
          disabled={selectedVote === null || voting}
          size="small"
          variant="contained"
          onClick={vote}
        >
          {voting ? "Voting" : "Vote"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DelegationModal;
