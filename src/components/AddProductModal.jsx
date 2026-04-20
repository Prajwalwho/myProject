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
  } catch {
    return "Custom";
  }
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
    setPlatform(detectPlatform(val));
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
    setName(""); setBrand(""); setPrice("");
    setOldPrice(""); setPlatform("Custom");
    setCollection(""); setUrl("");
    onClose();
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 9999, padding: "16px"
    }}>
      <div style={{
        backgroundColor: "white", borderRadius: "24px",
        width: "100%", maxWidth: "430px",
        display: "flex", flexDirection: "column",
        maxHeight: "85vh"
      }}>

        {/* Header */}
        <div style={{ padding: "24px 24px 16px", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 600 }}>
              Add Product
            </h2>
            <button onClick={onClose} style={{ fontSize: "24px", color: "#9ca3af", lineHeight: 1, background: "none", border: "none", cursor: "pointer" }}>
              ×
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY: "auto", padding: "0 24px 24px", flex: 1 }}>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ fontSize: "11px", color: "#9ca3af", display: "block", marginBottom: "4px" }}>Product URL (optional)</label>
            <input
              type="text"
              placeholder="Paste link from Myntra, Amazon..."
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "12px", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ fontSize: "11px", color: "#9ca3af", display: "block", marginBottom: "4px" }}>Product Name *</label>
            <input
              type="text"
              placeholder="e.g. Floral Wrap Dress"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "12px", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ fontSize: "11px", color: "#9ca3af", display: "block", marginBottom: "4px" }}>Brand *</label>
            <input
              type="text"
              placeholder="e.g. Libas"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "12px", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "11px", color: "#9ca3af", display: "block", marginBottom: "4px" }}>Price (₹) *</label>
              <input
                type="number"
                placeholder="899"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "12px", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "11px", color: "#9ca3af", display: "block", marginBottom: "4px" }}>Original Price (₹)</label>
              <input
                type="number"
                placeholder="1499"
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
                style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "12px", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "11px", color: "#9ca3af", display: "block", marginBottom: "4px" }}>Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "12px", fontSize: "13px", outline: "none", backgroundColor: "white", boxSizing: "border-box" }}
              >
                {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "11px", color: "#9ca3af", display: "block", marginBottom: "4px" }}>Collection</label>
              <select
                value={collection}
                onChange={(e) => setCollection(e.target.value)}
                style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "12px", fontSize: "13px", outline: "none", backgroundColor: "white", boxSizing: "border-box" }}
              >
                <option value="">None</option>
                {collections.map((c) => <option key={c.id} value={c.title}>{c.title}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={handleSave}
              disabled={!name || !brand || !price}
              style={{
                flex: 1, padding: "14px", borderRadius: "12px",
                backgroundColor: !name || !brand || !price ? "#e5e7eb" : "#c45c3a",
                color: !name || !brand || !price ? "#9ca3af" : "white",
                border: "none", fontSize: "14px", fontWeight: 500, cursor: !name || !brand || !price ? "not-allowed" : "pointer"
              }}
            >
              Save Product
            </button>
            <button
              onClick={onClose}
              style={{ flex: 1, padding: "14px", borderRadius: "12px", border: "1px solid #e5e7eb", backgroundColor: "white", fontSize: "14px", color: "#6b7280", cursor: "pointer" }}
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}