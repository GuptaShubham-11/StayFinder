"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Newsletter() {
    const [email, setEmail] = useState("");


    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();

        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!isValid) {
            toast.error("Please enter a valid email address.");
            return;
        }

        toast.success("Subscribed successfully!");

        setEmail("");
    };

    return (
        <section className="bg-pri text-white py-12 text-center px-4">
            <h3 className="text-2xl font-semibold mb-4">Get deals in your inbox</h3>

            <form
                onSubmit={handleSubscribe}
                className="flex flex-col md:flex-row gap-4 justify-center max-w-lg mx-auto"
            >
                <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white text-txt"
                />
                <Button
                    type="submit"
                    className="bg-acc text-white hover:bg-orange-500"
                >
                    Subscribe
                </Button>
            </form>
        </section>
    );
}
