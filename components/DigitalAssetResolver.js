/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useEffect, useContext } from "react";
import { Avatar, Typography, IconButton, useTheme } from "@mui/material";
import { Close } from "@mui/icons-material";
import { DataContext } from "../lib/DataProvider";
import { ERC725 } from "@erc725/erc725.js";
import LSP4DigitalAsset from "@erc725/erc725.js/schemas/LSP4DigitalAsset.json";
import { formatAddress, convertIPFS } from "../lib/utils";

const DigitalAssetResolver = ({ address, onClose, label }) => {
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [asset, setAsset] = useState();

  const { erc725Config, provider } = useContext(DataContext);

  useEffect(() => {
    const main = async () => {
      try {
        const erc725 = new ERC725(
          [LSP4DigitalAsset[1], LSP4DigitalAsset[2]],
          address,
          provider,
          erc725Config
        );
        setAsset(await erc725.fetchData());
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    main();
  }, []);

  return (
    <div>
      <Typography variant="subtitle2">{label}</Typography>
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
        `}
      >
        {loading ? (
          <>
            <Typography variant="body1">
              Resolving {formatAddress(address)}
            </Typography>
          </>
        ) : asset && asset[0].value ? (
          <>
            {" "}
            <div
              css={css`
                display: flex;
              `}
            >
              <div
                css={css`
                  margin-left: 0.5em;
                `}
              >
                <Typography variant="body1">
                  {asset[0].value} - ${asset[1].value}
                </Typography>
                <Typography variant="body2">
                  {formatAddress(address)}
                </Typography>
              </div>
            </div>
          </>
        ) : (
          <>
            <Typography
              variant="body1"
              css={css`
                color: ${theme.palette.error.main};
              `}
            >
              The address {formatAddress(address)} is not an LSP4 Digital asset.
            </Typography>
          </>
        )}

        <IconButton
          size="small"
          onClick={() => {
            onClose();
          }}
        >
          <Close />
        </IconButton>
      </div>
    </div>
  );
};

export default DigitalAssetResolver;
