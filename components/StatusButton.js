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

const StatusButton = ({ daoInfo }) => {
  const theme = useTheme();

  return (
    <Chip
      variant="outlined"
      color="primary"
      label="Deploying"
      icon={<CircularProgress size={20} />}
    />
  );
};

export default StatusButton;
