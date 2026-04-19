export default function CollectionCard({ title, count, emoji }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-4 w-44">
      <div className="text-4xl mb-3">{emoji}</div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-gray-500 text-sm">{count} items</p>
    </div>
  );
}