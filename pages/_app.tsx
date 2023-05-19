import type { AppProps } from "next/app";
import "../styles/globals.css";
import { Analytics } from '@vercel/analytics/react';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}

//export for reference
export default MyApp;
