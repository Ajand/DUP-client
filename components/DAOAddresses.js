/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Paper, Typography, useTheme } from "@mui/material";

const DAOAddresses = ({ dao }) => {
  const theme = useTheme();


  return (
    <Paper
      css={css`
        padding: 1em;
        margin-top: 2em;
        margin-right: 0.5em;
      `}
    >
      <Typography
        variant="body1"
        css={css`
          color: ${theme.palette.primary.main};
          margin-bottom: 1em;
        `}
      >
        Contract Addresses
      </Typography>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5em;
        `}
      >
        <Typography variant="body1">Universal Profile</Typography>
        <Typography variant="body1">{dao[0].up}</Typography>
      </div>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5em;
        `}
      >
        <Typography variant="body1">Governance Token</Typography>
        <Typography variant="body1">{dao[0].asset}</Typography>
      </div>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5em;
        `}
      >
        <Typography variant="body1">Governor</Typography>
        <Typography variant="body1">{dao[0].governor}</Typography>
      </div>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5em;
        `}
      >
        <Typography variant="body1">Key Manager</Typography>
        <Typography variant="body1">{dao[0].keymanager}</Typography>
      </div>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5em;
        `}
      >
        <Typography variant="body1">Timelock Controller</Typography>
        <Typography variant="body1">{dao[0].timelockController}</Typography>
      </div>
    </Paper>
  );
};

export default DAOAddresses;
