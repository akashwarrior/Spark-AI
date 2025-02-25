import { Button } from "@/components/ui/button"
import { Code, ImageIcon, Wand2 } from "lucide-react"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import Link from "next/link"
import Chat from "@/components/chat/Chat"

export default async function Page() {
  const EXAMPLE_PROMPTS = [
    { text: 'Build a todo app in React using Tailwind' },
    { text: 'Build a simple blog using Astro' },
    { text: 'Create a cookie consent form using Material UI' },
    { text: 'Make a space invaders game' },
    { text: 'How do I center a div?' },
  ];

  const FEATURES = [
    {
      icon: <Wand2 size={32} />,
      title: "AI-Powered Design",
      description: "Transform ideas into stunning web designs instantly",
    },
    {
      icon: <Code size={32} />,
      title: "Code Generation",
      description: "Get production-ready code for your projects",
    },
    {
      icon: <ImageIcon size={32} />,
      title: "Visual Development",
      description: "Build from screenshots and visual references",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="glow top-0 right-0 opacity-50" />
      <div className="glow bottom-0 left-0 opacity-30" />

      <header className="container mx-auto px-4 py-4 flex justify-between items-center relative z-10">
        <Link href="/">
          <h1 className="text-2xl font-bold">Spark AI</h1>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 relative z-10">
        <section className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            What do you want to build?
          </h2>
          <p className="text-xl mb-8 text-muted-foreground">
            Transform your ideas into code with AI-powered development
          </p>
          <Chat />
        </section>

        <section className="gap-8 w-fit mb-16 max-w-5xl mx-auto">
          <div className="flex flex-col items-center [mask-image:linear-gradient(to_bottom,black_0%,transparent_180%)] hover:[mask-image:none]">
            {EXAMPLE_PROMPTS.map((examplePrompt, index) => {
              return (
                <Button
                  variant="ghost"
                  key={index}
                  className="text-primary/50 hover:text-primary active:bg-transparent active:text-primary/50 hover:bg-transparent"
                >
                  {examplePrompt.text}
                </Button>
              );
            })}
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="feature-card p-6 rounded-lg text-center border border-border/50 bg-secondary/30 backdrop-blur-sm"
            >
              <div className="mx-auto w-fit mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-border/50 py-8 relative z-10 bg-background/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground">&copy; 2025 <b>Spark AI </b>rights not reserved. <br />(personal project not for commercial use)</p>
          <nav className="flex gap-4 mt-4 md:mt-0">
            <a href="https://x.com/akash2cs" target="_blank">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Contact
              </Button>
            </a>
            <a href="https://x.com/akash2cs" target="_blank">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Twitter
              </Button>
            </a>
            <a href="https://github.com/akashwarrior" target="_blank">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                GitHub
              </Button>
            </a>
          </nav>
        </div>
      </footer>
    </div>
  )
}