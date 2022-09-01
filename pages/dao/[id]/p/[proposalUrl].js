/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Header from "../../../../components/Header";
import CastVoteModal from "../../../../components/CastVoteModal";
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
  const [Dao, setDao] = useState(null);

  const [castVoteModalOpen, setCVMO] = useState(false);

  const { proposalUrl, id } = router.query;
  const {
    getDupFactory,
    getGovernor,
    getUPAddress,
    upAddress,
    getTimelockController,
  } = useContext(DataContext);
  const [proposalState, setProposalState] = useState();
  const [proposalInfo, setProposalInfo] = useState([]);
  const [proposalId, setProposalId] = useState("");
  const [hasVoted, setHasVoted] = useState(false);

  const [loading, setLoading] = useState(true);
  const [refetcher, setRefetcher] = useState(0);

  useEffect(() => {
    const main = async () => {
      getUPAddress();
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
          setProposalId(proposalId);
          const proposalState = await governor.ethers.state(proposalId);
          setProposalState(proposalState);
          if (upAddress) {
            setHasVoted(await governor.ethers.hasVoted(proposalId, upAddress));
          }
          setLoading(false);
        } catch (err) {
          setLoading(false);
        }
      }
    };

    if (getDupFactory && id) {
      main();
    }
  }, [getDupFactory, id, upAddress, castVoteModalOpen, refetcher]);

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
          Loading Proposal data ...
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
              <Typography variant="body2">
                Proposal ID: {String(proposalId)}
              </Typography>
              <Typography variant="h6">
                {parseProposalState(String(proposalState))}
              </Typography>
            </div>
            <div>
              {Number(String(proposalState)) === 1 && (
                <Button
                  disabled={hasVoted}
                  variant="contained"
                  color="primary"
                  onClick={() => setCVMO(true)}
                >
                  Vote
                </Button>
              )}
              {Number(String(proposalState)) === 4 && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={async () => {
                    if (Dao && upAddress) {
                      const timelockController = getTimelockController(
                        Dao[0].timelockController
                      );

                      const governor = getGovernor(Dao[0].governor);
                      const callDatas = proposalInfo.actions.map(
                        (action) => action.data
                      );

                      governor.web3.methods
                        .queue(
                          callDatas,
                          ethers.utils.keccak256(
                            ethers.utils.toUtf8Bytes(`ipfs://${proposalUrl}`)
                          )
                        )
                        .send({ from: upAddress })
                        .on("receipt", function (receipt) {
                          setRefetcher(refetcher + 1);
                        });
                    }
                  }}
                >
                  Queue
                </Button>
              )}

              {Number(String(proposalState)) === 5 && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={async () => {
                    if (Dao && upAddress) {
                      const timelockController = getTimelockController(
                        Dao[0].timelockController
                      );

                      const governor = getGovernor(Dao[0].governor);
                      const callDatas = proposalInfo.actions.map(
                        (action) => action.data
                      );

                      governor.web3.methods
                        .execute(
                          callDatas,
                          ethers.utils.keccak256(
                            ethers.utils.toUtf8Bytes(`ipfs://${proposalUrl}`)
                          )
                        )
                        .send({ from: upAddress })
                        .on("receipt", function (receipt) {
                          setRefetcher(refetcher + 1);
                        });

                      //governor.web3.methods
                      //  .queue(
                      //    callDatas,
                      //    ethers.utils.keccak256(
                      //      ethers.utils.toUtf8Bytes(`ipfs://${proposalUrl}`)
                      //    )
                      //  )
                      //  .send({ from: upAddress });
                    }
                  }}
                >
                  Execute
                </Button>
              )}
            </div>
          </div>
          <Grid
            css={css`
              margin-top: 50px;
              margin-left: 0px;
            `}
            container
            spacing={0}
          >
            <Grid item md={8}>
              <Paper
                css={css`
                  padding: 35px;
                  padding-top: 25px;
                `}
              >
                <Typography variant="h6">Proposal Description:</Typography>
                <ReactMarkdown>{proposalInfo.description}</ReactMarkdown>
              </Paper>{" "}
            </Grid>
            <Grid
              item
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
                  <div key={`${i}:${action.abi}`}>
                    <div
                      css={css`
                        padding-bottom: 1em;
                      `}
                    >
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
                        inputs:{" "}
                        {JSON.stringify(
                          action.abiInfo.inputs.map((inp) => inp.name)
                        )}
                      </Typography>
                      <Typography variant="body2">
                        params: {JSON.stringify(action.abiInfo.params)}
                      </Typography>
                      <Typography variant="body2">ABI: {action.abi}</Typography>
                    </div>
                    <Divider
                      css={css`
                        margin-bottom: 0.75em;
                      `}
                    />
                  </div>
                ))}
              </Paper>
            </Grid>
          </Grid>
        </div>
      )}
      {Dao && proposalId && (
        <CastVoteModal
          open={castVoteModalOpen}
          setOpen={setCVMO}
          dao={Dao}
          proposalId={proposalId}
        />
      )}
    </div>
  );
};

export default ProposalDetails;
