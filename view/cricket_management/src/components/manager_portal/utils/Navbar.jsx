import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";

const Navbar = () => {
  const [cookies, removeCookie] = useCookies(["token"]);

  const handleClick = () => {
    removeCookie("token");
  };

  return (
    <nav className="w-full z-50 bg-gray-900 shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <div>
          <Link to="/" className="text-white text-2xl font-bold tracking-wide hover:text-gray-300 transition">
            Cricket Management
          </Link>
        </div>

        <div className="flex gap-4">
          <NavItem to="/manager_portal" label="Manager Portal Home" />
          <NavItem to="/manager_portal/score" label="Live Score Update" />
          <NavItem to="/manager_portal/teams" label="Add Teams" />
          <NavItem to="/manager_portal/tournament" label="Add Matches To Tournament" />

          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition font-semibold"
            onClick={handleClick}
          >
            Log Out
          </button>
        </div>
      </div>
    </nav>
  );
};
const NavItem = ({ to, label }) => (
  <Link to={to} className="text-white text-sm font-medium hover:text-gray-300 px-3 py-2 transition">
    {label}
  </Link>
);

export default Navbar;
