import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collections as initialCollections } from "../data/collectionsData";

export default function Collections() {
    const navigate = useNavigate();
    const [collections, setCollections] = useState(() => {
        try {
            const saved = localStorage.getItem("collections");
            return saved ? JSON.parse(saved) : initialCollections;
        } catch {
            return initialCollections;
        }
    });

    const addCollection = () => {
        const name = prompt("Collection name");
        if (!name) return;
        const emoji = prompt("Pick an emoji (e.g. 👗 🎧 🏠)") || "📦";
        const newCollection = { id: Date.now(), title: name, emoji };
        const updated = [...collections, newCollection];
        setCollections(updated);
        localStorage.setItem("collections", JSON.stringify(updated));
    };

    const deleteCollection = (id) => {
        const updated = collections.filter((c) => c.id !== id);
        setCollections(updated);
        localStorage.setItem("collections", JSON.stringify(updated));
    };

    // Get product counts per collection
    const productCounts = (() => {
        try {
            const saved = localStorage.getItem("products");
            const products = saved ? JSON.parse(saved) : [];
            return products.reduce((acc, p) => {
                const key = p.collection || "Custom";
                acc[key] = (acc[key] || 0) + 1;
                return acc;
            }, {});
        } catch {
            return {};
        }
    })();

    return (
        <div className="min-h-screen bg-[#f7f5f0] p-4 pb-24">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1
                    className="text-3xl font-semibold"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    Collections
                </h1>
                <button
                    onClick={addCollection}
                    className="w-9 h-9 rounded-full text-white text-xl flex items-center justify-center shadow"
                    style={{ backgroundColor: "#c45c3a" }}
                >
                    +
                </button>
            </div>

            {/* Empty state */}
            {collections.length === 0 && (
                <div className="text-center mt-24">
                    <p className="text-4xl mb-3">📂</p>
                    <p className="text-base font-medium text-gray-600">No collections yet</p>
                    <p className="text-sm text-gray-400 mt-1">Tap + to create your first one</p>
                </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-2 gap-3">
                {collections.map((collection) => (
                    <div
                        key={collection.id}
                        onClick={() => navigate(`/?collection=${collection.title}`)}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow relative"
                    >
                        {/* Delete button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Delete "${collection.title}"?`)) {
                                    deleteCollection(collection.id);
                                }
                            }}
                            className="absolute top-3 right-3 text-gray-300 hover:text-red-400 text-lg leading-none"
                        >
                            ×
                        </button>

                        <div className="text-3xl mb-3">{collection.emoji}</div>
                        <p className="font-semibold text-sm text-gray-900">{collection.title}</p>
                        <p className="text-xs text-gray-400 mt-1">
                            {productCounts[collection.title] || 0} items
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}