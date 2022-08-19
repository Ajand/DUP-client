/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Paper, Typography, useTheme } from "@mui/material";

const ContractParams = () => {
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
        Parameters
      </Typography>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5em;
        `}
      >
        <Typography variant="body1">Proposal threshold</Typography>
        <Typography variant="body1">2.5M</Typography>
      </div>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5em;
        `}
      >
        <Typography variant="body1">Quorum needed</Typography>
        <Typography variant="body1">45M</Typography>
      </div>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5em;
        `}
      >
        <Typography variant="body1">Proposal delay</Typography>
        <Typography variant="body1">2 days</Typography>
      </div>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5em;
        `}
      >
        <Typography variant="body1">Voting Period</Typography>
        <Typography variant="body1">7 days</Typography>
      </div>
    </Paper>
  );
};

export default ContractParams;
