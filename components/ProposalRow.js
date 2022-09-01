/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { TableRow, TableCell } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import { DataContext } from "../lib/DataProvider";
import axios from "axios";
import { convertIPFS, parseProposalState } from "../lib/utils";
import { ethers } from "ethers";
import { useRouter } from "next/router";

const ProposalRow = ({ dao, url, id }) => {
  const { getGovernor, getTimelockController } = useContext(DataContext);
  const [loading, setLoading] = useState(true);
  const [proposalInfo, setProposalInfo] = useState([]);
  const [proposalState, setProposalState] = useState();
  const [proposalId, setProposalId] = useState("");

  const router = useRouter();

  useEffect(() => {
    const main = async () => {
      try {
        const governor = getGovernor(dao[0].governor);
        const propInfo = (await axios.get(convertIPFS(url))).data;
        setProposalInfo(propInfo);
        const callDatas = propInfo.actions.map((action) => action.data);
        const proposalId = await governor.ethers.hashProposal(
          callDatas,
          ethers.utils.keccak256(ethers.utils.toUtf8Bytes(url))
        );
        setProposalId(proposalId);
        const proposalState = await governor.ethers.state(proposalId);
        setProposalState(proposalState);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    if (dao) {
      main();
    }
  }, [dao]);
  if (loading)
    return (
      <TableRow
        key={url}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell align="left">Loading Proposal Data</TableCell>
      </TableRow>
    );
  return (
    <TableRow
      key={url}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      css={css`
        cursor: pointer;
        transition: 200ms;
        &:hover {
          background: #042739;
        }
      `}
      onClick={() => {
        console.log("here???");
        router.push(`${router.asPath}/p/${url.replace("ipfs://", "")}`);
      }}
    >
      <TableCell align="left">{proposalInfo.name}</TableCell>
      <TableCell align="center">{String(proposalId)}</TableCell>
      <TableCell align="right">
        {parseProposalState(String(proposalState))}
      </TableCell>
    </TableRow>
  );
};

export default ProposalRow;
