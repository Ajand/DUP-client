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

/*
{
    up: {
      name: "Unigrants DAO",
      description:
        "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available. It is also used to temporarily replace text in a process called greeking, which allows designers to consider the form of a webpage or publication, without the meaning of the text influencing the design",
      avatar: "https://www.unigrants.org/assets/logo.37911101.png",
      cover:
        "https://images.unsplash.com/photo-1528465424850-54d22f092f9d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      categories: [],
    },
    governanceToken: {
      name: "Sample Governance Token",
      symbol: "SGT",
      supply: "60",
      receiver: "0x5cd86aaC1D5450163fdD4DE3e51896Aa39D52CAe",
      deployed: "0x77bac3FD15566537CB05486EEeb44bFc437d41a2",
    },
    governor: {
      votingDelay: "20",
      votingPeriod: "50",
      quorumNumerator: "80",
      deployed: "0x9cfcDa91BA405606cAb1eDb936c9f27005Eed990",
    },
    timelock: {
      minimumDelay: "50",
      executor: "0x5cd86aaC1D5450163fdD4DE3e51896Aa39D52CAe",
      deployed: "",
    },
  }
*/

const CreateDAOModal = ({ open, setOpen }) => {
  const [activeStep, setActiveStep] = useState(0);

  const [isContinueDisabled, setIsContinueDisabled] = useState(false);
  //  uploading metadata => deploying contracts => createUp & keyManager => setup Governor
  //  0:  preview
  //  1:  uploading metadata
  //  2:  metadata uploaded & asking to deployecontracts
  //  3:  deploying contracts
  //  4:  contracts deployed & up pending
  //  5:  creating up & keymanager
  //  6:  up created & setup pending
  //  7:  setup governor
  //  8:  redirect to dao
  const [actionStep, setActionStep] = useState(0);

  const [daoInfo, setDAOInfo] = useState({
    up: {
      name: "",
      description: "",
      avatar: "",
      cover: "",
      categories: [],
    },
    governanceToken: {
      name: "",
      symbol: "",
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
    timelock: {
      minimumDelay: "",
      executor: "",
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
              !daoInfo.governanceToken.name ||
              !daoInfo.governanceToken.symbol ||
              !daoInfo.governanceToken.supply ||
              !daoInfo.governanceToken.receiver ||
              !ethers.utils.isAddress(daoInfo.governanceToken.receiver) ||
              isNaN(daoInfo.governanceToken.supply)
            )
              result = true;
          }
          break;
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
        case 3:
          if (daoInfo.governor.deployed) {
            if (!ethers.utils.isAddress(daoInfo.timelock.deployed)) {
              // TODO!! This must be a timelock
              result = true;
            }
          } else {
            if (
              !daoInfo.timelock.minimumDelay ||
              !daoInfo.timelock.executor ||
              isNaN(daoInfo.timelock.minimumDelay) ||
              !ethers.utils.isAddress(daoInfo.timelock.executor)
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
            actionStep={actionStep}
          />
        </DialogContent>
        <DialogActions
          css={css`
            padding: 1em;
          `}
        >
          <Button
            onClick={() => {
              if (actionStep > 0) {
                setActionStep(actionStep - 1);
              } else {
                setActiveStep(activeStep - 1);
              }
            }}
            size="small"
            disabled={!(activeStep > 0)}
          >
            Back
          </Button>
          <Button
            onClick={() => {
              if (activeStep < 4) {
                setActiveStep(activeStep + 1);
              } else {
                setActionStep(actionStep + 1);
              }
            }}
            size="small"
            variant="contained"
            disabled={isContinueDisabled}
          >
            {activeStep < 4 ? "Continue" : "Setup The DAO"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateDAOModal;
