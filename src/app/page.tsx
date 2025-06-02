import Chat from "@/components/chat/Chat";

export default async function Home() {
    return (
        <main className="h-screen flex relative w-full flex-col items-center justify-center px-5">
            <img src="/images/bg.webp" alt="background" className="absolute top-0 left-0 w-full h-full object-cover select-none" />
            <div className="flex flex-col items-center justify-center gap-12 w-full h-fit">
                <h1 className="max-w-2xl text-center text-4xl font-medium sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r to-[#a8beff] via-[#40a2ff] from-primary">
                    Welcome to Spark AI Studio
                </h1>
                <Chat />
            </div>
        </main>
    )
}