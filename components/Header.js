/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();
  return (
    <Box>
      <AppBar
        position="static"
        color="inherit"
        css={css`
          border-radius: 0;
        `}
      >
        <Toolbar
          css={css`
            display: flex;
            justify-content: space-between;
          `}
        >
          <div
            css={css`
              display: flex;
              align-items: center;
              cursor: pointer;
            `}
            onClick={() => router.push("/")}
          >
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              DUP
            </Typography>
          </div>
          {/*  <Button variant="contained" color="primary">
            Connect with UP
  </Button> */}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
