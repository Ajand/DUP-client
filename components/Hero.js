/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Container, Typography, useTheme, Button } from "@mui/material";

const Hero = () => {
  const theme = useTheme();

  return (
    <Container
      css={css`
        padding-top: 4em;
      `}
    >
      <Typography variant="h2">
        Start, join and grow decentralized organizations that are powered by
        <span
          css={css`
            color: ${theme.palette.primary.main};
          `}
        >
          {" "}
          Universal Profiles
        </span>
      </Typography>
      <div css={css`margin-top: 2em`}>
        <Button variant="contained" color="primary">
            Start A DAO
        </Button>
        <Button css={css`margin-left: 1em`} variant="contained" color="secondary">
            Create A Governance Token
        </Button>
      </div>
    </Container>
  );
};

export default Hero;
