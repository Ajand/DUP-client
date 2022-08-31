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
import { Add } from "@mui/icons-material";
import { ethers } from "ethers";
import CallDataForm from "./CallDataForm";
import { upload } from "../../lib/web3StorageHelpers";
import { DataContext } from "../../lib/DataProvider";

const ProposeModal = ({ open, setOpen, dao }) => {
  const [description, setDescription] = useState("");
  const [proposalName, setProposalName] = useState("");
  const [proposing, setProposing] = useState(false);
  const [actions, setActions] = useState([
    {
      target: "",
      executionType: 0,
      value: "",
      callData: "",
    },
  ]);
  const [activeAction, setActiveAction] = useState(0);
  const [abisInfo, setAbisInfo] = useState([
    { abi: "", inputs: [], params: [] },
  ]);

  const { getGovernor, getUPAddress } = useContext(DataContext);

  const addAction = () => {
    setActions([
      ...actions,
      {
        target: "",
        executionType: 0,
        value: "",
        callAbi: "",
        callData: "",
      },
    ]);
    setAbisInfo([...abisInfo, { abi: "", inputs: [], params: [] }]);
    setActiveAction(activeAction + 1);
  };

  const removeAction = (index) => {
    if (actions.length < 2) return;
    if (activeAction > 0) {
      setActiveAction(activeAction - 1);
    }
    setActions(actions.filter((action, i) => i !== index));
    setAbisInfo(abisInfo.filter((abiInfo, i) => i !== index));
  };

  const setAbiValue = (index) => (key, value) => {
    const a = [...abisInfo];
    a[index][key] = value;
    setActions(a);
  };

  const setActionValue = (index, key, value) => {
    const a = [...actions];
    a[index][key] = value;
    setActions(a);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const isDisabled = () => {
    if (!proposalName) return true;
    if (!description) return true;
    let disabled = false;
    actions.forEach((action) => {
      if (!action.target) {
        disabled = true;
        return;
      }
      if (
        action.target &&
        !ethers.utils.isAddress(actions[activeAction].target)
      ) {
        disabled = true;
        return;
      }
      if (!action.value) {
        disabled = true;
        return;
      }
      if (action.value && isNaN(action.value)) {
        disabled = true;
        return;
      }
      if (!action.callData) {
        disabled = true;
        return;
      }
    });
    return disabled;
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle
          css={css`
            width: 600px;
          `}
        >
          Propose
        </DialogTitle>
        <DialogContent>
          <div
            css={css`
              padding-top: 1em;
            `}
          ></div>
          <TextField
            label="Proposal Name"
            variant="outlined"
            fullWidth
            size="small"
            css={css`
              margin-bottom: 0.75em;
            `}
            value={proposalName}
            onChange={(e) => setProposalName(e.target.value)}
          />
          <TextField
            label="Description"
            variant="outlined"
            multiline
            fullWidth
            size="small"
            helperText="markdown supported"
            css={css`
              margin-bottom: 0.75em;
            `}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />

          <Tabs
            variant="scrollable"
            onChange={(e, v) => setActiveAction(v)}
            value={activeAction}
          >
            {[...actions, ""].map((action, i) =>
              actions.length === i ? (
                <div
                  css={css`
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-left: 0.5em;
                  `}
                >
                  <IconButton onClick={() => addAction()} size="small">
                    <Add />
                  </IconButton>
                </div>
              ) : (
                <Tab label={`Action ${i + 1}`} Ico />
              )
            )}
          </Tabs>
          <Divider />
          <div
            css={css`
              margin-top: 1em;
            `}
          >
            {actions.length > 1 && (
              <Button
                color="error"
                css={css`
                  margin-bottom: 1em;
                `}
                onClick={() => removeAction(activeAction)}
              >
                Delete Action
              </Button>
            )}

            <TextField
              label="Target Contract"
              variant="outlined"
              fullWidth
              size="small"
              css={css`
                margin-bottom: 0.75em;
              `}
              value={actions[activeAction].target}
              onChange={(e) =>
                setActionValue(activeAction, "target", e.target.value)
              }
              error={
                actions[activeAction].target &&
                !ethers.utils.isAddress(actions[activeAction].target)
              }
              helperText={
                actions[activeAction].target &&
                !ethers.utils.isAddress(actions[activeAction].target) &&
                "Token address must be an address."
              }
            />

            <FormControl
              css={css`
                margin-bottom: 0.75em;
              `}
              size="small"
              fullWidth
            >
              <InputLabel>Execution Type</InputLabel>
              <Select
                value={actions[activeAction].executionType}
                label="Execution Type"
                onChange={(e) =>
                  setActionValue(activeAction, "executionType", e.target.value)
                }
              >
                <MenuItem value={0}>CALL</MenuItem>
                <MenuItem value={1}>DELEGATECALL</MenuItem>
                <MenuItem value={2}>STATICCALL</MenuItem>
                <MenuItem value={3}>CREATE</MenuItem>
                <MenuItem value={4}>CREATE2</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Value"
              variant="outlined"
              fullWidth
              size="small"
              css={css`
                margin-bottom: 0.75em;
              `}
              value={actions[activeAction].value}
              onChange={(e) =>
                setActionValue(activeAction, "value", e.target.value)
              }
              error={
                actions[activeAction].value &&
                isNaN(actions[activeAction].value)
              }
              helperText={
                actions[activeAction].value &&
                isNaN(actions[activeAction].value) &&
                "Value must be a number."
              }
            />
            <CallDataForm
              activeAction={activeAction}
              value={actions[activeAction].callData}
              setActionValue={setActionValue}
              abiInfo={abisInfo[activeAction]}
              setAbiValue={setAbiValue(activeAction)}
            />
          </div>
        </DialogContent>
        <DialogActions
          css={css`
            padding: 1em;
          `}
        >
          <Button
            onClick={() => {
              //setOpen(false);
              setProposing(false);
            }}
            size="small"
          >
            cancel
          </Button>
          <Button
            disabled={isDisabled() || proposing}
            onClick={async () => {
              const myUpAddress = await getUPAddress();

              setProposing(true);
              const GovernanceABI = [
                "function execute(uint256 operation, address to,uint256 value, bytes data)",
              ];

              let GovernanceIface = new ethers.utils.Interface(GovernanceABI);

              const proposal = {
                name: proposalName,
                description,
                actions: actions.map((action, i) => ({
                  ...action,
                  abiInfo: abisInfo[i],
                  data: GovernanceIface.encodeFunctionData("execute", [
                    action.executionType,
                    action.target,
                    action.value,
                    action.callData,
                  ]),
                })),
              };

              const callDatas = proposal.actions.map((action) => action.data);

              const descriptionUrl = `ipfs://${await upload(proposal)}`;

              const governor = getGovernor(dao[0].governor);

              governor.web3.methods
                .propose(callDatas, descriptionUrl)
                .send({ from: myUpAddress })
                .on("error", function (error) {
                  reject(error);
                })
                .on("transactionHash", function (transactionHash) {
                  console.log("txHash: ", transactionHash);
                })
                .on("receipt", function (receipt) {
                  console.log("receipt: ", receipt.contractAddress); // contains the new contract address
                  setProposing(false);
                  handleClose();
                })
                .on("confirmation", function (confirmationNumber, receipt) {
                  console.log("confirmation: ", confirmationNumber);
                });
            }}
            size="small"
            variant="contained"
          >
            {proposing ? "Proposing ..." : "Propose"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProposeModal;
