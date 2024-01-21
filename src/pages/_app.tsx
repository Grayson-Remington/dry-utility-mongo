import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { Roboto } from "next/font/google";
import { ConfirmProvider } from "material-ui-confirm";
import { SessionProvider } from "next-auth/react";
const roboto = Roboto({ weight: "400", subsets: ["latin"] });
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${roboto.style.fontFamily};
        }
      `}</style>
      <ConfirmProvider>
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </ConfirmProvider>
    </>
  );
}
