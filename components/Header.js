/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

const Header = () => {
  return (
    <Box>
      <AppBar position="static" color="inherit">
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
            `}
          >
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              DUP
            </Typography>
            <Button
              css={css`
                margin-left: 2em;
              `}
              color="inherit"
            >
              Link a DAO
            </Button>
          </div>
          <Button variant="contained" color="primary">Connect with UP</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
