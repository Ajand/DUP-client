/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import {
  Container,
  Typography,
  Paper,
  Divider,
} from "@mui/material";

const imageAddress =
  "https://www.tally.xyz/_next/image?url=https%3A%2F%2Fstatic.withtally.com%2Fd9e8442f-5cb7-4357-9567-3cdd7ae5930e_400x400.jpg&w=256&q=75";

const Explore = () => {
  return (
    <Container
      css={css`
        padding-top: 4em;
        padding-bottom: 4em;
      `}
    >
      <Paper
        css={css`
          padding: 2em;
        `}
      >
        <Typography variant="h4">Explore DAOs</Typography>
        <Divider
          css={css`
            margin-top: 1em;
            margin-bottom: 1em;
          `}
        />
        {[1, 2, 3, 4, 5].map((dao) => {
          return (
            <div
              css={css`
                padding: 1em;
                transition: 200ms;
                display: flex;
                margin-bottom: 1em;
                cursor: pointer;
                justify-content: space-between;
                &:hover {
                  background: #f0f0f0;
                }
              `}
            >
              <div
                css={css`
                  display: flex;
                  align-items: center;
                `}
              >
                <img src={imageAddress} width={50} height={50} />
                <Typography
                  css={css`
                    margin-left: 1em;
                  `}
                  variant="h6"
                >
                  Uniswap DAO
                </Typography>
              </div>
              <div
                css={css`
                  display: flex;
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
                  <Typography variant="body2">Proposals</Typography>
                  <Typography variant="body1">1000</Typography>
                </div>
                <div
                  css={css`
                    text-align: center;
                    margin-left: 1em;
                  `}
                >
                  <Typography variant="body2">Proposals</Typography>
                  <Typography variant="body1">1000</Typography>
                </div>
              </div>
            </div>
          );
        })}
      </Paper>
    </Container>
  );
};

export default Explore;
