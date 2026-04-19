const tabs = ["All", "Myntra", "Amazon", "Flipkart", "Meesho", "Custom"];

export default function PlatformTabs({
  selectedPlatform,
  setSelectedPlatform,
}) {
  return (
    <div className="flex gap-3 mb-6 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setSelectedPlatform(tab)}
          className={`px-4 py-2 rounded-full whitespace-nowrap ${selectedPlatform === tab
            ? "bg-black text-white"
            : "bg-white border text-gray-600"
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}