'use client';

import { Button } from "@/components/ui/button"
import { Code, MessageSquare, Sparkles } from "lucide-react"
import { promptAtom } from "@/lib/stores/promptAtom";
import Chat from "@/components/chat/Chat"
import Header from "@/components/Header";

export default function Page() {
  const EXAMPLE_PROMPTS = [
    { text: 'Build a todo app in React using Tailwind' },
    { text: 'Build a simple blog using Astro' },
    { text: 'Create a cookie consent form using Material UI' },
    { text: 'Make a space invaders game' },
    { text: 'How do I center a div?' },
  ];

  const FEATURES = [
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: 'AI Assistant',
      description: 'Interact with our advanced AI assistant for help with any task.',
      path: '/chat'
    },
    {
      icon: <Code className="w-5 h-5" />,
      title: 'Code Generation',
      description: 'Generate clean, production-ready code for your projects.',
      path: '/chat'
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: 'Design Innovation',
      description: 'Create stunning designs with AI-powered tools and suggestions.',
      path: '/chat'
    }
  ];


  return (
    <div className="min-h-screen relative">
      <Header />
      <main className="mx-auto space-y-16 pb-8 relative z-10">
        <section className="relative pt-16">
          <div className="absolute opacity-50 blur-[200px] w-10/12 h-full top-0 left-0 right-0 mx-auto">
            <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-linear-to-r from-blue-600 to-purple-600 rounded-full" />
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-linear-to-r from-teal-400 to-blue-500 rounded-full" />
          </div>
          <div className="mx-auto text-center px-4 max-w-4xl flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-linear-to-r from-blue-500 to-teal-400">
              Design with AI, Build with Confidence
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 opacity-90">
              The next-generation platform for creating beautiful, functional interfaces powered by artificial intelligence.
            </p>
            <Chat />
          </div>
        </section>

        <section className="gap-8 w-fit my-10 max-w-5xl mx-auto">
          <div className="flex flex-col items-center [mask-image:linear-gradient(to_bottom,black_0%,transparent_180%)] hover:[mask-image:none]">
            {EXAMPLE_PROMPTS.map((examplePrompt, index) => {
              return (
                <Button
                  variant="ghost"
                  key={index}
                  onClick={() => promptAtom.set(examplePrompt.text)}
                  className="text-primary/50 hover:text-primary active:bg-transparent active:text-primary/50 px-0 hover:bg-transparent"
                >
                  {examplePrompt.text}
                </Button>
              );
            })}
          </div>
        </section>

        <section className="p-10 flex flex-col gap-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, index) => (
              <div
                key={index}
                className="p-5 flex flex-col gap-3 bg-muted/80 rounded-lg hover:shadow-md"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-500/10 text-blue-500">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium">{feature.title}</h3>
                <p className="text-sm opacity-80 grow">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA section */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-lg">
              <div className="relative p-8 md:p-12 bg-linear-to-r from-blue-600 to-purple-600 text-white">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='0.4'%3E%3Cpath d='M36 34c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4m0-16c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4m16 16c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4zm-16 0c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4zm0-16c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4zm16 0c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4zM14 4c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4m16 0c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4m16 0c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4zM14 16c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4m16 0c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4m16 0c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4zM0 16c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4zm0 16c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4zm16 0c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4zM16 34c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4zm16 0c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4zM0 34c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4zm0 16c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4zm16 0c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4zM36 50c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4zm16 0c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4zM14 50c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                  }}></div>
                </div>

                <div className="relative">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to revolutionize your design workflow?</h2>
                  <p className="text-white/90 mb-8 max-w-2xl">
                    Join thousands of designers and developers who are creating stunning interfaces in a fraction of the time.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      size="lg"
                      variant="default"
                    >
                      Get Started Now
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-5 relative z-10 backdrop-blur-xs">
        <div className="mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">&copy; 2025 <b>Spark AI </b>rights not reserved</p>
          <nav className="flex gap-4 mt-4 md:mt-0">
            <a href="https://x.com/akash2cs" target="_blank">
              <Button variant="ghost" className="text-muted-foreground">
                Contact
              </Button>
            </a>
            <a href="https://x.com/akash2cs" target="_blank">
              <Button variant="ghost" className="text-muted-foreground">
                Twitter
              </Button>
            </a>
            <a href="https://github.com/akashwarrior/spark-ai" target="_blank">
              <Button variant="ghost" className="text-muted-foreground">
                GitHub
              </Button>
            </a>
          </nav>
        </div>
      </footer>
    </div>
  )
}