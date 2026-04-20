export default function CollectionCard({ title, count, emoji, isActive }) {
  return (
    <div
      className={`flex flex-col items-start rounded-2xl border p-3 min-w-[110px] max-w-[110px] transition-all duration-200 ${isActive
          ? "bg-black text-white border-black"
          : "bg-white text-gray-800 border-gray-200 hover:border-gray-400"
        }`}
    >
      <span className="text-2xl mb-2">{emoji}</span>
      <p className="text-xs font-semibold line-clamp-1 w-full">{title}</p>
      <p className={`text-xs mt-0.5 ${isActive ? "text-gray-300" : "text-gray-400"}`}>
        {count} items
      </p>
    </div>
  );
}