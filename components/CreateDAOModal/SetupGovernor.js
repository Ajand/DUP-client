/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useEffect } from "react";
import { TextField, Button, Typography, Checkbox } from "@mui/material";
import GovernorResolver from "../GovernorResolver";
import { ethers } from "ethers";

//0x9cfcDa91BA405606cAb1eDb936c9f27005Eed990

const SetupUPForm = ({ daoInfo, setDAOInfo }) => {
  const [alreadyDeployed, setAlreadyDeployed] = useState(true);

  const setField = (fieldName, value) => {
    const ndi = { ...daoInfo };
    ndi.governor[fieldName] = value;
    setDAOInfo(ndi);
  };

  useEffect(() => {
    setField("votingDelay", "");
    setField("votingPeriod", "");
    setField("quorumNumerator", "");
    setField("delpyed", "");
  }, [alreadyDeployed]);

  return (
    <div>
      <Typography
        variant="body1"
        css={css`
          margin-bottom: 0.75em;
        `}
      >
        The brain of a DAO is the governor contract. It will be responsible for
        creating purposals and voting.
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
          Already have a deployed governor.
        </Typography>
      </div>
      {alreadyDeployed ? (
        <>
          {ethers.utils.isAddress(daoInfo.governor.deployed) ? (
            <>
              <GovernorResolver
                address={ethers.utils.getAddress(daoInfo.governor.deployed)}
                onClose={() => {
                  setField("deployed", "");
                }}
                label="Governance Token:"
              />
            </>
          ) : (
            <>
              <TextField
                variant="outlined"
                label="Governor Address"
                size="small"
                fullWidth
                onChange={(e) => setField("deployed", e.target.value)}
                value={daoInfo.governor.deployed}
                error={
                  daoInfo.governor.deployed &&
                  !ethers.utils.isAddress(daoInfo.governor.deployed)
                }
                helperText="Contract must support Governor interface."
              />
            </>
          )}
        </>
      ) : (
        <>
          <TextField
            css={css`
              margin-bottom: 0.75em;
            `}
            variant="outlined"
            label="Voting Delay"
            size="small"
            fullWidth
          />
          <TextField
            css={css`
              margin-bottom: 0.75em;
            `}
            variant="outlined"
            label="Voting Period"
            size="small"
            fullWidth
          />
          <TextField
            variant="outlined"
            label="Quorum Numerator"
            size="small"
            fullWidth
          />
        </>
      )}
    </div>
  );
};

export default SetupUPForm;
