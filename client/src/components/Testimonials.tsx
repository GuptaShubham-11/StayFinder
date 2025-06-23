import { Quote } from "lucide-react";

export default function Testimonials() {
    const users = [
        {
            id: 1,
            name: "Alex Johnson",
            role: "Travel Enthusiast",
            quote:
                "Absolutely amazing experience! Booking was effortless and the place exceeded expectations.",
        },
        {
            id: 2,
            name: "Priya Mehta",
            role: "Solo Traveler",
            quote:
                "I felt so at home. The host was incredibly welcoming. Highly recommend StayFinder!",
        },
        {
            id: 3,
            name: "Carlos Mendez",
            role: "Digital Nomad",
            quote:
                "The platform is super intuitive and the listings are premium. Booked twice already!",
        },
    ];

    return (
        <section id="testimonials" className="bg-bg py-20 px-6 text-center">
            <h3 className="text-3xl font-bold text-txt mb-12">What Our Users Say</h3>

            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="bg-white shadow-md rounded-xl p-6 text-left relative"
                    >
                        <Quote className="absolute top-4 right-4 text-acc w-6 h-6 opacity-30" />
                        <p className="text-sec italic mb-6">"{user.quote}"</p>

                        <div className="flex items-center gap-4">
                            <div>
                                <p className="text-txt font-semibold">{user.name}</p>
                                <p className="text-sm text-sec">{user.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
