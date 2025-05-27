import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <nav className="flex text-white">
      <Link
        to="/"
        className="flex-1 text-center py-4 border-r border-white hover:bg-gray-800 transition"
      >
        Menu
      </Link>
      <div className="flex-1 flex items-center justify-center border-r border-white px-2">
        <input
          type="text"
          placeholder="Search games..."
          className="bg-transparent border-b border-white text-white px-2 py-1 focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="ml-2 px-3 py-1 border border-white hover:bg-white hover:text-black transition"
        >
          Search
        </button>
      </div>
      <Link
        to="/dashboard"
        className="flex-1 text-center py-4 border-r border-white hover:bg-gray-800 transition"
      >
        Dashboard
      </Link>
      <Link
        to="/profile"
        className="flex-1 text-center py-4 hover:bg-gray-800 transition"
      >
        Profile
      </Link>
    </nav>
  );
}
