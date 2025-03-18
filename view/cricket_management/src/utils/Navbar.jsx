import {react} from 'react';
import {Link} from 'react-router-dom';

const Navbar = () => {
    return (
        <div className="w-full fixted top-0 left-0">
            <div className="flex justify-between bg-gray-800 p-4">
                <div className="text-white text-2xl">Cricket Management</div>
                <div className="flex">
                    <Link to="/" className="text-white hover:text-gray-200 p-2">Home</Link>
                    <Link to="/login" className="text-white p-2">Matchs</Link>
                    <Link to="/login" className="text-white p-2">Point Table</Link>
                    <Link to="/login" className="text-white p-2"></Link>
                    <Link to="/login" className="text-white p-2">Login or Register</Link>
                </div>
            </div>
        </div>
    )
}

export default Navbar;