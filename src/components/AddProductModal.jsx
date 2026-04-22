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
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const resetAll = () => {
    setName(""); setBrand(""); setPrice("");
    setOldPrice(""); setPlatform("Custom");
    setCollection(""); setUrl(""); setImage("");
  };

  const handleClose = () => {
    resetAll();
    onClose();
  };

  const handleUrlChange = async (val) => {
    setUrl(val);
    setPlatform(detectPlatform(val));

    if (!val.startsWith("http")) return;

    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/scrape?url=${encodeURIComponent(val)}`);
      const data = await res.json();

      if (data.name) {
        const cleanName = data.name
          .replace(/^Buy\s+/i, "")
          .replace(/\s*[-|]\s*(Myntra|Amazon\.in|Amazon|Flipkart|Meesho|Ajio|Nykaa).*$/i, "")
          .trim()
          .slice(0, 80);
        setName(cleanName);
      }
      if (data.brand) setBrand(data.brand);
      if (data.price) setPrice(data.price.toString());
      if (data.platform) setPlatform(data.platform);
      if (data.image) setImage(data.image);
    } catch {
      // silent fail — user fills manually
    }
    setIsLoading(false);
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
      image: image || null,
      emoji: image ? null : "🛍️",
    };
    onSave(newProduct);
    resetAll();
    onClose();
  };

  const inputStyle = {
    width: "100%", border: "1px solid #e5e7eb", borderRadius: "12px",
    padding: "12px", fontSize: "13px", outline: "none", boxSizing: "border-box",
  };

  const labelStyle = {
    fontSize: "11px", color: "#9ca3af", display: "block", marginBottom: "4px",
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 9999, padding: "16px",
    }}>
      <div style={{
        backgroundColor: "white", borderRadius: "24px",
        width: "100%", maxWidth: "430px",
        display: "flex", flexDirection: "column",
        maxHeight: "85vh",
      }}>

        {/* Header */}
        <div style={{ padding: "24px 24px 16px", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 600 }}>
              Add Product
            </h2>
            <button
              onClick={handleClose}
              style={{ fontSize: "24px", color: "#9ca3af", lineHeight: 1, background: "none", border: "none", cursor: "pointer" }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY: "auto", padding: "0 24px 24px", flex: 1 }}>

          {/* URL field */}
          <div style={{ marginBottom: "12px" }}>
            <label style={labelStyle}>Product URL (optional)</label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Paste link from Myntra, Amazon..."
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                style={{ ...inputStyle, paddingRight: isLoading ? "80px" : "12px" }}
              />
              {isLoading && (
                <div style={{
                  position: "absolute", right: "12px", top: "50%",
                  transform: "translateY(-50%)", fontSize: "11px", color: "#c45c3a",
                }}>
                  Fetching...
                </div>
              )}
            </div>
          </div>

          {/* Image preview */}
          {image && (
            <div style={{ marginBottom: "12px" }}>
              <img
                src={image}
                alt="product"
                style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "12px", border: "1px solid #e5e7eb" }}
              />
            </div>
          )}

          {/* Name */}
          <div style={{ marginBottom: "12px" }}>
            <label style={labelStyle}>Product Name *</label>
            <input type="text" placeholder="e.g. Floral Wrap Dress"
              value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
          </div>

          {/* Brand */}
          <div style={{ marginBottom: "12px" }}>
            <label style={labelStyle}>Brand *</label>
            <input type="text" placeholder="e.g. Libas"
              value={brand} onChange={(e) => setBrand(e.target.value)} style={inputStyle} />
          </div>

          {/* Price + Old Price */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Price (₹) *</label>
              <input type="number" placeholder="899"
                value={price} onChange={(e) => setPrice(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Original Price (₹)</label>
              <input type="number" placeholder="1499"
                value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} style={inputStyle} />
            </div>
          </div>

          {/* Platform + Collection */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Platform</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)}
                style={{ ...inputStyle, backgroundColor: "white" }}>
                {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Collection</label>
              <select value={collection} onChange={(e) => setCollection(e.target.value)}
                style={{ ...inputStyle, backgroundColor: "white" }}>
                <option value="">None</option>
                {collections.map((c) => <option key={c.id} value={c.title}>{c.title}</option>)}
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={handleSave}
              disabled={!name || !brand || !price}
              style={{
                flex: 1, padding: "14px", borderRadius: "12px",
                backgroundColor: !name || !brand || !price ? "#e5e7eb" : "#c45c3a",
                color: !name || !brand || !price ? "#9ca3af" : "white",
                border: "none", fontSize: "14px", fontWeight: 500,
                cursor: !name || !brand || !price ? "not-allowed" : "pointer",
              }}
            >
              Save Product
            </button>
            <button
              onClick={handleClose}
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