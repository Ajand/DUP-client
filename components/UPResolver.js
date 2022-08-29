/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useEffect, useContext } from "react";
import { Avatar, Typography, IconButton, useTheme } from "@mui/material";
import { Close } from "@mui/icons-material";
import { DataContext } from "../lib/DataProvider";
import { ERC725 } from "@erc725/erc725.js";
import LSP3 from "@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json";
import { formatAddress, convertIPFS } from "../lib/utils";

const UPResolver = ({ address, onClose, label, fullAddress, noMargin }) => {
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [up, setUp] = useState(false);

  const { erc725Config, provider } = useContext(DataContext);

  useEffect(() => {
    const main = async () => {
      try {
        const erc725 = new ERC725(LSP3, address, provider, erc725Config);
        setUp((await erc725.fetchData("LSP3Profile")).value.LSP3Profile);
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
        ) : up ? (
          <>
            {" "}
            <div
              css={css`
                display: flex;
              `}
            >
              <div
                css={css`
                  border: 2px solid ${theme.palette.text.primary};
                  padding: 2px;
                  display: inline-block;
                  border-radius: 100px;
                `}
              >
                <Avatar
                  src={convertIPFS(
                    up.profileImage[up.profileImage.length - 1].url
                  )}
                />
              </div>
              <div
                css={css`
                  margin-left: ${noMargin ? "0px" : "0.5em"};
                `}
              >
                <Typography variant="body1">{up.name}</Typography>
                <Typography variant="body2">
                  {fullAddress ? address : formatAddress(address)}
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
              The address {formatAddress(address)} is not a universal profile.
            </Typography>
          </>
        )}

        {onClose && (
          <IconButton
            size="small"
            onClick={() => {
              onClose();
            }}
          >
            <Close />
          </IconButton>
        )}
      </div>
    </div>
  );
};

export default UPResolver;
