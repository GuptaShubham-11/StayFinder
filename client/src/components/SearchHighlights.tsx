"use client";

import { LucideSun, LucideMountain, LucideBuilding2, LucideTreePine } from "lucide-react";
import clsx from "clsx";

const experiences = [
    { name: "Beach", icon: LucideSun },
    { name: "Mountain", icon: LucideMountain },
    { name: "City", icon: LucideBuilding2 },
    { name: "Countryside", icon: LucideTreePine },
];

export default function SearchHighlights() {
    return (
        <section className="bg-bg py-16 px-6 text-center">
            <h3 className="text-3xl font-bold text-txt mb-10">Stays Found From</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                {experiences.map(({ name, icon: Icon }) => (
                    <div
                        key={name}
                        className={clsx(
                            "group bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center transition duration-300 hover:-translate-y-1 hover:shadow-2xl border border-gray-100"
                        )}
                    >
                        <div className="bg-pri/10 text-pri p-3 rounded-full mb-4 group-hover:bg-pri group-hover:text-white transition duration-300">
                            <Icon className="w-6 h-6" />
                        </div>
                        <p className="text-sec font-medium group-hover:text-pri transition">{name}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
