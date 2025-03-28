import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Bell } from "lucide-react";

const Navbar = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  const handleClick = () => {
    removeCookie("token");
    window.location.href = "/login";
  }

  return (
    <div className="w-full fixed top-0 left-0 z-30">
      <div 
        className="bg-gray-900 bg-[url(https://c0.wallpaperflare.com/path/967/82/462/australia-richmond-melbourne-cricket-ground-cricket-371772744fa62261f54850a915da5c9b.jpg)] text-white bg-cover bg-center relative"
      >
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="flex justify-between items-center relative z-10 p-4">
        <div>
          <Link to="/" className="text-white text-2xl font-bold tracking-wide hover:text-gray-300 transition">
            Cricket Management
          </Link>
        </div>
          <div className="flex items-center gap-3">
            <Link to="/manager_portal" className="px-4 py-2 bg-white/20 rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300 text-white">
              Manager Portal Home
            </Link>
            <Link to="/manager_portal/score" className="px-4 py-2 bg-white/20 rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300 text-white">
              Live Score Update
            </Link>
            <Link to="/manager_portal/teams" className="px-4 py-2 bg-white/20 rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300 text-white">
              Add Teams
            </Link>
            <Link to="/manager_portal/tournament" className="px-4 py-2 bg-white/20 rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300 text-white">
              Add Matches To Tournament
            </Link>

            <button
              onClick={handleClick}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 text-white"
            >
              LogOut
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;