import * as React from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import SetupUPForm from "./SetupUPForm";
import SetupGovernanceToken from "./SetupGovernanceToken";
import SetupGovernor from "./SetupGovernor";
import SetupTimelockController from "./SetupTimelockController";
import Confirmation from "./Confirmation";

const steps = [
  {
    label: "Setup your DAO Universal Profile",
    component: SetupUPForm,
  },
  {
    label: "Setup Governance Token",
    component: SetupGovernanceToken,
  },
  {
    label: "Setup Governor",
    component: SetupGovernor,
  },
  {
    label: "Setup Timelock",
    component: SetupTimelockController,
  },
  {
    label: "Confirmation and Deploy",
    component: Confirmation,
  },
];

export default function VerticalLinearStepper({
  activeStep,
  setActiveStep,
  daoInfo,
  setDAOInfo,
}) {
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                index === 2 ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null
              }
            >
              {step.label}
            </StepLabel>
            <StepContent>
              {<step.component daoInfo={daoInfo} setDAOInfo={setDAOInfo} />}
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}
    </Box>
  );
}
