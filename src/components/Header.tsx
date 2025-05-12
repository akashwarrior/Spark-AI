import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import ThemeToggle from "./theme/theme-toggle";


export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={cn(
            "sticky top-0 z-40 w-full flex justify-between items-center h-16 px-4",
            isScrolled ? "backdrop-blur-md border-b" : "bg-transparent"
        )}>
            <Link href="/" className="flex items-center gap-2 hover:text-primary">
                <Sparkles className="w-5 h-5" />
                <span className="font-bold text-xl">Spark AI</span>
            </Link>

            <div className="flex items-center gap-3">
                <ThemeToggle />
                <div className="hidden md:block">
                    <Button size="sm">
                        Try Now
                    </Button>
                </div>
            </div>
        </header>
    )
}
