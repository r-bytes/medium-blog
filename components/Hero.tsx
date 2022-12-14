const Hero = () => {
    return (
        <div className="flex justify-between items-center bg-green-300 py-10 lg:py-0 rounded-lg max-w-[77rem] mx-auto">
            <div className="px-10 space-y-5">
                <h1 className="text-6xl max-w-xl font-serif"> The ultimate <span className="underline decoration-black decoration-4"> cyber space</span> to write, read and connect </h1>
                <h2> Its easy and free to post your thinking on any topic and connect with millions of readers </h2>
            </div>

            <div className="px-10 h-full text-[128px] font-serif font-bold hidden md:inline-flex lg:text-[400px]"> R </div>
        </div>
    )
}

export default Hero