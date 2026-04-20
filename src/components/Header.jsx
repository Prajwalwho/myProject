export default function Header({ itemCount }) {
    return (
        <div className="flex items-start justify-between mb-4">
            <div>
                <h1
                    className="text-4xl font-bold"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    pick
                    <span className="italic" style={{ color: "#c45c3a" }}>
                        pocket
                    </span>
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                    {itemCount} saved items
                </p>
            </div>

            <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold mt-1"
                style={{ backgroundColor: "#c45c3a" }}
            >
                RK
            </div>
        </div>
    );
}