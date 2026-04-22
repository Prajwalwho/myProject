const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const clean = (str) => str?.trim().replace(/\s+/g, " ") || "";

function extractMeta($) {
  const get = (selector) => $(selector).attr("content") || "";
  return {
    title:
      get('meta[property="og:title"]') ||
      get('meta[name="twitter:title"]') ||
      clean($("title").text()),
    image:
      get('meta[property="og:image"]') ||
      get('meta[name="twitter:image"]') ||
      get('meta[property="og:image:secure_url"]'),
    price:
      get('meta[property="product:price:amount"]') ||
      get('meta[property="og:price:amount"]') ||
      get('meta[name="twitter:data1"]') ||
      "",
    description:
      get('meta[property="og:description"]') ||
      get('meta[name="description"]') ||
      "",
    siteName: get('meta[property="og:site_name"]') || "",
  };
}

function detectPlatform(url) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    if (hostname.includes("myntra")) return "Myntra";
    if (hostname.includes("amazon")) return "Amazon";
    if (hostname.includes("flipkart")) return "Flipkart";
    if (hostname.includes("meesho")) return "Meesho";
    if (hostname.includes("ajio")) return "Ajio";
    if (hostname.includes("nykaa")) return "Nykaa";
    if (hostname.includes("snapdeal")) return "Snapdeal";
  } catch {}
  return "Custom";
}

function parsePrice(priceStr) {
  if (!priceStr) return null;
  // Handle Indian price format like ₹1,299 or Rs. 1299
  const num = priceStr.replace(/[^0-9.]/g, "");
  return num ? parseFloat(num) : null;
}

function extractBrand(title, siteName) {
  if (siteName) return siteName;
  const words = title.split(" ");
  return words.length > 1 ? words[0] : "";
}

function cleanTitle(title) {
  return title
    .replace(/^Buy\s+/i, "")
    .replace(/\s*[-|–]\s*[-|–]\s*.*/i, "")
    .replace(
      /\s*[-|]\s*(Myntra|Amazon\.in|Amazon|Flipkart|Meesho|Ajio|Nykaa).*$/i,
      "",
    )
    .replace(/\s*[-|]\s*Buy.*$/i, "")
    .replace(/\s*[-|]\s*Shop.*$/i, "")
    .replace(/\s*[-|]\s*Apparel.*$/i, "")
    .replace(/\s*[-|]\s*Online.*$/i, "")
    .trim();
}

app.get("/api/scrape", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const response = await axios.get(url, {
      timeout: 8000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-IN,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache",
      },
      maxRedirects: 5,
    });

    const $ = cheerio.load(response.data);
    const meta = extractMeta($);
    const platform = detectPlatform(url);

    // Try meta price first
    let price = parsePrice(meta.price);

    // Then try platform-specific selectors
    if (!price) {
      const priceSelectors = [
        ".pdp-price strong", // Myntra current price
        ".pdp-price", // Myntra fallback
        ".pdp-mrp strong", // Myntra MRP
        "span.pdp-price", // Myntra alt
        ".Nx9bqj", // Flipkart
        "._30jeq3", // Flipkart old
        ".a-price-whole", // Amazon
        ".a-offscreen", // Amazon alt
        ".price-box", // Generic
        ".product-price", // Generic
        '[data-testid="price"]', // Generic
        ".price", // Generic
      ];

      for (const selector of priceSelectors) {
        const priceText = $(selector).first().text();
        const parsed = parsePrice(priceText);
        if (parsed && parsed > 1) {
          price = parsed;
          break;
        }
      }
    }

    // Extract price from description or title
    if (!price) {
      const textToSearch = (meta.description || "") + " " + (meta.title || "");
      const patterns = [
        /₹\s*([0-9,]+)/,
        /Rs\.?\s*([0-9,]+)/i,
        /INR\s*([0-9,]+)/i,
        /price[:\s]+([0-9,]+)/i,
      ];
      for (const pattern of patterns) {
        const match = textToSearch.match(pattern);
        if (match) {
          price = parsePrice(match[1]);
          if (price && price > 1) break;
        }
      }
    }

    const title = cleanTitle(meta.title);

    // Try to extract brand from page for Myntra
    let brand = "";
    if (platform === "Myntra") {
      brand =
        $(".pdp-title").first().text().trim() ||
        $("h1.pdp-name").first().text().split(" ")[0] ||
        extractBrand(title, "");
    } else {
      brand = extractBrand(title, meta.siteName);
    }

    const result = {
      name: title || "",
      image: meta.image || "",
      price: price || null,
      brand: brand || "",
      platform,
      url,
      description: meta.description || "",
    };

    return res.json(result);
  } catch (err) {
    const platform = detectPlatform(url);
    return res.json({
      name: "",
      image: "",
      price: null,
      brand: "",
      platform,
      url,
      error: "Could not fetch product details. Please fill manually.",
    });
  }
});

app.get("/", (req, res) => {
  res.json({ status: "pickpocket API running" });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ pickpocket server running on http://localhost:${PORT}`);
});
