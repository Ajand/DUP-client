/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useEffect, useContext } from "react";
import { Avatar, Typography, IconButton, useTheme } from "@mui/material";
import { Close } from "@mui/icons-material";
import { DataContext } from "../lib/DataProvider";
import { formatAddress, convertIPFS } from "../lib/utils";

const GovernorResolver = ({ address, onClose, label }) => {
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [governor, setGovernor] = useState(false);

  const { getGovernor } = useContext(DataContext);

  useEffect(() => {
    const main = async () => {
      try {
        const governor = getGovernor(address);
        const votingDelay = await governor.ethers.votingDelay();
        const votingPeriod = await governor.ethers.votingPeriod();
        const quorumNumerator = await governor.ethers["quorumNumerator()"]();
        setGovernor({ votingDelay, votingPeriod, quorumNumerator });
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
        ) : governor ? (
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
                <div>
                  <Typography
                    css={css`
                      margin-bottom: 0.25em;
                    `}
                    variant="body1"
                  >
                    Voting Delay: {String(governor.votingDelay)}
                  </Typography>
                  <Typography
                    css={css`
                      margin-bottom: 0.25em;
                    `}
                    variant="body1"
                  >
                    Voting Period: {String(governor.votingPeriod)}
                  </Typography>
                  <Typography
                    css={css`
                      margin-bottom: 0.25em;
                    `}
                    variant="body1"
                  >
                    Quorum Numerator: {String(governor.quorumNumerator)}
                  </Typography>
                </div>
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
              The address {formatAddress(address)} is not a governor contract.
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

export default GovernorResolver;
