/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Container, Typography } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import { DataContext } from "../lib/DataProvider";
import ProposalRow from "./ProposalRow";

const ProposalTable = ({ dao }) => {
  const { getGovernor, getTimelockController } = useContext(DataContext);
  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    const main = async () => {
      try {
        const governor = getGovernor(dao[0].governor);
        console.log(governor);
        const proposals = await governor.ethers.getProposals();
        console.log(proposals)
        setProposals(proposals);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    if (dao) {
      main();
    }
  }, [dao]);

  return (
    <Container
      css={css`
        padding-top: 2em;
        padding-bottom: 2em;
      `}
    >
      {loading ? (
        <>
          <Typography variant="body1">Loading Proposals</Typography>
        </>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                <TableCell align="left">Proposal Name</TableCell>
                <TableCell align="center">Proposal ID</TableCell>
                  <TableCell align="right">Proposal Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {proposals.map((url) => (
                  <ProposalRow key={url} dao={dao} url={url} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Container>
  );
};

export default ProposalTable;

// Token: 0xd8F78EFBDc25b3dbf47F1f51682d9ec78157D316
// Token: 0x69751F87A6247E778d39e7e080a4fd1fa0877a35
// governor: 0x550e160D17b71B45e0bBA82D6BfC9031B54193A4
// up: 0xFD471836031dc5108809D173A067e8486B9047A3
// timelock controller: 0xed01309BDdBf8769481219eCeb39F88642ba83eB
// Token: 0xd8F78EFBDc25b3dbf47F1f51682d9ec78157D316
