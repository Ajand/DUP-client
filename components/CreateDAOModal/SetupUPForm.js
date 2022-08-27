/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";

const SetupUPForm = () => {
  return (
    <div>
      <Typography
        variant="body1"
        css={css`
          margin-bottom: 0.75em;
        `}
      >
        Setup a Universal Profile For your DAO. This profile will store DAO
        informations, and will act is the DAO Identitiy.
      </Typography>
      <TextField
        css={css`
          margin-bottom: 0.75em;
        `}
        variant="outlined"
        label="name"
        size="small"
        fullWidth
      />
      <TextField
        css={css`
          margin-bottom: 0.75em;
          border-radius: 20px;
        `}
        multiline
        variant="outlined"
        label="description"
        size="small"
        fullWidth
      />
      <div>
        <Button
          css={css`
            margin-bottom: 0.75em;
          `}
          variant="outlined"
          color="primary"
          size="small"
        >
          Upload An Avatar
        </Button>
      </div>
      <div>
        <Button
          css={css`
            margin-bottom: 0.75em;
          `}
          variant="outlined"
          color="primary"
          size="small"
        >
          Upload A Cover Image
        </Button>
      </div>
    </div>
  );
};

export default SetupUPForm;
