import { GetStaticPaths, GetStaticProps } from "next"
import Image from "next/image";
import { Article, Form, Header } from "../../components"
import { sanityClient, urlFor } from "../../sanity"
import { Post } from "../../typings"

interface Props {
    post: Post;
}

const CurrentPost = ({ post }: Props ) => {
    return (
        <main>
            <Header />
            <Image className="w-full h-60 object-cover" src={urlFor(post.mainImage).url()!} alt={post.title} width={600} height={600} />
            <Article post={post} />
            <hr className="max-w-[45rem] my-5 mx-auto border border-gray-200" />
            <Form post={post} />
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