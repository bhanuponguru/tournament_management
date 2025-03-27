import {Link} from 'react-router-dom';
import {React,useState,useLayoutEffect} from 'react';
import {useCookies} from 'react-cookie';
import { Bell } from "lucide-react"
import axios from '../api/axios';
import NotificationBox from './NotificationBox';
const Navbar = () => {
    const [cookies,removeCookie] = useCookies(["token"]);
    const [isShaking, setIsShaking] = useState(true)
    const [showNotification, setShowNotification] = useState(false)
    const [notifications, setNotifications] = useState([])  
    const [role, setRole] = useState(null)
    useLayoutEffect(() => {
        axios.get(`/users/verify_role/?role=${'viewer'}`, {
            headers: { Authorization: `Bearer ${cookies.token}` },
        }).then((response) => {setRole('viewer')})
        .catch((e) => {console.log(e);
            axios.get(`/users/verify_role/?role=${'admin'}`, {
                headers: { Authorization: `Bearer ${cookies.token}` },
            }).then((response) => {setRole('admin')})
            .catch((e) => {console.log(e);setRole('manager')});
        });
    }, []);
    useLayoutEffect(() => {
        if(role === 'viewer'){
            axios.get("/users/role_requests",{headers: { Authorization: `Bearer ${cookies.token}` }}).then((response) => {
                setNotifications(response.data);
            }).catch((e) => {console.log(e)});
        }
        else if (role === 'admin'){
            axios.get("/admin/role_requests",{headers: { Authorization: `Bearer ${cookies.token}` }}).then((response) => {
                setNotifications(response.data);
              }).catch((e) => {console.log(e)});
        }
    }, [role])
    const handleClick = () => {
        removeCookie("token");
    }
    return (
        <div className="w-full fixted top-0 left-0">
            <div className="flex justify-between bg-gray-800 p-4">
                <div className="text-white text-2xl">Cricket Management</div>
                <div className="flex gap-2">
                    <Link to="/" className="text-white hover:text-gray-300 p-2">Home</Link>
                    <Link to="/matchs" className="text-white hover:text-gray-300 p-2">Matchs</Link>
                    <Link to="/points" className="text-white hover:text-gray-300 p-2">Point Table</Link>
                    {role === 'admin' ? null:
                    role === 'viewer' ? <Link to="/request_role" className="text-white hover:text-gray-300 p-2">Request Role</Link>: 
                    role === 'manager' ? <Link to="/manager_portal" className="text-white hover:text-gray-300 p-2">Managment Portal</Link>:<p className="text-white p-2" >Loading...</p>}
                    <button
                        onClick={() => setShowNotification(!showNotification)}
                        className={`relative transition-transform focus:outline-none ${isShaking ? "animate-bell-shake":""}`}
                        aria-label={isShaking ? "Stop notification bell animation" : "Start notification bell animation"}
                    >
                        <Bell color='white'/>
                        {isShaking && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
                        </span>
                        )}
                    </button>
                    <NotificationBox notifications={notifications} setNotifications={setNotifications} role={role} isOpen={showNotification} setIsOpen={setShowNotification} />
                    <button className="text-white p-2" onClick={handleClick} >LogOut</button>
                </div>
            </div>
        </div>
    )
}

export default Navbar;