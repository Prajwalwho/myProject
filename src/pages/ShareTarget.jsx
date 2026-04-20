import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ShareTarget() {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const url = params.get("url") || params.get("text") || "";

        // Store the shared URL temporarily
        if (url) {
            sessionStorage.setItem("sharedUrl", url);
        }

        // Redirect to home where modal will pick it up
        navigate("/");
    }, [navigate]);

    return (
        <div className="min-h-screen bg-[#f7f5f0] flex items-center justify-center">
            <p className="text-gray-500 text-sm">Saving to pickpocket...</p>
        </div>
    );
}