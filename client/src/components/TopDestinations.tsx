import img1 from "../../public/img1.jpg";
import img2 from "../../public/img2.jpg";
import img3 from "../../public/img3.jpg";

export default function TopDestinations() {
    const destinations = [
        {
            id: 1,
            title: "Bali Villa",
            image: img1,
        },
        {
            id: 2,
            title: "Swiss Alps Cabin",
            image: img2,
        },
        {
            id: 3,
            title: "Paris Apartment",
            image: img3,
        },
    ];

    return (
        <section id="destinations" className="py-20 bg-bg px-6">
            <h3 className="text-3xl font-bold text-txt text-center mb-12">
                Top Picks for You
            </h3>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {destinations.map((dest) => (
                    <div
                        key={dest.id}
                        className="relative rounded-xl overflow-hidden shadow hover:shadow-lg group transition-all duration-300"
                    >
                        <img
                            src={dest.image}
                            alt={dest.title}
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                        {/* Text overlay */}
                        <div className="absolute bottom-4 left-4 text-white">
                            <h4 className="text-xl font-semibold">{dest.title}</h4>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
