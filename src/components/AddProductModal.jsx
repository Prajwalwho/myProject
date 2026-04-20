import { useState } from "react";

const PLATFORMS = ["Myntra", "Amazon", "Flipkart", "Meesho", "Custom"];

const PLATFORM_DOMAINS = {
  myntra: "Myntra",
  amazon: "Amazon",
  flipkart: "Flipkart",
  meesho: "Meesho",
};

function detectPlatform(url) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    for (const [key, value] of Object.entries(PLATFORM_DOMAINS)) {
      if (hostname.includes(key)) return value;
    }
  } catch { return "Custom"; }
  return "Custom";
}

export default function AddProductModal({ isOpen, onClose, onSave, collections = [] }) {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [platform, setPlatform] = useState("Custom");
  const [collection, setCollection] = useState("");
  const [url, setUrl] = useState("");

  if (!isOpen) return null;

  const handleUrlChange = (val) => {
    setUrl(val);
    const detected = detectPlatform(val);
    setPlatform(detected);
  };

  const handleSave = () => {
    if (!name || !brand || !price) return;

    const newProduct = {
      id: Date.now(),
      name,
      brand,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : null,
      platform,
      collection: collection || "Custom",
      url: url || null,
      emoji: "🛍️",
    };

    onSave(newProduct);
    setName("");
    setBrand("");
    setPrice("");
    setOldPrice("");
    setPlatform("Custom");
    setCollection("");
    setUrl("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-3xl p-6 w-full max-w-[430px] shadow-xl">

        {/* Handle */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

        <h2
          className="text-2xl font-semibold mb-5"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Add Product
        </h2>

        {/* URL — auto detects platform */}
        <div className="mb-3">
          <label className="text-xs text-gray-400 mb-1 block">Product URL (optional)</label>
          <input
            type="text"
            placeholder="Paste link from Myntra, Amazon..."
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-orange-200"
          />
        </div>

        {/* Name */}
        <div className="mb-3">
          <label className="text-xs text-gray-400 mb-1 block">Product Name *</label>
          <input
            type="text"
            placeholder="e.g. Floral Wrap Dress"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-orange-200"
          />
        </div>

        {/* Brand */}
        <div className="mb-3">
          <label className="text-xs text-gray-400 mb-1 block">Brand *</label>
          <input
            type="text"
            placeholder="e.g. Libas"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-orange-200"
          />
        </div>

        {/* Price + Old Price side by side */}
        <div className="flex gap-3 mb-3">
          <div className="flex-1">
            <label className="text-xs text-gray-400 mb-1 block">Price (₹) *</label>
            <input
              type="number"
              placeholder="899"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-400 mb-1 block">Original Price (₹)</label>
            <input
              type="number"
              placeholder="1499"
              value={oldPrice}
              onChange={(e) => setOldPrice(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>
        </div>

        {/* Platform + Collection side by side */}
        <div className="flex gap-3 mb-5">
          <div className="flex-1">
            <label className="text-xs text-gray-400 mb-1 block">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none bg-white"
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-400 mb-1 block">Collection</label>
            <select
              value={collection}
              onChange={(e) => setCollection(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none bg-white"
            >
              <option value="">None</option>
              {collections.map((c) => (
                <option key={c.id} value={c.title}>{c.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={!name || !brand || !price}
            className="flex-1 py-3 rounded-xl text-white font-medium text-sm disabled:opacity-40 transition"
            style={{ backgroundColor: "#c45c3a" }}
          >
            Save Product
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}