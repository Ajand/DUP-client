/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useEffect } from "react";
import { TextField, Button, Typography, Checkbox } from "@mui/material";
import UPResolver from "../UPResolver";
import { ethers } from "ethers";

const SetupTimelockController = ({ daoInfo, setDAOInfo }) => {
  const [alreadyDeployed, setAlreadyDeployed] = useState(false);

  const setField = (fieldName, value) => {
    const ndi = { ...daoInfo };
    ndi.timelock[fieldName] = value;
    setDAOInfo(ndi);
  };

  useEffect(() => {
    setField("minimumDelay", "");
    setField("executor", "");
    setField("deployed", "");
  }, [alreadyDeployed]);

  return (
    <div>
      <Typography
        variant="body1"
        css={css`
          margin-bottom: 0.75em;
        `}
      >
        Timelock Controller is the security guard of DAO. It will defend the DAO
        from malicious actors by providing a delay for task execution.
      </Typography>
      <div
        css={css`
          display: flex;
          align-items: center;
          margin-bottom: 0.75em;
          cursor: pointer;
        `}
        onClick={() => setAlreadyDeployed(!alreadyDeployed)}
      >
        <Checkbox checked={alreadyDeployed} color="secondary" size="small" />{" "}
        <Typography
          css={css`
            margin-left: 0.25em;
          `}
          variant="body2"
        >
          Already have a deployed Timelock Controller.
        </Typography>
      </div>
      {alreadyDeployed ? (
        <>
          <TextField
            variant="outlined"
            label="Timelock Controller Address"
            size="small"
            fullWidth
            helperText="Contract must be a timelock controller."
          />
        </>
      ) : (
        <>
          <TextField
            css={css`
              margin-bottom: 0.75em;
            `}
            variant="outlined"
            label="Minimum Delay"
            size="small"
            fullWidth
            onChange={(e) => setField("minimumDelay", e.target.value)}
            value={daoInfo.timelock.minimumDelay}
            error={isNaN(daoInfo.timelock.minimumDelay)}
            helperText={
              isNaN(daoInfo.timelock.minimumDelay)
                ? "Minimum delay must be a number."
                : ""
            }
          />
          <>
            {ethers.utils.isAddress(daoInfo.timelock.executor) ? (
              <>
                <UPResolver
                  address={ethers.utils.getAddress(daoInfo.timelock.executor)}
                  onClose={() => {
                    setField("executor", "");
                  }}
                  label="Executor:"
                />
              </>
            ) : (
              <TextField
                css={css`
                  margin-bottom: 0.75em;
                `}
                variant="outlined"
                label="Executor"
                size="small"
                fullWidth
                onChange={(e) => setField("executor", e.target.value)}
                value={daoInfo.timelock.executor}
                error={
                  daoInfo.timelock.executor &&
                  !ethers.utils.isAddress(daoInfo.timelock.executor)
                }
                helperText={
                  !(
                    daoInfo.timelock.executor &&
                    !ethers.utils.isAddress(daoInfo.timelock.executor)
                  )
                    ? "This is the account that can execute successful purposals. It's better to be a multisig."
                    : "Executor must be a proper address"
                }
              />
            )}
          </>
        </>
      )}
    </div>
  );
};

export default SetupTimelockController;
