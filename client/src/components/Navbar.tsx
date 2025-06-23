import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    return (
        <header className="bg-bg text-txt shadow-sm">
            <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
                <h1 className="text-2xl font-bold text-pri">StayFinder</h1>
                <nav className="space-x-6 hidden md:block">
                    <a href="#destinations" className="text-sec hover:text-pri">Explore</a>
                    <a href="#how" className="text-sec hover:text-pri">How it Works</a>
                    <a href="#host" className="text-sec hover:text-pri">Host</a>
                    <a href="#testimonials" className="text-sec hover:text-pri">Reviews</a>
                </nav>
                <Button variant="outline" onClick={() => navigate('/signin')} className="text-pri hover:bg-pri font-semibold hover:text-white border-pri">Sign In</Button>
            </div>
        </header>
    );
}
