/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Header from "../../components/Header";
import DAOInfo from "../../components/DaoInfo";
import { useRouter } from "next/router";
import { useState, useEffect, useContext, useCallback } from "react";
import { DataContext } from "../../lib/DataProvider";
import { ERC725 } from "@erc725/erc725.js";
import LSP3UniversalProfileMetadata from "@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json";
import { Typography } from "@mui/material";
import ProposeModal from "../../components/ProposeModal";

const DAO = () => {
  const router = useRouter();
  const { id } = router.query;
  const { getDupFactory, erc725Config, provider } = useContext(DataContext);

  const [dao, setDao] = useState([]);
  const [daoInfo, setDaoInfo] = useState(null);

  const [loading, setLoading] = useState(true);

  const [proposeModal, setProposeModal] = useState(false);

  useEffect(() => {
    const main = async () => {
      const dupFactory = getDupFactory();
      if (dupFactory) {
        console.log(id);
        const d = await dupFactory.ethers.getDaoInfo(id);
        setDao(d);

        const erc725 = new ERC725(
          LSP3UniversalProfileMetadata,
          d[0].up,
          provider,
          erc725Config
        );
        setDaoInfo(await erc725.fetchData("LSP3Profile"));

        setLoading(false);
      }
    };

    if (getDupFactory && id) {
      main();
    }
  }, [getDupFactory, id]);

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
        <DAOInfo dao={dao} daoInfo={daoInfo} setProposalModalOpen={setProposeModal} />
      )}
      <ProposeModal open={proposeModal} setOpen={setProposeModal} dao={dao} />
    </div>
  );
};

export default DAO;
