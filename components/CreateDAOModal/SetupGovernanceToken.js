/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState } from "react";
import { TextField, Button, Typography, Checkbox } from "@mui/material";
import { ethers } from "ethers";
import UPResolver from "../UPResolver";

const SetupGovernanceToken = ({ daoInfo, setDAOInfo }) => {
  const [alreadyDeployed, setAlreadyDeployed] = useState(false);

  const setField = (fieldName, value) => {
    const ndi = { ...daoInfo };
    ndi.governanceToken[fieldName] = value;
    setDAOInfo(ndi);
  };

  return (
    <div>
      <Typography
        variant="body1"
        css={css`
          margin-bottom: 0.75em;
        `}
      >
        Each DAO needs a governance token that can be use to vote for different
        proposals, change contracts and manage treasuries.
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
          Already have a deployed governance token.
        </Typography>
      </div>
      {alreadyDeployed ? (
        <>
          <TextField
            multiline
            variant="outlined"
            label="Governance Token Address"
            size="small"
            fullWidth
            helperText="Token must support ILSP7Votes interface."
            onChange={(e) => setField("deployed", e.target.value)}
            value={daoInfo.governanceToken.deployed}
          />
        </>
      ) : (
        <>
          {" "}
          <TextField
            css={css`
              margin-bottom: 0.75em;
            `}
            variant="outlined"
            label="Supply Amount"
            size="small"
            fullWidth
            onChange={(e) => setField("supply", e.target.value)}
            value={daoInfo.governanceToken.supply}
            error={isNaN(daoInfo.governanceToken.supply)}
            helperText={
              isNaN(daoInfo.governanceToken.supply)
                ? "Supply must be a number."
                : ""
            }
          />
          {ethers.utils.isAddress(daoInfo.governanceToken.receiver) ? (
            <>
              <UPResolver
                address={ethers.utils.getAddress(
                  daoInfo.governanceToken.receiver
                )}
                onClose={() => {
                  setField("receiver", "");
                }}
                label="Receiver:"
              />
            </>
          ) : (
            <>
              <TextField
                multiline
                variant="outlined"
                label="Receiver"
                size="small"
                fullWidth
                onChange={(e) => setField("receiver", e.target.value)}
                value={daoInfo.governanceToken.receiver}
                error={
                  daoInfo.governanceToken.receiver &&
                  !ethers.utils.isAddress(daoInfo.governanceToken.receiver)
                }
                helperText={
                  daoInfo.governanceToken.receiver &&
                  !ethers.utils.isAddress(daoInfo.governanceToken.receiver)
                    ? "Receiver must be an address."
                    : ""
                }
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default SetupGovernanceToken;