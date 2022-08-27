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

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create a DAO</DialogTitle>
        <DialogContent>
          <DAOCreationStepper
            activeStep={activeStep}
            setActiveStep={setActiveStep}
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
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateDAOModal;
