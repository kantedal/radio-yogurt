import { Inter } from "@next/font/google";
import { NextPage } from "next";
import Image from "next/image";
import logo from "../assets/logo.svg";

const inter = Inter({ subsets: ["latin"] });

const Home: NextPage = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-radio-yogurt-light-tertiary">
      <Image src={logo} alt="Logo puss" className="w-full max-w-xs" />
      Radio Yogurt
    </main>
  );
};

export default Home;
