/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Avatar,
  IconButton,
  useTheme,
} from "@mui/material";
import { Close } from "@mui/icons-material";

const SetupUPForm = ({ daoInfo, setDAOInfo }) => {
  const theme = useTheme();

  const setField = (fieldName, value) => {
    const ndi = { ...daoInfo };
    ndi.up[fieldName] = value;
    setDAOInfo(ndi);
  };

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
        onChange={(e) => setField("name", e.target.value)}
        value={daoInfo.up.name}
        helperText={"A name for DAO is required."}
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
        onChange={(e) => setField("description", e.target.value)}
        value={daoInfo.up.description}
      />
      <div>
        {daoInfo.up.avatar ? (
          <>
            <div
              css={css`
                margin-bottom: 0.75em;
              `}
            >
              <div
                css={css`
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  margin-bottom: 0.5em;
                `}
              >
                <Typography variant="body1">Avatar:</Typography>
                <div>
                  <Button
                    color="secondary"
                    component="label"
                    onChange={(e) => setField("avatar", e.target.files[0])}
                  >
                    Change
                    <input hidden accept="image/*" type="file" />
                  </Button>
                  <Button
                    onClick={(e) => setField("avatar", null)}
                    color="error"
                  >
                    Remove
                  </Button>
                </div>
              </div>
              <Avatar
                sx={{ width: 150, height: 150 }}
                src={URL.createObjectURL(daoInfo.up.avatar)}
              />
            </div>
          </>
        ) : (
          <>
            <Button
              css={css`
                margin-bottom: 0.75em;
              `}
              variant="outlined"
              color="primary"
              size="small"
              component="label"
              onChange={(e) => setField("avatar", e.target.files[0])}
            >
              Upload An Avatar
              <input hidden accept="image/*" type="file" />
            </Button>
          </>
        )}
      </div>
      <div>
        {daoInfo.up.cover ? (
          <>
            <div
              css={css`
                margin-bottom: 0.75em;
              `}
            >
              <div
                css={css`
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  margin-bottom: 0.5em;
                `}
              >
                <Typography variant="body1">Cover:</Typography>
                <div>
                  <Button
                    color="secondary"
                    component="label"
                    onChange={(e) => setField("cover", e.target.files[0])}
                  >
                    Change
                    <input hidden accept="image/*" type="file" />
                  </Button>
                  <Button
                    onClick={(e) => setField("cover", null)}
                    color="error"
                  >
                    Remove
                  </Button>
                </div>
              </div>
              <img src={URL.createObjectURL(daoInfo.up.cover)} css={css`width: 100%`} />
            </div>
          </>
        ) : (
          <>
            <Button
              css={css`
                margin-bottom: 0.75em;
              `}
              variant="outlined"
              color="primary"
              size="small"
              component="label"
              onChange={(e) => setField("cover", e.target.files[0])}
            >
              Upload A Cover Image
              <input hidden accept="image/*" type="file" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default SetupUPForm;
