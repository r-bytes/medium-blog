import type { NextPage } from "next";
import Head from "next/head";
import { Hero, Header } from "../components/index"

const Home: NextPage = () => {
    return (
        <div className="max-w-7xl mx-auto">
            <Head>
                <title> My Blog </title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <Hero />
        </div>
    );
};

export default Home;
