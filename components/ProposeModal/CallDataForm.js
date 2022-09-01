/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useEffect, useContext, useCallback } from "react";
import { ethers } from "ethers";
import { TextField, useTheme } from "@mui/material";

const CallDataForm = ({
  value,
  setActionValue,
  activeAction,
  abiInfo,
  setAbiValue,
}) => {
  const abi = abiInfo.abi;
  const setAbi = (v) => setAbiValue("abi", v);
  const inputs = abiInfo.inputs;
  const setInputs = (v) => setAbiValue("inputs", v);
  const params = abiInfo.params;
  const setParams = (v) => setAbiValue("params", v);

  const theme = useTheme();

  const changeParam = (key, value) => {
    const p = [...params];
    p[key] = value;
    setParams(p);
  };

  useEffect(() => {
    try {
      let iface = new ethers.utils.Interface([abi]);
      setInputs(Object.values(iface.functions)[0].inputs);
    } catch (err) {
      //console.log(err);
    }
  }, [abi]);

  useEffect(() => {
    try {
      let iface = new ethers.utils.Interface([abi]);
      const func = Object.values(iface.functions)[0];
      const encodedData = iface.encodeFunctionData(func.name, params);
      setActionValue(activeAction, "callData", encodedData);
    } catch (err) {
      setActionValue(activeAction, "callData", "");
    }
  }, [abi, params]);

  const isError = (type, value) => {
    if (!value) return;
    if (type.includes("uint")) {
      if (isNaN(value)) {
        return true;
      }
      return false;
    }
    if (type.includes("address")) {
      if (ethers.utils.isAddress(value)) {
        return false;
      }
      return true;
    }
    return false;
  };

  return (
    <div>
      <TextField
        label="Call Abi"
        variant="outlined"
        fullWidth
        size="small"
        css={css`
          margin-bottom: 0.75em;
        `}
        value={abi}
        onChange={(e) => setAbi(e.target.value)}
      />
      <div
        css={css`
          padding-left: 1em;
          border-left: 1px solid ${theme.palette.primary.main};
        `}
      >
        {inputs.map((input, i) => {
          return (
            <TextField
              label={input.name}
              variant="outlined"
              fullWidth
              size="small"
              css={css`
                margin-bottom: 0.75em;
              `}
              key={inpu.name}
              helperText={input.type}
              error={isError(input.type, params[i])}
              value={params[i]}
              onChange={(e) => changeParam(i, e.target.value)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CallDataForm;
