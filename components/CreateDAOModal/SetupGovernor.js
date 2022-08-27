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
          <TextField
            multiline
            variant="outlined"
            label="Governor Address"
            size="small"
            fullWidth
            helperText="Contract must support Governor interface."
          />
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
            multiline
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
