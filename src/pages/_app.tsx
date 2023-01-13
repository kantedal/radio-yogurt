import { type AppType } from "next/app";

import "../styles/globals.css";

import { Open_Sans } from "@next/font/google";
import clsx from "clsx";
import Head from "next/head";

const openSans = Open_Sans({ subsets: ["latin"] });

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <>
      <Head>
        <title>Radio Yogurt</title>
      </Head>
      <main className={clsx("bg-red-500", openSans.className)}>
        <Component {...pageProps} />
      </main>
    </>
  );
};

export default MyApp;
