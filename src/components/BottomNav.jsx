import { useLocation, useNavigate } from "react-router-dom";

const navItems = [
    {
        label: "Home",
        path: "/",
        icon: (active) => (
            <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "#c45c3a" : "none"} stroke={active ? "#c45c3a" : "#9ca3af"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
            </svg>
        ),
    },
    {
        label: "Collections",
        path: "/collections",
        icon: (active) => (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#c45c3a" : "#9ca3af"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
        ),
    },
    {
        label: "Platforms",
        path: "/platforms",
        icon: (active) => (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#c45c3a" : "#9ca3af"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3a15 15 0 010 18M3 12h18" />
            </svg>
        ),
    },
    {
        label: "Profile",
        path: "/profile",
        icon: (active) => (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#c45c3a" : "#9ca3af"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
        ),
    },
];

export default function BottomNav() {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
            <div className="max-w-[430px] mx-auto flex justify-around items-center py-2">
                {navItems.map((item) => {
                    const active = location.pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className="flex flex-col items-center gap-1 px-4 py-1"
                        >
                            {item.icon(active)}
                            <span
                                className="text-[10px]"
                                style={{ color: active ? "#c45c3a" : "#9ca3af" }}
                            >
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}