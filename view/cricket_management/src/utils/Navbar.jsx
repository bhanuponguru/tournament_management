import {Link} from 'react-router-dom';
import React from 'react';
import {useCookies} from 'react-cookie';
const Navbar = () => {
    const [cookies,setCookie,removeCookie] = useCookies(["token"]);
    const handleClick = () => {
        removeCookie("token");
    }
    return (
        <div className="w-full fixted top-0 left-0">
            <div className="flex justify-between bg-gray-800 p-4">
                <div className="text-white text-2xl">Cricket Management</div>
                <div className="flex">
                    <Link to="/" className="text-white hover:text-gray-200 p-2">Home</Link>
                    <Link to="/matchs" className="text-white p-2">Matchs</Link>
                    <Link to="/points" className="text-white p-2">Point Table</Link>
                    <Link to="/manager_portal" className="text-white p-2">Manager Portal</Link>
                    <button className="text-white p-2" onClick={handleClick} >LogOut</button>
                </div>
            </div>
        </div>
    )
}

export default Navbar;