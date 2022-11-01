import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Hero, Header } from "../components/index"
import { sanityClient, urlFor } from "../sanity"
import { Post } from "../typings.d"

interface Props {
    posts: [Post]
}

const Home: NextPage<Props> = ({ posts }: Props) => {

    return (
        <div className="max-w-7xl mx-auto">
            <Head>
                <title> My Blog </title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <Hero />

            {/* Posts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6">
                {posts.map(post => (
                    <Link key={post._id} href={`/post/${post.slug.current}`}>
                        <div className="border rounded-lg group cursor-pointer overflow-hidden">
                            <Image
                                className="rounded-lg h-60 w-full object-cover group-hover:scale-105 transition-transform duration-75 ease-in-out"
                                src={urlFor(post.mainImage).url()!}
                                alt={post.title}
                                width={200}
                                height={200}
                            />
                            <div className="flex justify-between p-5 bg-white">
                                <div>
                                    <p className="text-lg font-bold"> {post.title} </p>
                                    <p className="text-xs"> {post.description} by {post.author.name} </p>
                                </div>
                                <Image
                                    className="rounded-full"
                                    src={urlFor(post.author.image).url()!}
                                    alt={post.title}
                                    width={48}
                                    height={48}
                                />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Home;

export const getServerSideProps = async () => {
    const query = `
        *[_type == "post"] {
            _id,
            title,
            author -> {
                name,
                image
            },
            description,
            mainImage,
            slug
        }
    `;
    const posts = await sanityClient.fetch(query)

    return {
        props: {
            posts,
        },
    }
}