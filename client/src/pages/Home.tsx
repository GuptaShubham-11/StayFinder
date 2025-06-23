import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SearchHighlights from "@/components/SearchHighlights";
import TopDestinations from "@/components/TopDestinations";
import HowItWorks from "@/components/HowItWorks";
import HostCallToAction from "@/components/HostCallToAction";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/NewsLatter";
import Footer from "@/components/Footer";
import TestingCredentials from "@/components/TestingCredentials";

export default function LandingPage() {
    return (
        <main className="bg-bg text-txt">
            <Navbar />
            <HeroSection />
            <TestingCredentials />
            <SearchHighlights />
            <TopDestinations />
            <HowItWorks />
            <HostCallToAction />
            <Testimonials />
            <Newsletter />
            <Footer />
        </main>
    );
}
