import "../styles/globals.css";
import { DataProvider } from "../lib/DataProvider";

function MyApp({ Component, pageProps }) {
  return (
    <DataProvider>
      <Component {...pageProps} />
    </DataProvider>
  );
}

export default MyApp;
