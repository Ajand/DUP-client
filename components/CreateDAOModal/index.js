/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState } from "react";
import {
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Dialog,
  TextField,
  Button,
} from "@mui/material";

import DAOCreationStepper from "./DAOCreationStepper";

const CreateDAOModal = ({ open, setOpen }) => {
  const [activeStep, setActiveStep] = useState(0);

  const [daoInfo, setDAOInfo] = useState({
    up: {
      name: "",
      description: "",
      avatar: null,
      cover: null,
      categories: [],
    },
    governanceToken: {
      supply: "",
      receiver: "",
      deployed: "",
    },
  });

  const handleClose = () => {
    setOpen(false);
  };

  const isDisabled = () => {
    switch (activeStep) {
      case 0:
        if (!daoInfo.up.name) return true;
        break;
    }

    return false;
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create a DAO</DialogTitle>
        <DialogContent>
          <DAOCreationStepper
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            setDAOInfo={setDAOInfo}
            daoInfo={daoInfo}
          />
        </DialogContent>
        <DialogActions
          css={css`
            padding: 1em;
          `}
        >
          <Button
            onClick={() => setActiveStep(activeStep - 1)}
            size="small"
            disabled={!(activeStep > 0)}
          >
            Back
          </Button>
          <Button
            onClick={() => setActiveStep(activeStep + 1)}
            size="small"
            variant="contained"
            disabled={isDisabled()}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateDAOModal;
