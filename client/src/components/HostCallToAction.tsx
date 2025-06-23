import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export default function HostCallToAction() {
    const navigate = useNavigate();
    return (
        <section id="host" className="bg-acc text-white py-16 px-6 text-center">
            <h3 className="text-3xl font-bold mb-4">Become a Host</h3>
            <p className="mb-6">Earn extra income and share your space with travelers around the world.</p>
            <Button onClick={() => navigate("/signup")} size={"lg"} className="bg-white text-acc font-semibold rounded-md cursor-pointer hover:bg-orange-100">
                List Your Place
            </Button>
        </section>
    );
}
