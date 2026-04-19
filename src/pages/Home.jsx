import { useState } from "react";
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
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);

    const filteredProducts = productList.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesPlatform =
            selectedPlatform === "All" ||
            product.platform === selectedPlatform;

        return matchesSearch && matchesPlatform;
    });



    return (
        <div className="min-h-screen bg-[#f7f5f0] p-4">
            <div className="mb-6">
                <h1 className="text-5xl font-bold">
                    pick<span className="text-orange-500">pocket</span>
                </h1>
                <p className="text-gray-500 mt-1">
                    {productList.length} saved items
                </p>
            </div>

            <button
                onClick={() => setIsSelectMode(!isSelectMode)}
                className="text-sm border px-3 py-1 rounded-lg"
            >
                {isSelectMode ? "Cancel" : "Select"}
            </button>

            <input
                type="text"
                placeholder="Search your wishlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 rounded-xl border bg-white mb-6"
            />

            <PlatformTabs
                selectedPlatform={selectedPlatform}
                setSelectedPlatform={setSelectedPlatform}
            />

            <div className="mt-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">
                    Collections
                </h2>

                <div className="flex gap-4 overflow-x-auto">
                    {collections.map((collection) => (
                        <CollectionCard
                            key={collection.id}
                            title={collection.title}
                            count={collection.count}
                            emoji={collection.emoji}
                        />
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
                {filteredProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        isSelectMode={isSelectMode}
                        selectedItems={selectedItems}
                        setSelectedItems={setSelectedItems}
                    />
                ))}
            </div>

            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-orange-500 text-white text-3xl shadow-lg flex items-center justify-center"
            >
                <span>+</span>
            </button>

            <AddProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={(newProduct) =>
                    setProductList([...productList, newProduct])
                }
            />
        </div>
    );
}