import { GetStaticPaths, GetStaticProps } from "next"
import Image from "next/image";
import { Header } from "../../components"
import { sanityClient, urlFor } from "../../sanity"
import { Post } from "../../typings"
import PortableText from "react-portable-text"

interface Props {
    post: Post;
}

const CurrentPost = ({ post }: Props ) => {
    return (
        <main >
            <Header />
            
            <Image className="w-full h-60 object-cover" src={urlFor(post.mainImage).url()!} alt={post.title} width={600} height={600} />

            <article className="max-w-3xl mx-auto p-5">
                <h1 className="text-3xl mt-10 mb-3"> {post.title} </h1>
                <h2 className="text-md font-light text-gray-500 mb-2"> {post.description} </h2>
                <div className="flex items-center justify-start">
                    <Image className="rounded-full mr-2" src={urlFor(post.author.image).url()!} alt={post.title} width={40} height={40} />
                    <p className="font-extralight text-xs"> Blog post by <span className="font-bold text-green-600"> {post.author.name} </span> - Pushished at: {new Date(post._createdAt).toLocaleDateString()} - {new Date(post._createdAt).toLocaleTimeString()} </p>
                </div>
                <div className="mt-10">
                    <PortableText 
                        dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
                        projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
                        content={post.body}
                        serializers={
                            {
                                h1: (props: any) => (
                                    <h1 className="text-2xl font-bold my-5" {...props} />
                                ),
                                h2: (props: any) => (
                                    <h2 className="text-xl font-bold my-5" {...props} />
                                ),
                                li: ({ children }: any) => (
                                    <li className="ml-4 list-disc"> {children} </li>
                                ),
                                link: ({ href, children }: any) => (
                                    <a href={href} className="text-blue-500 hover:underline">
                                        {children}
                                    </a>
                                ),
                                image: ({ children }: any) => (
                                    <Image src={urlFor(post.mainImage).url()} height={600} width={600} alt="#" className="mt-5 w-full rounded-lg object-cover">
                                        {children}
                                    </Image>
                                )
                            }
                        }
                        className=""
                    />
                </div>
            </article>

            <hr className="max-w-2xl my-5 mx-auto border border-gray-200" />

            <form action="" className="flex flex-col p-5 my-10 max-w-2xl mx-auto mb-10">
                <h3 className="text-sm text-green-500"> Enjoyed this article? </h3>
                <h2 className="text-3xl font-bold mb-8"> Leave a comment below </h2>
            
                <label className="block mb-5" htmlFor="name">
                    <span className="text-gray-700"> Name </span>
                    <input className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-green-500" id="name" type="text" placeholder="Alice Wonderland" />
                </label>

                <label className="block mb-5" htmlFor="email">
                    <span className="text-gray-700"> Email </span>
                    <input className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-green-500" id="email" type="text" placeholder="a@wonderland.com" />
                </label>

                <label className="block mb-5" htmlFor="comment">
                    <span className="text-gray-700"> Comment </span>
                    <textarea className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-green-500" id="comment" rows={10} />
                </label>

            </form>

        </main>
    )
}
export default CurrentPost

export const getStaticPaths: GetStaticPaths = async () => {
    const query = `
        *[_type == "post"] {
            _id,
            slug {
            current
          }
        }
    `;
    const posts = await sanityClient.fetch(query)
    
    const paths = posts.map((post: Post) => ({
        params: {
            slug: post.slug.current
        }
    }))

    return {
        paths,
        fallback: "blocking"
    }
}


export const getStaticProps: GetStaticProps = async ({ params }) => {
    const query = `
        *[_type == "post" && slug.current == $slug][0] {
            _id,
            _createdAt,
            title,
            author -> {
            name,
            image
            },
            "comments": *[
            _type == "comment" &&
            post._ref == ^._id &&
            approved == true],
            description,
            mainImage,
            slug,
            body
        }
    `;
    const post = await sanityClient.fetch(query, {
        slug: params?.slug
    })

    if(!post) {
        return {
            notFound: true
        }
    }

    return {
        props: {
            post,
        },
        // also refresh cached post data
        revalidate: 3600,
    }
}