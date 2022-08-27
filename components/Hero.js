/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState } from "react";
import { Container, Typography, useTheme, Button } from "@mui/material";
import { useRouter } from "next/router";

import CreateDAOModal from "./CreateDAOModal";

const Hero = () => {
  const theme = useTheme();
  const router = useRouter();

  const [createDAODialogOpen, setCreateDAODialogOpen] = useState(false);

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
      <div
        css={css`
          margin-top: 2em;
        `}
      >
        <Button
          onClick={() => {
            setCreateDAODialogOpen(true);
          }}
          variant="contained"
          color="primary"
        >
          Start A DAO
        </Button>
        <Button
          onClick={() => {
            router.push("/token-factory");
          }}
          css={css`
            margin-left: 1em;
          `}
          variant="contained"
          color="secondary"
        >
          Create A Governance Token
        </Button>
      </div>
      <CreateDAOModal
        open={createDAODialogOpen}
        setOpen={setCreateDAODialogOpen}
      />
    </Container>
  );
};

export default Hero;
