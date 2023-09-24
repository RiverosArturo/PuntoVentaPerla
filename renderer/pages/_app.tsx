import "../styles/globals.css";
import type { AppProps } from "next/app";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { lightTheme } from "../themes/light-theme";
import { SnackbarProvider } from "notistack";
import { SWRConfig } from "swr";
import { CartProvider } from "../context/cart/CartProvider";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        // refreshInterval: 3000,
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
      }}
    >
      <CartProvider>
        <ThemeProvider theme={lightTheme}>
          <SnackbarProvider maxSnack={3}>
            <CssBaseline />
            <Component {...pageProps} />
          </SnackbarProvider>
        </ThemeProvider>
      </CartProvider>
    </SWRConfig>
  );
}
