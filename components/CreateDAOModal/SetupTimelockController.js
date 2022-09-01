/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useEffect } from "react";
import { TextField, Button, Typography, Checkbox } from "@mui/material";
import TimelockResolver from "../TimelockResolver";
import UPResolver from "../UPResolver";
import { ethers } from "ethers";

//0x24F3D0801e59B9Ea82bAB027c77821408547cEBE

const SetupTimelockController = ({ daoInfo, setDAOInfo }) => {
  const [alreadyDeployed, setAlreadyDeployed] = useState(false);

  const setField = (fieldName, value) => {
    const ndi = { ...daoInfo };
    ndi.timelock[fieldName] = value;
    setDAOInfo(ndi);
  };

  useEffect(() => {
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
          {ethers.utils.isAddress(daoInfo.timelock.deployed) ? (
            <>
              <TimelockResolver
                address={ethers.utils.getAddress(daoInfo.timelock.deployed)}
                onClose={() => {
                  setField("deployed", "");
                }}
                label="Timelock Controlerr:"
              />
            </>
          ) : (
            <TextField
              css={css`
                margin-bottom: 0.75em;
              `}
              variant="outlined"
              label="Timelock Controller Address"
              size="small"
              fullWidth
              onChange={(e) => setField("deployed", e.target.value)}
              value={daoInfo.timelock.deployed}
              error={
                !!(
                  daoInfo.timelock.deployed &&
                  !ethers.utils.isAddress(daoInfo.timelock.deployed)
                )
              }
              helperText={
                daoInfo.timelock.deployed &&
                !ethers.utils.isAddress(daoInfo.timelock.deployed) &&
                "Contract must be a timelock controller."
              }
            />
          )}
        </>
      ) : (
        <>
          <TextField
            css={css`
              margin-bottom: 0.75em;
            `}
            variant="outlined"
            label="Minimum Delay (Seconds)"
            size="small"
            fullWidth
            onChange={(e) => setField("minimumDelay", e.target.value)}
            value={daoInfo.timelock.minimumDelay}
            error={!!isNaN(daoInfo.timelock.minimumDelay)}
            helperText={
              isNaN(daoInfo.timelock.minimumDelay)
                ? "Minimum delay must be a number."
                : ""
            }
          />
          <>
            {
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
                  !!(
                    daoInfo.timelock.executor &&
                    !ethers.utils.isAddress(daoInfo.timelock.executor)
                  )
                }
                helperText={
                  !(
                    daoInfo.timelock.executor &&
                    !ethers.utils.isAddress(daoInfo.timelock.executor)
                  )
                    ? "Usually this is address 0. It means everybody become executor."
                    : "Executor must be a proper address"
                }
              />
            }
          </>
        </>
      )}
    </div>
  );
};

export default SetupTimelockController;
