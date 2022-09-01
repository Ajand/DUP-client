/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useEffect, useContext, useCallback } from "react";
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
import { upload, uploadFile } from "../../lib/web3StorageHelpers";
import DAOCreationStepper from "./DAOCreationStepper";
import keccak256 from "keccak256";
import { useRouter } from "next/router";

const getImageWidthAndHeight = (imageFile) => {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();

    //Read the contents of Image File.
    reader.readAsDataURL(imageFile);
    reader.onload = function (e) {
      //Initiate the JavaScript Image object.
      var image = new Image();

      //Set the Base64 string return from FileReader as source.
      image.src = e.target.result;

      //Validate the File Height and Width.
      image.onload = function () {
        var height = this.height;
        var width = this.width;
        return resolve({ width, height });
      };
    };
  });
};

const fileToArrayBuffer = (blob) => {
  return new Promise((resolve, reject) => {
    var fileReader = new FileReader();
    fileReader.onload = function (event) {
      return resolve(event.target.result);
    };
    fileReader.readAsArrayBuffer(blob);
  });
};

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

/*
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

  const router = useRouter();

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
      executor: ethers.constants.AddressZero,
      deployed: "",
    },
  });
  const handleClose = () => {
    setOpen(false);
  };

  const {
    erc725Config,
    getToken,
    getGovernor,
    getDupFactory,
    getUPAddress,
    getLSPFactory,
  } = useContext(DataContext);

  useEffect(() => {
    const main = async () => {
      setIsContinueDisabled(true);
      let result = false;
      switch (activeStep) {
        case 0:
          if (!daoInfo.up.name) result = true;
          if (!daoInfo.up.avatar) result = true;
          if (!daoInfo.up.cover) result = true;
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
              daoInfo.governor.quorumNumerator > 100 ||
              daoInfo.governor.quorumNumerator < 0 ||
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

  const getProfileInfo = async () => {
    const coverSize = await getImageWidthAndHeight(daoInfo.up.cover);
    const coverArrayBuffer = await fileToArrayBuffer(daoInfo.up.cover);
    const coverHash = ethers.utils.keccak256(Buffer.from(coverArrayBuffer));

    const avatarSize = await getImageWidthAndHeight(daoInfo.up.avatar);
    const avatarArrayBuffer = await fileToArrayBuffer(daoInfo.up.avatar);
    const avatarHash = ethers.utils.keccak256(Buffer.from(avatarArrayBuffer));

    const cover = await uploadFile(daoInfo.up.cover);
    const avatar = await uploadFile(daoInfo.up.avatar);

    const profileInfo = {
      name: daoInfo.up.name,
      description: daoInfo.up.description,
      profileImage: [
        {
          width: avatarSize.width,
          height: avatarSize.height,
          hashFunction: "keccak256(bytes)",
          hash: avatarHash,
          url: `ipfs://${avatar}`,
        },
      ],
      backgroundImage: [
        {
          width: coverSize.width,
          height: coverSize.height,
          hashFunction: "keccak256(bytes)",
          hash: coverHash,
          url: `ipfs://${cover}`,
        },
      ],
    };

    const uploadedProfile = `ipfs://${await upload({
      LSP3Profile: profileInfo,
    })}`;

    return { profileInfo, uploadedProfile };
  };

  const deployContracts = useCallback(async () => {
    const dupFactory = getDupFactory();
    const upAddress = await getUPAddress();

    return new Promise((resolve, reject) => {
      const { name, symbol, receiver, supply } = daoInfo.governanceToken;
      let alreadyConfirmed = false;
      let resolveObj;

      let properMethod;

      const deployedGovernor = daoInfo.governor.deployed;
      const deployedTimelock = daoInfo.timelock.deployed;
      const deployedToken = daoInfo.governanceToken.deployed;

      if (deployedToken && deployedTimelock && deployedGovernor) {
        properMethod = () => alert("not supported yet");
      } else if (deployedToken && deployedTimelock) {
        properMethod = () => dupFactory.web3.methods.deployG();
      } else if (deployedToken && deployedGovernor) {
        properMethod = () => dupFactory.web3.methods.deployL();
      } else if (deployedGovernor && deployedTimelock) {
        properMethod = () =>
          dupFactory.web3.methods.deployT(name, symbol, receiver, supply);
      } else if (deployedToken) {
        properMethod = () => dupFactory.web3.methods.deployLG();
      } else if (deployedGovernor) {
        properMethod = () =>
          dupFactory.web3.methods.deployTL(name, symbol, receiver, supply);
      } else if (deployedTimelock) {
        properMethod = () =>
          dupFactory.web3.methods.deployTG(name, symbol, receiver, supply);
      } else {
        properMethod = () =>
          dupFactory.web3.methods.deployTLG(name, symbol, receiver, supply);
      }

      return properMethod()
        .send({ from: upAddress })
        .on("error", function (error) {
          return reject(error);
        })
        .on("transactionHash", function (transactionHash) {})
        .on("receipt", function (receipt) {
          setActionStep(3);
          /// Need to handle DAO ID and deployed addresses and resolve it;
        })
        .on("confirmation", function (confirmationNumber, receipt) {
          if (alreadyConfirmed) return;
          if (confirmationNumber > 0) {
            alreadyConfirmed = true;
            setActionStep(4);
            const factoryAddress = dupFactory.ethers.address;
            resolveObj = Object.values(receipt.events)
              .filter(
                (event) =>
                  event.address.toLowerCase() === factoryAddress.toLowerCase()
              )
              .reduce((pV, cV) => {
                let daoId;
                switch (cV.event) {
                  case "GovernorDeployed":
                    daoId = cV.returnValues.daoId;
                    const { governorAddress } = cV.returnValues;
                    return { ...pV, daoId, governorAddress };
                  case "TimelockControllerDeployed":
                    daoId = cV.returnValues.daoId;
                    const { timelockControllerAddress } = cV.returnValues;
                    return { ...pV, daoId, timelockControllerAddress };
                  case "TokenDeployed":
                    daoId = cV.returnValues.daoId;
                    const { tokenAddress } = cV.returnValues;
                    return { ...pV, daoId, tokenAddress };
                }
              }, {});
            return resolve(resolveObj);
          }
        });
    });
  }, [getDupFactory]);

  const deployUpAndKeymanager = async ({ controller, profileInfo }) => {
    const lspFactory = await getLSPFactory();
    console.log(profileInfo);
    const myContracts = await lspFactory.UniversalProfile.deploy({
      controllerAddresses: [ethers.utils.getAddress(controller)],
      lsp3Profile: profileInfo, //profileInfo,
    });

    return myContracts;
  };

  const setupContracts = useCallback(
    async ({
      daoId,
      keyManager,
      upAddress,
      name,
      votingDelay,
      votingPeriod,
      quorumNumerator,
      minDelay,
      executor,
      deployedToken,
      deployedGovernor,
      deployedTimelockController,
    }) => {
      const dupFactory = getDupFactory();
      const myUpAddress = await getUPAddress();

      if (getDupFactory) {
        return new Promise((resolve, reject) => {
          dupFactory.web3.methods
            .setup(
              daoId,
              keyManager,
              upAddress,
              name,
              votingDelay,
              votingPeriod,
              quorumNumerator,
              minDelay,
              executor,
              deployedToken,
              deployedGovernor,
              deployedTimelockController
            )
            .send({ from: myUpAddress })
            .on("error", function (error) {
              reject(error);
            })
            .on("transactionHash", function (transactionHash) {
              console.log("txHash: ", transactionHash);
              router.push(`/dao/${daoId}`);
            })
            .on("receipt", function (receipt) {
              console.log("receipt: ", receipt.contractAddress); // contains the new contract address
            })
            .on("confirmation", function (confirmationNumber, receipt) {
              console.log("confirmation: ", confirmationNumber);
            });
        });
      }
    },
    [getDupFactory]
  );

  const setupDao = async () => {
    setActionStep(1);
    const { profileInfo, uploadedProfile } = await getProfileInfo();
    console.log(profileInfo);
    setActionStep(2);
    const { daoId, timelockControllerAddress, tokenAddress, governorAddress } =
      await deployContracts();
    setActionStep(5);
    const upAndKeyManager = await deployUpAndKeymanager({
      controller: timelockControllerAddress
        ? timelockControllerAddress
        : daoInfo.timelock.deployed,
      profileInfo: uploadedProfile,
    });

    console.log(upAndKeyManager);
    setActionStep(6);

    const upAddress = upAndKeyManager.LSP0ERC725Account.address;
    const keyManager = upAndKeyManager.LSP6KeyManager.address;

    const { votingDelay, votingPeriod, quorumNumerator } = daoInfo.governor;

    const { minimumDelay: minDelay, executor } = daoInfo.timelock;
    await setupContracts({
      daoId,
      keyManager,
      upAddress,
      name: profileInfo.name,
      votingDelay: votingDelay ? votingDelay : 0,
      votingPeriod: votingPeriod ? votingPeriod : 0,
      quorumNumerator: quorumNumerator ? quorumNumerator : 0,
      minDelay: minDelay ? minDelay : 0,
      executor: executor ? executor : ethers.constants.AddressZero,
      deployedToken: daoInfo.governanceToken.deployed
        ? daoInfo.governanceToken.deployed
        : ethers.constants.AddressZero,
      deployedGovernor: daoInfo.governor.deployed
        ? daoInfo.governor.deployed
        : ethers.constants.AddressZero,
      deployedTimelockController: daoInfo.timelock.deployed
        ? daoInfo.timelock.deployed
        : ethers.constants.AddressZero,
    });
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
                setupDao();
              }
            }}
            size="small"
            variant="contained"
            disabled={isContinueDisabled || actionStep > 0}
          >
            {activeStep < 4 ? "Continue" : "Setup The DAO"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateDAOModal;
