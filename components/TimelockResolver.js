/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useEffect, useContext } from "react";
import { Avatar, Typography, IconButton, useTheme } from "@mui/material";
import { Close } from "@mui/icons-material";
import { DataContext } from "../lib/DataProvider";
import { formatAddress, convertIPFS } from "../lib/utils";
import moment from "moment";
import { formatDate } from "../lib/utils";

const TimelockResolver = ({ address, onClose, label }) => {
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [timelockController, setTimelockController] = useState(false);

  const { getTimelockController } = useContext(DataContext);

  useEffect(() => {
    const main = async () => {
      try {
        const timelock = getTimelockController(address);
        const minimumDelay = await timelock.ethers.getMinDelay();
        setTimelockController({ minimumDelay });
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
        ) : timelockController && timelockController.minimumDelay ? (
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
                    Minimum Delay:{" "}
                    {formatDate(String(timelockController.minimumDelay))}
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
              The address {formatAddress(address)} is not a timelock contract.
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

export default TimelockResolver;
