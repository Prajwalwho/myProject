import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import PlatformTabs from "../components/PlatformTabs";
import CollectionCard from "../components/CollectionCard";
import AddProductModal from "../components/AddProductModal";
import { collections } from "../data/collectionsData";
import { products as initialProducts } from "../data/dummyData";

export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productList, setProductList] = useState(initialProducts);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPlatform, setSelectedPlatform] = useState("All");
    const [selectedCollection, setSelectedCollection] = useState("All");
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [collectionsState, setCollectionsState] = useState(collections);
    const [sortType, setSortType] = useState("");

    // ✅ LOAD from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("products");
        if (saved) {
            try {
                setProductList(JSON.parse(saved));
            } catch (err) {
                console.error("Invalid localStorage data");
            }
        }
    }, []);

    // ✅ SAVE to localStorage
    useEffect(() => {
        localStorage.setItem("products", JSON.stringify(productList));
    }, [productList]);

    // 🔍 FILTER LOGIC
    const filteredProducts = productList.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesPlatform =
            selectedPlatform === "All" ||
            product.platform === selectedPlatform;

        const matchesCollection =
            selectedCollection === "All" ||
            product.collection === selectedCollection;

        return matchesSearch && matchesPlatform && matchesCollection;
    });

    // 🔥 SORTING LOGIC
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortType === "low") return a.price - b.price;
        if (sortType === "high") return b.price - a.price;
        return 0;
    });

    // 📊 COLLECTION COUNTS
    const collectionCounts = productList.reduce((acc, product) => {
        const key = product.collection || "Custom";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-[#f7f5f0] p-4">

            {/* 🔥 Header */}
            <div className="mb-4">
                <h1 className="text-5xl font-bold">
                    pick<span className="text-orange-500">pocket</span>
                </h1>
                <p className="text-gray-500 mt-1">
                    {productList.length} saved items
                </p>
            </div>

            {/* 🔍 Search */}
            <input
                type="text"
                placeholder="Search your wishlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 rounded-xl border bg-white mb-6"
            />

            {/* 🧭 Platform Tabs */}
            <PlatformTabs
                selectedPlatform={selectedPlatform}
                setSelectedPlatform={setSelectedPlatform}
            />

            {/* 📂 Collections */}
            <div className="mt-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Collections</h2>

                {/* ➕ Add Collection */}
                <button
                    onClick={() => {
                        const name = prompt("Enter collection name");
                        if (!name) return;

                        setCollectionsState([
                            ...collectionsState,
                            {
                                id: Date.now(),
                                title: name,
                                count: 0,
                                emoji: "📦",
                            },
                        ]);
                    }}
                    className="mb-3 px-3 py-1 border rounded-lg"
                >
                    + Add Collection
                </button>

                {/* All */}
                <button
                    onClick={() => setSelectedCollection("All")}
                    className={`px-3 py-1 rounded-lg border mb-3 ${selectedCollection === "All"
                            ? "bg-black text-white"
                            : "bg-white"
                        }`}
                >
                    All Items
                </button>

                <div className="flex gap-4 overflow-x-auto">
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

            {/* 🎯 CONTROL BAR */}
            <div className="flex justify-between items-center mb-4">

                <div></div>

                <div className="flex gap-3">

                    {/* 🔽 Sorting */}
                    <select
                        value={sortType}
                        onChange={(e) => setSortType(e.target.value)}
                        className="border px-3 py-2 rounded-lg"
                    >
                        <option value="">Sort</option>
                        <option value="low">Price: Low → High</option>
                        <option value="high">Price: High → Low</option>
                    </select>

                    {/* Select */}
                    <button
                        onClick={() => {
                            setIsSelectMode(!isSelectMode);
                            setSelectedItems([]);
                        }}
                        className="bg-black text-white px-4 py-2 rounded-full shadow"
                    >
                        {isSelectMode ? "Cancel" : "Select"}
                    </button>

                    {/* Add */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-10 h-10 rounded-full bg-orange-500 text-white text-xl shadow flex items-center justify-center"
                    >
                        +
                    </button>

                </div>
            </div>

            {/* 🛍 Products */}
            <div className="mt-4">
                {sortedProducts.length === 0 ? (
                    <div className="text-center mt-10 text-gray-500">
                        {selectedCollection !== "All" ? (
                            <>
                                <p className="text-lg">
                                    No items in "{selectedCollection}" 📂
                                </p>
                                <p className="text-sm">
                                    Add products or move items here
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-lg">No items found 😕</p>
                                <p className="text-sm">
                                    Try different search or filters
                                </p>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
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

            {/* 🧾 Modal */}
            <AddProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={(newProduct) =>
                    setProductList([...productList, newProduct])
                }
            />

            {/* ✅ Bottom Bar */}
            {isSelectMode && selectedItems.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center shadow-md">

                    <span className="font-medium">
                        {selectedItems.length} selected
                    </span>

                    <div className="flex gap-3">

                        {/* Delete */}
                        <button
                            onClick={() => {
                                setProductList(
                                    productList.filter(
                                        (p) => !selectedItems.includes(p.id)
                                    )
                                );
                                setSelectedItems([]);
                                setIsSelectMode(false);
                            }}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg"
                        >
                            Delete
                        </button>

                        {/* Move */}
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
                            className="border px-4 py-2 rounded-lg"
                        >
                            Move
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
}