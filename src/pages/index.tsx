import { Inter } from "@next/font/google";
import clsx from "clsx";
import { NextPage } from "next";
import Image from "next/image";
import logo from "../assets/logo.svg";

const inter = Inter({ subsets: ["latin"] });

const Home: NextPage = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-radio-yogurt-light-tertiary">
      <div className="w-full max-w-xl mx-auto flex flex-col justify-center items-center">
        <Image src={logo} alt="Logo puss" className="w-full max-w-[200px]" />
        <div className="w-full mt-6">
          {/* <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="radio"
          >
            Radio program
          </label> */}
          <textarea
            placeholder="Enter radio program..."
            className="block w-full rounded-md border border-radio-yogurt-secondary shadow-sm focus:border-radio-yogurt-primary focus:ring-red-500 sm:text-sm"
            rows={15}
          />
        </div>
        <button
          type="button"
          className={clsx(
            "inline-flex items-center justify-center rounded-md border border-transparent bg-radio-yogurt-primary px-6 py-3 text-base font-medium text-white mt-4",
            "shadow-sm hover:bg-radio-yogurt-light-primary/80 focus:outline-none focus:ring-2 focus:ring-radio-yogurt-primary focus:ring-offset-2",
            "w-full"
          )}
        >
          Generate radio program
        </button>
      </div>
    </main>
  );
};

export default Home;
