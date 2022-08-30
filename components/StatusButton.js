/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import {
  TextField,
  Button,
  Typography,
  Checkbox,
  Avatar,
  useTheme,
  CircularProgress,
  Divider,
  Chip,
} from "@mui/material";
import { Pending, Upload, CheckCircleOutline } from "@mui/icons-material";

const StatusButton = ({ status }) => {
  const theme = useTheme();


  if (status === "waiting") return <div></div>;
  if (status === "uploading")
    return (
      <Chip
        variant="outlined"
        color="primary"
        label="Uploading"
        icon={<Upload size={20} />}
        size="small"
      />
    );
  if (status === "uploaded")
    return (
      <Chip
        variant="filled"
        color="primary"
        label="Uploaded"
        icon={<CheckCircleOutline size={20} />}
        size="small"
      />
    );
  if (status === "pending")
    return (
      <Chip
        variant="filled"
        label="Pending"
        icon={<Pending size={20} />}
        size="small"
      />
    );
  if (status === "deploying")
    return (
      <Chip
        variant="outlined"
        label="Deploying"
        size="small"
        css={css`
          padding-left: 3px;
        `}
        icon={<CircularProgress size={12} />}
      />
    );
  if (status === "deployed")
    return (
      <Chip
        variant="filled"
        label="Deployed"
        size="small"
        icon={<CheckCircleOutline />}
      />
    );
  if (status === "setting-up")
    return (
      <Chip
        variant="outlined"
        label="Setting Up"
        size="small"
        color="secondary"
        css={css`
          padding-left: 3px;
        `}
        icon={<CircularProgress size={12} />}
      />
    );
  return (
    <Chip
      variant="filled"
      color="secondary"
      label="Ready"
      size="small"
      icon={<CheckCircleOutline />}
    />
  );
};

export default StatusButton;
