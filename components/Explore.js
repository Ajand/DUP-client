/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useEffect, useContext, useCallback } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Typography,
  Paper,
  Divider,
  Avatar,
  useTheme,
} from "@mui/material";
import { DataContext } from "../lib/DataProvider";
import { ERC725 } from "@erc725/erc725.js";
import LSP3UniversalProfileMetadata from "@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json";
import { convertIPFS } from "../lib/utils";

const imageAddress =
  "https://www.tally.xyz/_next/image?url=https%3A%2F%2Fstatic.withtally.com%2Fd9e8442f-5cb7-4357-9567-3cdd7ae5930e_400x400.jpg&w=256&q=75";

const DAORow = ({ dao, id }) => {
  const { erc725Config, provider } = useContext(DataContext);
  const [daoInfo, setDaoInfo] = useState(null);

  const theme = useTheme();

  const router = useRouter();

  useEffect(() => {
    const main = async () => {
      try {
        const erc725 = new ERC725(
          LSP3UniversalProfileMetadata,
          dao[0].up,
          provider,
          erc725Config
        );
        setDaoInfo(await erc725.fetchData("LSP3Profile"));
      } catch (err) {
        console.log(err);
      }
    };

    if (provider) {
      main();
    }
  }, [provider]);

  if (!daoInfo) return <div></div>;

  return (
    <div
      css={css`
        padding: 1em;
        transition: 200ms;
        display: flex;
        margin-bottom: 1em;
        cursor: pointer;
        justify-content: space-between;
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        &:hover {
          background: #042739;
        }
      `}
      onClick={() => router.push(`/dao/${id}`)}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
        `}
      >
        {daoInfo ? (
          <>
            <Avatar
              src={convertIPFS(daoInfo.value.LSP3Profile.profileImage[0].url)}
              sx={{ width: 50, height: 50 }}
            />
            <Typography
              css={css`
                margin-left: 1em;
              `}
              variant="h6"
            >
              {daoInfo.value.LSP3Profile.name}
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="subtitle2">Loading DAO Info</Typography>
          </>
        )}
      </div>
      <div
        css={css`
          display: flex;
        `}
      >
        <div
          css={css`
            text-align: center;
            margin-left: 1em;
          `}
        >
          <Typography variant="body2">Proposals</Typography>
          <Typography variant="body1">{String(dao.proposalCount)}</Typography>
        </div>
      </div>
    </div>
  );
};

const Explore = () => {
  const { getDupFactory, provider, upAddress } = useContext(DataContext);
  const [daos, setDaos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const main = async () => {
      const dupFactory = getDupFactory();
      if (dupFactory) {
        setDaos(await dupFactory.ethers.getDaosInfo());
        setLoading(false);
      }
    };

    main();
  }, [getDupFactory, provider, upAddress]);

  return (
    <Container
      css={css`
        padding-top: 4em;
        padding-bottom: 4em;
      `}
    >
      <Paper
        css={css`
          padding: 2em;
        `}
      >
        <Typography variant="h4">
          {loading ? "Loading DAOs" : "Explore DAOs"}
        </Typography>
        {loading ? (
          <></>
        ) : (
          <>
            <Divider
              css={css`
                margin-top: 1em;
                margin-bottom: 1em;
              `}
            />
            {daos.map((dao, id) => (
              <DAORow key={id} dao={dao} id={id} />
            ))}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Explore;
