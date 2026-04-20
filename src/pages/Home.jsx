import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import PlatformTabs from "../components/PlatformTabs";
import CollectionCard from "../components/CollectionCard";
import AddProductModal from "../components/AddProductModal";
import Header from "../components/Header";
import { collections } from "../data/collectionsData";
import { products as initialProducts } from "../data/dummyData";

export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ✅ Load from localStorage on first render only
    const [productList, setProductList] = useState(() => {
        try {
            const saved = localStorage.getItem("products");
            return saved ? JSON.parse(saved) : initialProducts;
        } catch {
            return initialProducts;
        }
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPlatform, setSelectedPlatform] = useState("All");
    const [selectedCollection, setSelectedCollection] = useState("All");
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [collectionsState, setCollectionsState] = useState(collections);
    const [sortType, setSortType] = useState("");

    // ✅ Save to localStorage whenever productList changes
    useEffect(() => {
        localStorage.setItem("products", JSON.stringify(productList));
    }, [productList]);

    // Add after your other useEffects
    useEffect(() => {
        const sharedUrl = sessionStorage.getItem("sharedUrl");
        if (sharedUrl) {
            sessionStorage.removeItem("sharedUrl");
            setIsModalOpen(true);
        }
    }, []);

    // 🔍 Filter
    const filteredProducts = productList.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPlatform =
            selectedPlatform === "All" || product.platform === selectedPlatform;
        const matchesCollection =
            selectedCollection === "All" || product.collection === selectedCollection;
        return matchesSearch && matchesPlatform && matchesCollection;
    });

    // 🔥 Sort
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortType === "low") return a.price - b.price;
        if (sortType === "high") return b.price - a.price;
        return 0;
    });

    // 📊 Collection counts
    const collectionCounts = productList.reduce((acc, product) => {
        const key = product.collection || "Custom";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-[#f7f5f0] p-4 pb-24">

            <Header itemCount={productList.length} />

            <input
                type="text"
                placeholder="Search your wishlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 bg-white mb-4 text-sm outline-none focus:ring-2 focus:ring-orange-200"
            />

            <PlatformTabs
                selectedPlatform={selectedPlatform}
                setSelectedPlatform={setSelectedPlatform}
            />

            {/* Collections */}
            <div className="mt-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                    <h2
                        className="text-xl font-semibold"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Collections
                    </h2>
                    <button
                        onClick={() => {
                            const name = prompt("Enter collection name");
                            if (!name) return;
                            setCollectionsState([
                                ...collectionsState,
                                { id: Date.now(), title: name, count: 0, emoji: "📦" },
                            ]);
                        }}
                        className="text-sm px-3 py-1 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                    >
                        + New
                    </button>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2">
                    <button
                        onClick={() => setSelectedCollection("All")}
                        className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap border transition ${selectedCollection === "All"
                            ? "bg-black text-white border-black"
                            : "bg-white text-gray-600 border-gray-200"
                            }`}
                    >
                        All Items
                    </button>

                    {collectionsState.map((collection) => (
                        <div
                            key={collection.id}
                            onClick={() => setSelectedCollection(collection.title)}
                            className="cursor-pointer"
                        >
                            <CollectionCard
                                title={collection.title}
                                count={collectionCounts[collection.title] || 0}
                                emoji={collection.emoji}
                                isActive={selectedCollection === collection.title}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Control bar */}
            <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-400">{sortedProducts.length} items</p>
                <div className="flex gap-2">
                    <select
                        value={sortType}
                        onChange={(e) => setSortType(e.target.value)}
                        className="border border-gray-200 px-3 py-1.5 rounded-lg text-sm bg-white text-gray-600 outline-none"
                    >
                        <option value="">Sort</option>
                        <option value="low">Price: Low → High</option>
                        <option value="high">Price: High → Low</option>
                    </select>
                    <button
                        onClick={() => {
                            setIsSelectMode(!isSelectMode);
                            setSelectedItems([]);
                        }}
                        className="bg-black text-white px-4 py-1.5 rounded-full text-sm shadow"
                    >
                        {isSelectMode ? "Cancel" : "Select"}
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-9 h-9 rounded-full text-white text-xl shadow flex items-center justify-center"
                        style={{ backgroundColor: "#c45c3a" }}
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Products */}
            <div className="mt-2">
                {sortedProducts.length === 0 ? (
                    <div className="text-center mt-16 text-gray-400">
                        {selectedCollection !== "All" ? (
                            <>
                                <p className="text-4xl mb-3">📂</p>
                                <p className="text-base font-medium text-gray-600">
                                    No items in "{selectedCollection}"
                                </p>
                                <p className="text-sm mt-1">Add products or move items here</p>
                            </>
                        ) : (
                            <>
                                <p className="text-4xl mb-3">😕</p>
                                <p className="text-base font-medium text-gray-600">No items found</p>
                                <p className="text-sm mt-1">Try different search or filters</p>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {sortedProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                isSelectMode={isSelectMode}
                                selectedItems={selectedItems}
                                setSelectedItems={setSelectedItems}
                            />
                        ))}
                    </div>
                )}
            </div>

            <AddProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={(newProduct) => setProductList([...productList, newProduct])}
                collections={collectionsState}
            />

            {/* Bulk action bar */}
            {isSelectMode && selectedItems.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-between items-center shadow-lg z-50">
                    <span className="font-medium text-sm">{selectedItems.length} selected</span>
                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                setProductList(productList.filter((p) => !selectedItems.includes(p.id)));
                                setSelectedItems([]);
                                setIsSelectMode(false);
                            }}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm"
                        >
                            Delete
                        </button>
                        <button
                            onClick={() => {
                                const targetCollection = prompt("Enter collection name");
                                if (!targetCollection) return;
                                setProductList(
                                    productList.map((p) =>
                                        selectedItems.includes(p.id)
                                            ? { ...p, collection: targetCollection }
                                            : p
                                    )
                                );
                                setSelectedItems([]);
                                setIsSelectMode(false);
                            }}
                            className="border border-gray-300 px-4 py-2 rounded-lg text-sm"
                        >
                            Move
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}