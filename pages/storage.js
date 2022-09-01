import { useEffect, useContext, useState } from "react";
import { DataContext } from "../lib/DataProvider";
import { Button } from "@mui/material";

const SIMPLE_STORAGE_1 = "0x981f887e826CB96F57526d2D195C742Be1905B93";
const SIMPLE_STORAGE_2 = "0x4F69db6A8b474A0961DEfa93Faa81df13CC210b9";

const SimpleStoragePage = () => {
  const { getSimpleStorage, web3 } = useContext(DataContext);

  const [refresher, setRefresher] = useState(0);

  useEffect(() => {
    const main = async () => {
      const storageOne = getSimpleStorage(SIMPLE_STORAGE_1);
      const storageTwo = getSimpleStorage(SIMPLE_STORAGE_2);

      console.log("Storage 1 Value: ", await storageOne.ethers.value());
      console.log("Storage 1 Setter: ", await storageOne.ethers.setter());

      console.log("Storage 2 Value: ", await storageTwo.ethers.value());
      console.log("Storage 2 Setter: ", await storageTwo.ethers.setter());
    };

    if (web3) {
      main();
    }
  }, [web3, refresher]);

  return (
    <div>
      This pages shows the simple storage data. Open the console to see it
      <br />
      <br />
      Use This ABI: function setStorage(string value_)
      <br />
      <br />
      Storage 1 Address: {SIMPLE_STORAGE_1}
      <br />
      <br />
      Storage 2 Address: {SIMPLE_STORAGE_2}
      <br />
      <br />
      <Button onClick={() => setRefresher(refresher + 1)}>Refresh</Button>
    </div>
  );
};

export default SimpleStoragePage;
