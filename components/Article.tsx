import Image from "next/image"
import { Post } from "../typings"
import PortableText from "react-portable-text"
import { urlFor } from "../sanity"

interface Props {
    post: Post;
}

const Article = ({post}: Props) => {
    return (
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
    )
}
export default Article