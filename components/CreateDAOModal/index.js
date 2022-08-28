/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useEffect, useContext } from "react";
import {
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Dialog,
  TextField,
  Button,
} from "@mui/material";
import { ethers } from "ethers";
import { DataContext } from "../../lib/DataProvider";

import DAOCreationStepper from "./DAOCreationStepper";

const CreateDAOModal = ({ open, setOpen }) => {
  const [activeStep, setActiveStep] = useState(2);

  const [isContinueDisabled, setIsContinueDisabled] = useState(false);

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
    governor: {
      votingDelay: "",
      votingPeriod: "",
      quorumNumerator: "",
      deployed: "",
    },
  });

  const handleClose = () => {
    setOpen(false);
  };

  const { erc725Config, getToken, getGovernor } = useContext(DataContext);

  useEffect(() => {
    const main = async () => {
      setIsContinueDisabled(true);
      let result = false;
      switch (activeStep) {
        case 0:
          if (!daoInfo.up.name) result = true;
          break;
        case 1:
          if (daoInfo.governanceToken.deployed) {
            if (!ethers.utils.isAddress(daoInfo.governanceToken.deployed)) {
              result = true;
            } else {
              const tokenApi = getToken(daoInfo.governanceToken.deployed);
              try {
                const isTokenVotes = await tokenApi.ethers.getVotes(
                  ethers.constants.AddressZero
                );
              } catch (err) {
                result = true;
              }
            }
          } else {
            if (
              !daoInfo.governanceToken.supply ||
              !daoInfo.governanceToken.receiver ||
              !ethers.utils.isAddress(daoInfo.governanceToken.receiver) ||
              isNaN(daoInfo.governanceToken.supply)
            )
              result = true;
          }
        case 2:
          if (daoInfo.governor.deployed) {
            if (!ethers.utils.isAddress(daoInfo.governor.deployed)) {
              result = true;
            } else {
              const governorApi = getGovernor(daoInfo.governor.deployed);
              try {
                const isGovernor = await governorApi.ethers.votingDelay();
              } catch (err) {
                result = true;
              }
            }
          } else {
            if (
              !daoInfo.governor.votingDelay ||
              !daoInfo.governor.votingPeriod ||
              !daoInfo.governor.quorumNumerator ||
              isNaN(daoInfo.governor.votingDelay) ||
              isNaN(daoInfo.governor.votingPeriod) ||
              isNaN(daoInfo.governor.quorumNumerator)
            )
              result = true;
          }
          break;
      }

      setIsContinueDisabled(result);
    };

    main();
  }, [activeStep, daoInfo]);

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
            disabled={isContinueDisabled}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateDAOModal;
