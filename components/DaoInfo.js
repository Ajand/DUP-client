/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import {
  Container,
  Typography,
  Button,
  Avatar,
  Paper,
  Grid,
  Item,
} from "@mui/material";

import ContractParams from "./ContractParams";

const imageAddress =
  "https://www.tally.xyz/_next/image?url=https%3A%2F%2Fstatic.withtally.com%2Fd9e8442f-5cb7-4357-9567-3cdd7ae5930e_400x400.jpg&w=256&q=75";

const DAOInfo = () => {
  return (
    <Container
      css={css`
        padding-top: 5em;
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          margin-bottom: 2em;
        `}
      >
        <div
          css={css`
            display: flex;
          `}
        >
          <Avatar src={imageAddress} />
          <div
            css={css`
              margin-left: 1em;
            `}
          >
            <Typography variant="h4">Uniswap</Typography>
            <Typography variant="body2">https://uniswap.org</Typography>
          </div>
        </div>
        <div>
          <Button variant="outlined">Create New Proposal</Button>
          <Button
            css={css`
              margin-left: 1em;
            `}
            variant="contained"
          >
            Delegate Vote
          </Button>
        </div>
      </div>
      <Paper
        css={css`
          padding: 1em;
        `}
      >
        <div
          css={css`
            display: flex;
            justify-content: space-between;
            max-width: 400px;
            margin: auto;
          `}
        >
          <div
            css={css`
              text-align: center;
            `}
          >
            <Typography variant="body2">Proposals</Typography>
            <Typography variant="body1">1000</Typography>
          </div>
          <div
            css={css`
              text-align: center;
              margin-left: 1em;
            `}
          >
            <Typography variant="body2">Holders</Typography>
            <Typography variant="body1">1000</Typography>
          </div>
          <div
            css={css`
              text-align: center;
              margin-left: 1em;
            `}
          >
            <Typography variant="body2">Voters</Typography>
            <Typography variant="body1">1000</Typography>
          </div>
        </div>
      </Paper>
      <div>
        <Grid container >
          <Grid md={4}>
            <ContractParams />
          </Grid>
          <Grid md={8}>
            <ContractParams />
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};

export default DAOInfo;
