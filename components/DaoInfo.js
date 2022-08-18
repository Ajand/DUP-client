/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Container, Typography, Button, Avatar, Paper } from "@mui/material";

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
      <div>
        <ContractParams />
      </div>
    </Container>
  );
};

export default DAOInfo;
