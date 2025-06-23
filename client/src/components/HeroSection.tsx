"use client";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
    const navigate = useNavigate();
    return (
        <section className="relative bg-pri text-white overflow-hidden">
            {/* Background blur or decorative element */}
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-acc opacity-30 rounded-full blur-3xl pointer-events-none z-0" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-white opacity-10 rounded-full blur-2xl pointer-events-none z-0" />

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-28 text-center space-y-6">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
                    Find your perfect stay <br className="hidden sm:inline" />
                    <span className="text-yellow-300">anywhere, anytime</span>
                </h1>
                <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
                    Explore handpicked stays tailored to your mood, destination, and budget —
                    all in one place.
                </p>
                <Button
                    onClick={() => navigate("/signup")}
                    className="bg-acc hover:bg-orange-500 text-white px-8 py-4 text-lg rounded-md shadow-lg transition duration-300"
                    size="lg"
                >
                    Start Exploring
                </Button>
            </div>
        </section>
    );
}
