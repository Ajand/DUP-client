/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Paper, Typography, useTheme } from "@mui/material";
import { formatDateCompact } from "../lib/utils";

const ContractParams = ({ loading, timelockController, governor }) => {
  const theme = useTheme();

  console.log(loading, timelockController, governor);

  return (
    <Paper
      css={css`
        padding: 1em;
        margin-top: 2em;
        margin-right: 0.5em;
      `}
    >
      {loading ? (
        <>
          <Typography
            variant="body1"
            css={css`
              color: ${theme.palette.primary.main};
              margin-bottom: 1em;
            `}
          >
            Loading Parameters
          </Typography>
        </>
      ) : (
        <>
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
            <Typography variant="body1">Quorum needed</Typography>
            <Typography variant="body1">
              {String(governor.quorumNumerator)}%
            </Typography>
          </div>
          <div
            css={css`
              display: flex;
              justify-content: space-between;
              margin-bottom: 0.5em;
            `}
          >
            <Typography variant="body1">Proposal delay</Typography>
            <Typography variant="body1">
              {formatDateCompact(String(governor.votingDelay.mul(7)))}
            </Typography>
          </div>
          <div
            css={css`
              display: flex;
              justify-content: space-between;
              margin-bottom: 0.5em;
            `}
          >
            <Typography variant="body1">Voting Period</Typography>
            <Typography variant="body1">
              {" "}
              {formatDateCompact(String(governor.votingPeriod.mul(7)))}
            </Typography>
          </div>
          <div
            css={css`
              display: flex;
              justify-content: space-between;
              margin-bottom: 0.5em;
            `}
          >
            <Typography variant="body1">Execution Delay</Typography>
            <Typography variant="body1">
              {" "}
              {formatDateCompact(String(timelockController.minimumDelay))}
            </Typography>
          </div>
        </>
      )}
    </Paper>
  );
};

export default ContractParams;
