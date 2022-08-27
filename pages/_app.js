import "../styles/globals.css";
import { DataProvider } from "../lib/DataProvider";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

const darkTheme = createTheme({
  typography: {
    fontFamily: "Inter",
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#666CFF",
    },

    background: {
      default: "#282a42",
      paper: "#30334e"
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 10
        }
      }
    }
  }
});

function MyApp({ Component, pageProps }) {
  return (
    <DataProvider>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </DataProvider>
  );
}

export default MyApp;
