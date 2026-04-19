export default function ProductCard({ product, isSelectMode, selectedItems, setSelectedItems }) {
    return (
        <div className="relative bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
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
                    className="absolute top-2 left-2"
                />
            )}

            <div className="h-44 flex items-center justify-center text-5xl bg-gray-100">
                {product.emoji}
            </div>

            <div className="p-3">
                <p className="text-sm text-gray-500">{product.platform}</p>
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.brand}</p>

                <div className="flex items-center gap-2 mt-3">
                    <span className="text-xl font-bold">
                        ₹{product.price}
                    </span>
                    {product.oldPrice && (
                        <span className="text-sm line-through text-gray-400">
                            ₹{product.oldPrice}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}