"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export default function ThemeToggle() {
    const { setTheme, theme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
            {theme === "light" ? <Sun /> : <Moon />}
        </Button>
    )
}