export default function HowItWorks() {
    return (
        <section id="how" className="bg-white py-16 px-6 text-txt">
            <h3 className="text-3xl font-bold text-center mb-12">How it Works</h3>
            <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
                {["Browse stays", "Book securely", "Enjoy your trip"].map((step, i) => (
                    <div key={step} className="flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 bg-pri text-white flex items-center justify-center rounded-full text-xl font-bold">
                            {i + 1}
                        </div>
                        <h4 className="text-xl font-semibold">{step}</h4>
                        <p className="text-sec">Simple, fast, and secure booking with zero hassle.</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
