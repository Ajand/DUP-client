/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Checkbox,
  Avatar,
  useTheme,
  CircularProgress,
  Divider,
} from "@mui/material";
import StatusButton from "../StatusButton";
import { ethers } from "ethers";

import DigitalAssetResolver from "../DigitalAssetResolver";
import GovernorResolver from "../GovernorResolver";
import TimelockResolver from "../TimelockResolver";

const Confirmation = ({ daoInfo, actionStep }) => {
  const [alreadyDeployed, setAlreadyDeployed] = useState(false);

  console.log(actionStep);

  console.log(actionStep);

  const theme = useTheme();

  const upStatus = () => {
    if (actionStep === 0) return "waiting";
    if (actionStep === 1) return "uploading";
    if (actionStep < 4) return "uploaded";
    if (actionStep === 4) return "pending";
    if (actionStep === 5) return "deploying";
    return "ready";
  };

  const governanceTokenStatus = () => {
    if (actionStep < 2) return "waiting";
    if (actionStep === 2) return "pending";
    if (actionStep === 3) return "deploying";
    return "ready";
  };

  const governorStatus = () => {
    if (actionStep < 2) return "waiting";
    if (actionStep === 2) return "pending";
    if (actionStep === 3) return "deploying";
    if (actionStep < 6) return "deployed";
    if (actionStep === 6) return "pending";
    if (actionStep === 7) return "setting-up";
    return "ready";
  };

  const timelockControllerStatus = () => {
    if (actionStep < 2) return "waiting";
    if (actionStep === 2) return "pending";
    if (actionStep === 3) return "deploying";
    if (actionStep < 6) return "deployed";
    if (actionStep === 6) return "pending";
    if (actionStep === 7) return "setting-up";
    return "ready";
  };

  return (
    <div
      css={css`
        margin-top: 0.5em;
      `}
    >
      <div
        css={css`
          position: relative;
        `}
      >
        <div
          css={css`
            height: 200px;
            overflow: hidden;
          `}
        >
          <img
            src={daoInfo.up.cover}
            css={css`
              width: 100%;
            `}
          />
        </div>

        <div
          css={css`
            background: #4f6070;
            border-radius: 100px;
            padding: 0.5em;
            display: inline-block;
            border: 2px solid ${theme.palette.secondary.main};
            position: absolute;
            bottom: -40px;
            left: calc(50% - 60px);
          `}
        >
          <Avatar sx={{ width: 80, height: 80 }} src={daoInfo.up.avatar} />
        </div>
      </div>
      <div
        css={css`
          margin-top: 40px;
        `}
      >
        <Typography variant="h6">{daoInfo.up.name}</Typography>
        <Typography
          variant="body2"
          css={css`
            margin-top: 0.5em;
          `}
        >
          {daoInfo.up.description}
        </Typography>
      </div>
      <div
        css={css`
          display: flex;
          justify-content: flex-end;
          margin-top: 0.5em;
          margin-bottom: 0.75em;
        `}
      >
        <StatusButton status={upStatus()} />
      </div>
      <Divider />
      <div
        css={css`
          margin-top: 0.5em;
        `}
      >
        <Typography variant="subtitle">Governance Token:</Typography>
        {daoInfo.governanceToken.deployed ? (
          <DigitalAssetResolver
            address={ethers.utils.getAddress(daoInfo.governanceToken.deployed)}
            label=""
            noMargin
            fullAddress
          />
        ) : (
          <>
            <div>
              <Typography variant="body2">
                {daoInfo.governanceToken.name} - $
                {daoInfo.governanceToken.symbol}
              </Typography>
            </div>
            <div css={css``}>
              <Typography variant="body2">
                supply: {daoInfo.governanceToken.supply}
              </Typography>
              <Typography variant="body2">
                receiver: ${daoInfo.governanceToken.receiver}
              </Typography>
            </div>
          </>
        )}
      </div>
      <div
        css={css`
          display: flex;
          justify-content: flex-end;
          margin-top: 0.5em;
          margin-bottom: 0.75em;
        `}
      >
        <StatusButton status={governanceTokenStatus()} />
      </div>
      <Divider />
      <div
        css={css`
          margin-top: 0.5em;
        `}
      >
        <Typography variant="subtitle">Governor:</Typography>
        {daoInfo.governor.deployed ? (
          <GovernorResolver
            address={ethers.utils.getAddress(daoInfo.governor.deployed)}
            label=""
            noMargin
            fullAddress
          />
        ) : (
          <>
            <div>
              <Typography variant="body2">
                {daoInfo.governanceToken.name} - $
                {daoInfo.governanceToken.symbol}
              </Typography>
            </div>
            <div css={css``}>
              <Typography variant="body2">
                supply: {daoInfo.governanceToken.supply}
              </Typography>
              <Typography variant="body2">
                receiver: ${daoInfo.governanceToken.receiver}
              </Typography>
            </div>
          </>
        )}
      </div>
      <div
        css={css`
          display: flex;
          justify-content: flex-end;
          margin-top: 0.5em;
          margin-bottom: 0.75em;
        `}
      >
        <StatusButton status={governorStatus()} />
      </div>
      <Divider />
      <div
        css={css`
          margin-top: 0.5em;
        `}
      >
        <Typography variant="subtitle">Timelock:</Typography>
        {daoInfo.timelock.deployed ? (
          <TimelockResolver
            address={ethers.utils.getAddress(daoInfo.timelock.deployed)}
            label=""
            noMargin
            fullAddress
          />
        ) : (
          <>
            <div css={css``}>
              <Typography variant="body2">
                Minimum Delay: {daoInfo.timelock.minimumDelay}
              </Typography>
              <Typography variant="body2">
                Executor: ${daoInfo.timelock.executor}
              </Typography>
            </div>
          </>
        )}
      </div>
      <div
        css={css`
          display: flex;
          justify-content: flex-end;
          margin-top: 0.5em;
          margin-bottom: 0.75em;
        `}
      >
        <StatusButton status={timelockControllerStatus()} />
      </div>
    </div>
  );
};

export default Confirmation;
