export default function ProductCard({
    product,
    isSelectMode,
    selectedItems,
    setSelectedItems,
}) {
    return (
        <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition">

            {/* ✅ Checkbox (Select Mode) */}
            {isSelectMode && (
                <input
                    type="checkbox"
                    checked={selectedItems.includes(product.id)}
                    onChange={(e) => {
                        if (e.target.checked) {
                            setSelectedItems([...selectedItems, product.id]);
                        } else {
                            setSelectedItems(
                                selectedItems.filter((id) => id !== product.id)
                            );
                        }
                    }}
                    className="absolute top-2 left-2 w-4 h-4 accent-orange-500 cursor-pointer"
                />
            )}

            {/* 🖼 Image / Emoji Section */}
            <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                            e.target.style.display = "none";
                        }}
                    />
                ) : (
                    <span className="text-5xl">
                        {product.emoji || "📦"}
                    </span>
                )}
            </div>

            {/* 📄 Content */}
            <div className="p-3">
                <p className="text-xs text-gray-500 mb-1">
                    {product.platform}
                </p>

                {/* ✅ FIXED TITLE (no overflow) */}
                <h3 className="text-sm font-semibold line-clamp-1">
                    {product.name}
                </h3>

                <p className="text-xs text-gray-500 line-clamp-1">
                    {product.brand}
                </p>

                {/* 💰 Price */}
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-bold">
                        ₹{product.price}
                    </span>

                    {product.oldPrice && (
                        <span className="text-xs line-through text-gray-400">
                            ₹{product.oldPrice}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}