/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState } from "react";
import { TextField, Button, Typography, Checkbox } from "@mui/material";

const SetupUPForm = () => {
  const [alreadyDeployed, setAlreadyDeployed] = useState(false);

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
          />
          <TextField
            multiline
            variant="outlined"
            label="Receiver"
            size="small"
            fullWidth
          />
        </>
      )}
    </div>
  );
};

export default SetupUPForm;
