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

const Confirmation = ({ daoInfo }) => {
  const [alreadyDeployed, setAlreadyDeployed] = useState(false);

  const theme = useTheme();

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
        <StatusButton />
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
        <StatusButton />
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
        <StatusButton />
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
        <StatusButton />
      </div>
    </div>
  );
};

export default Confirmation;
