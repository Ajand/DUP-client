/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Header from "../../../../components/Header";
import { Typography, Button, Paper, Grid, Divider } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../../lib/DataProvider";
import axios from "axios";
import {
  convertIPFS,
  parseProposalState,
  parseExecutionType,
  formatAddress,
} from "../../../../lib/utils";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";

const ProposalDetails = () => {
  const router = useRouter();
  const [Dao, setDao] = useState([]);

  const { proposalUrl, id } = router.query;
  const { getDupFactory, getGovernor } = useContext(DataContext);
  const [proposalState, setProposalState] = useState();
  const [proposalInfo, setProposalInfo] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const main = async () => {
      const dupFactory = getDupFactory();
      if (dupFactory) {
        try {
          const dao = await dupFactory.ethers.getDaoInfo(id);
          setDao(dao);
          const governor = getGovernor(dao[0].governor);
          const propInfo = (
            await axios.get(`https://ipfs.io/ipfs/${proposalUrl}`)
          ).data;

          setProposalInfo(propInfo);
          const callDatas = propInfo.actions.map((action) => action.data);
          const proposalId = await governor.ethers.hashProposal(
            callDatas,
            ethers.utils.keccak256(
              ethers.utils.toUtf8Bytes(`ipfs://${proposalUrl}`)
            )
          );
          const proposalState = await governor.ethers.state(proposalId);
          setProposalState(proposalState);
          setLoading(false);
        } catch (err) {
          setLoading(false);
        }
      }
    };

    if (getDupFactory && id) {
      main();
    }
  }, [getDupFactory, id]);

  console.log(proposalInfo);

  return (
    <div>
      <Header />
      {loading ? (
        <Typography
          variant="h6"
          css={css`
            padding: 4em;
          `}
        >
          Loading DAO data ...
        </Typography>
      ) : (
        <div
          css={css`
            padding: 4em;
          `}
        >
          <div
            css={css`
              display: flex;
              justify-content: space-between;
            `}
          >
            <div>
              <Typography variant="h5">{proposalInfo.name}</Typography>
              <Typography variant="h6">
                {parseProposalState(String(proposalState))}
              </Typography>
            </div>
            <div>
              <Button
                disabled={Number(String(proposalState)) !== 1}
                variant="contained"
                color="primary"
              >
                Vote
              </Button>
            </div>
          </div>
          <Grid
            css={css`
              margin-top: 50px;
              margin-left: 0px;
            `}
            container
            spacing={2}
          >
            <Grid md={8}>
              <Paper
                css={css`
                  padding: 35px;
                  padding-top: 25px;
                `}
              >
                <Typography variant="h6">Proposal Description:</Typography>
                <ReactMarkdown children={proposalInfo.description} />,
              </Paper>{" "}
            </Grid>
            <Grid
              md={4}
              css={css`
                padding-left: 10px;
              `}
            >
              <Paper
                css={css`
                  padding: 35px;
                  padding-top: 25px;
                `}
              >
                <Typography
                  variant="h6"
                  css={css`
                    margin-bottom: 1em;
                  `}
                >
                  Proposal Actions:
                </Typography>
                {proposalInfo.actions.map((action, i) => (
                  <>
                    <div key={i} css={css`padding-bottom: 1em`}>
                      <Typography variant="body2">ABI: {action.abi}</Typography>
                      <Typography variant="body2" css={css``}>
                        target: {formatAddress(action.target)}
                      </Typography>
                      <Typography variant="body2">
                        execution type:{" "}
                        {parseExecutionType(action.executionType)}
                      </Typography>
                      <Typography variant="body2">
                        value: {action.value}
                      </Typography>
                      <Typography variant="body2">
                        inputs: {JSON.stringify(action.abiInfo.inputs)}
                      </Typography>
                      <Typography variant="body2">
                        params: {JSON.stringify(action.abiInfo.params)}
                      </Typography>
                      <Typography variant="body2">ABI: {action.abi}</Typography>
                    </div>
                    <Divider />
                  </>
                ))}
              </Paper>
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
};

export default ProposalDetails;
