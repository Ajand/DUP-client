/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState } from "react";
import { TextField, Button, Typography, Checkbox } from "@mui/material";

const SetupTimelockController = () => {
  const [alreadyDeployed, setAlreadyDeployed] = useState(false);

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
          />
          <TextField
            css={css`
              margin-bottom: 0.75em;
            `}
            variant="outlined"
            label="Executor"
            size="small"
            fullWidth
            helperText="This is the account that can execute successful purposals. It's better to be a multisig."
          />
        </>
      )}
    </div>
  );
};

export default SetupTimelockController;
