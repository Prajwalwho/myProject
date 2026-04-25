import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const navigate = useNavigate();

    const [name, setName] = useState(() => localStorage.getItem("pp_name") || "");
    const [editing, setEditing] = useState(false);
    const [tempName, setTempName] = useState(name);

    const products = (() => {
        try {
            return JSON.parse(localStorage.getItem("products") || "[]");
        } catch { return []; }
    })();

    const platforms = [...new Set(products.map(p => p.platform))];

    const platformCounts = products.reduce((acc, p) => {
        acc[p.platform] = (acc[p.platform] || 0) + 1;
        return acc;
    }, {});

    const handleSaveName = () => {
        setName(tempName);
        localStorage.setItem("pp_name", tempName);
        setEditing(false);
    };

    const handleClearData = () => {
        if (confirm("This will delete all your saved products. Are you sure?")) {
            localStorage.removeItem("products");
            navigate("/");
        }
    };

    const initials = name
        ? name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
        : "RK";

    const platformColors = {
        Myntra: "#fce7f3",
        Amazon: "#fff7ed",
        Flipkart: "#eff6ff",
        Meesho: "#f5f3ff",
        Custom: "#f0fdf4",
    };

    const platformText = {
        Myntra: "#9d174d",
        Amazon: "#9a3412",
        Flipkart: "#1e40af",
        Meesho: "#5b21b6",
        Custom: "#166534",
    };

    return (
        <div className="min-h-screen bg-[#f7f5f0] pb-24">

            {/* Header */}
            <div style={{ backgroundColor: "#c45c3a", padding: "48px 24px 64px" }}>
                <div className="flex flex-col items-center">
                    <div
                        className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-semibold text-white mb-3"
                        style={{ backgroundColor: "rgba(255,255,255,0.25)" }}
                    >
                        {initials}
                    </div>

                    {editing ? (
                        <div className="flex items-center gap-2 mt-1">
                            <input
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                placeholder="Your name"
                                className="bg-white/20 text-white placeholder-white/60 rounded-lg px-3 py-1.5 text-sm outline-none text-center"
                                autoFocus
                            />
                            <button
                                onClick={handleSaveName}
                                className="text-white text-sm bg-white/20 px-3 py-1.5 rounded-lg"
                            >
                                Save
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-white text-lg font-medium">
                                {name || "Your Name"}
                            </p>
                            <button
                                onClick={() => { setTempName(name); setEditing(true); }}
                                className="text-white/60 text-xs"
                            >
                                ✏️
                            </button>
                        </div>
                    )}

                    <p className="text-white/60 text-sm mt-1">{products.length} saved items</p>
                </div>
            </div>

            {/* Stats cards */}
            <div className="px-4 -mt-8">
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
                        <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                        <p className="text-xs text-gray-400 mt-1">Total saved</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
                        <p className="text-2xl font-bold text-gray-900">{platforms.length}</p>
                        <p className="text-xs text-gray-400 mt-1">Platforms</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
                        <p className="text-2xl font-bold text-gray-900">
                            {(() => {
                                try {
                                    return JSON.parse(localStorage.getItem("collections") || "[]").length;
                                } catch { return 0; }
                            })()}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Collections</p>
                    </div>
                </div>
            </div>

            {/* Platform breakdown */}
            {products.length > 0 && (
                <div className="px-4 mt-6">
                    <h2
                        className="text-lg font-semibold mb-3"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        By platform
                    </h2>
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                        {Object.entries(platformCounts).map(([platform, count], i, arr) => (
                            <div
                                key={platform}
                                className={`flex items-center justify-between px-4 py-3 ${i < arr.length - 1 ? "border-b border-gray-100" : ""}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="px-2 py-0.5 rounded-full text-xs font-semibold"
                                        style={{
                                            backgroundColor: platformColors[platform] || "#f0fdf4",
                                            color: platformText[platform] || "#166534"
                                        }}
                                    >
                                        {platform}
                                    </div>
                                </div>
                                <span className="text-sm font-medium text-gray-600">{count} items</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* App info */}
            <div className="px-4 mt-6">
                <h2
                    className="text-lg font-semibold mb-3"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    About
                </h2>
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <span className="text-sm text-gray-600">App</span>
                        <span className="text-sm font-medium">pickpocket v1.0</span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Platforms supported</span>
                        <span className="text-sm font-medium">5</span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-sm text-gray-600">Storage</span>
                        <span className="text-sm font-medium">Local device</span>
                    </div>
                </div>
            </div>

            {/* Danger zone */}
            <div className="px-4 mt-6">
                <button
                    onClick={handleClearData}
                    className="w-full py-3 rounded-2xl text-red-500 border border-red-200 bg-white text-sm font-medium"
                >
                    Clear all saved products
                </button>
            </div>

        </div>
    );
}