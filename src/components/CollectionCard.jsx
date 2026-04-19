export default function CollectionCard({ title, count, emoji, isActive }) {
  return (
    <div
      className={`rounded-2xl border p-4 min-w-[180px] ${isActive ? "bg-black text-white" : "bg-white"
        }`}
    >
      <div className="text-4xl mb-3">{emoji}</div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm opacity-70">{count} items</p>
    </div>
  );
}