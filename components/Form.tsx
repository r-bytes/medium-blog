import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form"
import { Post } from "../typings"

interface Props {
    post: Post;
}

interface FormValues {
    _id: string;
    name: string;
    email: string;
    comment: string;
}

const Form = ({ post }: Props ) => {
    const { register, handleSubmit, formState: {errors} } = useForm<FormValues>()
    const [submitted, setSubmitted] = useState(false)

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        fetch("/api/createComment", {
            method: "POST",
            body: JSON.stringify(data),
        })
        .then((a) => {
            console.log(a)
            setSubmitted(true)
        })
        .catch((err) => {
            console.log(err)
            setSubmitted(false)
        })
    }

    return (
        submitted ? (
            <div className="flex flex-col p-10 my-10 bg-green-500 text-white max-w-2xl mx-auto">
                <h3 className="text-3xl font-bold"> Thank you for submitting your comment! </h3>
                <p> Once it has been approved, it will appear below </p>
            </div>
        ) : (
            <>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col p-5 my-10 max-w-[47rem] mx-auto mb-10"
                    >
                    <h3 className="text-sm text-green-500"> Enjoyed this article? </h3>
                    <h2 className="text-3xl font-bold mb-8"> Leave a comment below </h2>
                
                    <input
                        {...register("_id")}
                        type="hidden"
                        name="_id"
                        value={post._id}
                    />

                    <label className="block mb-5" htmlFor="name">
                        <span className="text-gray-700"> Name </span>
                        <input
                            {...register("name", {required: true})}
                            className="shadow border rounded py-2 px-3 form-input mt-1 block w-full outline-none ring-green-500 focus:ring"
                            id="name"
                            type="text"
                            placeholder="Alice Wonderland"
                            />
                    </label>

                    <label className="block mb-5" htmlFor="email">
                        <span className="text-gray-700"> Email </span>
                        <input
                            {...register("email", {
                                required: "Required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "invalid email address"
                                }}
                                )}
                            className="shadow border rounded py-2 px-3 form-input mt-1 block w-full outline-none ring-green-500 focus:ring"
                            id="email"
                            type="text"
                            placeholder="a@wonderland.com"
                            />
                    </label>

                    <label className="block mb-5" htmlFor="comment">
                        <span className="text-gray-700"> Comment </span>
                        <textarea
                            {...register("comment", {required: true})}
                            className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full outline-none ring-green-500 focus:ring"
                            id="comment"
                            rows={10}
                            />
                    </label>

                    {/* errors when field validation fails */}
                    <div className="flex flex-col p-5">
                        {errors.name && (
                            <span className="text-red-500"> - Name field is required </span>
                            )}
                        {errors.email && (
                            <span className="text-red-500"> - Email field is required </span>
                            )}
                        {errors.comment && (
                            <span className="text-red-500"> - Comment field is required </span>
                            )}
                    </div>
                    <input
                        type="submit"
                        className="shadow bg-green-400 hover:bg-green-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer"
                        />
                </form>

                {/* Comments */}
                <div className="flex flex-col p-10 my-10 max-w-[44rem] mx-auto shadow shadow-green-300">
                    <h3 className="text-3xl"> Comments </h3>
                    <hr className="pb-2" />
                    {post.comments?.map(comment => (
                        <div key={comment._id}>
                            <p>
                               <span className="text-green-500">{comment.name}: </span>
                               <span>{comment.comment}</span>
                            </p>
                        </div>
                    ))}
                </div>
            </>


        )
       
    )
}
export default Form