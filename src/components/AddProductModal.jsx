import { useState } from "react";

export default function AddProductModal({
  isOpen,
  onClose,
  onSave,
}) {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name || !brand || !price) return;
    const newProduct = {
      id: Date.now(),
      name,
      brand,
      price: Number(price),
      platform: "Custom",
      emoji: "🛍️",
    };

    onSave(newProduct);

    setName("");
    setBrand("");
    setPrice("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-80 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">
          Add Product
        </h2>

        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-lg p-3 mb-3"
        />

        <input
          type="text"
          placeholder="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="w-full border rounded-lg p-3 mb-3"
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4"
        />

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 bg-orange-500 text-white rounded-lg py-2"
          >
            Save
          </button>

          <button
            onClick={onClose}
            className="flex-1 border rounded-lg py-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}