import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BottomNav from "./components/BottomNav";
import Collections from "./pages/Collections";
import ShareTarget from "./pages/ShareTarget";

export default function App() {
  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-[#f7f5f0] relative">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/share-target" element={<ShareTarget />} />
      </Routes>
      <BottomNav />
    </div>
  );
}