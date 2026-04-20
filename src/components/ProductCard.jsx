export default function ProductCard({
    product,
    isSelectMode,
    selectedItems,
    setSelectedItems,
}) {
    const discount = product.oldPrice
        ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
        : null;

    const platformColors = {
        Myntra: { bg: "#fce7f3", text: "#9d174d" },
        Amazon: { bg: "#fff7ed", text: "#9a3412" },
        Flipkart: { bg: "#eff6ff", text: "#1e40af" },
        Meesho: { bg: "#f5f3ff", text: "#5b21b6" },
        Custom: { bg: "#f0fdf4", text: "#166534" },
    };

    const platformStyle = platformColors[product.platform] || platformColors.Custom;

    const handleClick = () => {
        if (isSelectMode) return;
        if (product.url) {
            window.open(product.url, "_blank");
        } else {
            alert("No link saved for this item. Edit it to add a URL.");
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-shadow duration-200 ${product.url ? "cursor-pointer hover:shadow-md" : "cursor-default"
                }`}
        >
            {isSelectMode && (
                <input
                    type="checkbox"
                    checked={selectedItems.includes(product.id)}
                    onChange={(e) => {
                        e.stopPropagation();
                        if (e.target.checked) {
                            setSelectedItems([...selectedItems, product.id]);
                        } else {
                            setSelectedItems(selectedItems.filter((id) => id !== product.id));
                        }
                    }}
                    className="absolute top-2 left-2 w-4 h-4 accent-orange-500 cursor-pointer z-10"
                />
            )}

            {!isSelectMode && (
                <div
                    className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold z-10"
                    style={{ backgroundColor: platformStyle.bg, color: platformStyle.text }}
                >
                    {product.platform}
                </div>
            )}

            {discount && (
                <div className="absolute top-2 right-2 bg-green-100 text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded-full z-10">
                    {discount}% off
                </div>
            )}

            <div className="h-40 bg-gray-50 flex items-center justify-center overflow-hidden relative">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                        }}
                    />
                ) : null}
                <div
                    className="h-full w-full items-center justify-center text-5xl"
                    style={{ display: product.image ? "none" : "flex" }}
                >
                    {product.emoji || "📦"}
                </div>

            </div>

            <div className="p-3">
                <h3 className="text-sm font-semibold line-clamp-1 text-gray-900">{product.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{product.brand}</p>
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-base font-bold text-gray-900">
                        ₹{product.price.toLocaleString("en-IN")}
                    </span>
                    {product.oldPrice && (
                        <span className="text-xs line-through text-gray-400">
                            ₹{product.oldPrice.toLocaleString("en-IN")}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}