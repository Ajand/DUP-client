/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import {
  Container,
  Typography,
  Button,
  Avatar,
  Paper,
  Grid,
  Item,
  useTheme,
} from "@mui/material";
import { convertIPFS } from "../lib/utils";
import { useState, useEffect, useContext, useCallback } from "react";
import { DataContext } from "../lib/DataProvider";

import ContractParams from "./ContractParams";
import DAOAddresses from "./DAOAddresses";

const DAOInfo = ({
  dao,
  daoInfo,
  setProposalModalOpen,
  setDelegationModalOpen,
}) => {
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [timelockController, setTimelockController] = useState(false);
  const [governor, setGovernor] = useState(false);

  const { getGovernor, getTimelockController } = useContext(DataContext);

  useEffect(() => {
    const main = async () => {
      try {
        const timelock = getTimelockController(dao[0].timelockController);
        const minimumDelay = await timelock.ethers.getMinDelay();
        const governor = getGovernor(dao[0].governor);
        const votingDelay = await governor.ethers.votingDelay();
        const votingPeriod = await governor.ethers.votingPeriod();
        const quorumNumerator = await governor.ethers["quorumNumerator()"]();
        setGovernor({ votingDelay, votingPeriod, quorumNumerator });
        setTimelockController({ minimumDelay });
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    main();
  }, []);

  return (
    <Container
      css={css`
        padding-top: 5em;
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
            src={convertIPFS(daoInfo.value.LSP3Profile.backgroundImage[0].url)}
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
          <Avatar
            sx={{ width: 80, height: 80 }}
            src={convertIPFS(daoInfo.value.LSP3Profile.profileImage[0].url)}
          />
        </div>
      </div>
      <div
        css={css`
          margin-top: 60px;
          margin-bottom: 50px;
        `}
      >
        <Typography
          variant="h5"
          css={css`
            text-align: center;
            margin-bottom: 20px;
          `}
        >
          {daoInfo.value.LSP3Profile.name}
        </Typography>
        <Typography
          variant="body1"
          css={css`
            margin-top: 0.5em;
          `}
        >
          {daoInfo.value.LSP3Profile.description}
        </Typography>
      </div>

      <Paper
        css={css`
          padding: 1em;
        `}
      >
        <div
          css={css`
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: auto;
          `}
        >
          <div
            css={css`
              text-align: center;
            `}
          >
            <Typography variant="body1">
              Proposals: {String(dao.proposalCount)}
            </Typography>
          </div>
          <div>
            <Button
              variant="outlined"
              onClick={() => {
                setProposalModalOpen(true);
              }}
            >
              Create New Proposal
            </Button>
            <Button
              css={css`
                margin-left: 1em;
              `}
              variant="contained"
              onClick={() => {
                setDelegationModalOpen(true);
              }}
            >
              Delegate Vote
            </Button>
          </div>
        </div>
      </Paper>
      <div>
        <Grid container>
          <Grid item md={4}>
            <ContractParams
              loading={loading}
              timelockController={timelockController}
              governor={governor}
            />
          </Grid>
          <Grid item md={8}>
            <DAOAddresses dao={dao} />
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};

export default DAOInfo;
