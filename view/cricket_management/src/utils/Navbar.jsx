import {Link} from 'react-router-dom';
import {React, useState, useLayoutEffect} from 'react';
import {useCookies} from 'react-cookie';
import { Bell } from "lucide-react"
import axios from '../api/axios';
import NotificationBox from './NotificationBox';

const Navbar = () => {
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
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
        window.location.href = "/login";
    }
    
    return (
        <div className="w-full fixed top-0 left-0 z-30">
            <div className="bg-gray-900 bg-[url(https://c0.wallpaperflare.com/path/967/82/462/australia-richmond-melbourne-cricket-ground-cricket-371772744fa62261f54850a915da5c9b.jpg)] text-white bg-cover bg-center relative">
                <div className="absolute inset-0 bg-black/70"></div>
                    <div className="flex justify-between items-center relative z-10 p-4">
                    <div className="text-white text-2xl font-bold">Cricket Management</div>
                    
                    <div className="flex items-center gap-3">
                        <Link to="/" className="px-4 py-2 bg-white/20 rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300 text-white">
                            Home
                        </Link>
                        
                        <Link to="/matches" className="px-4 py-2 bg-white/20 rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300 text-white">
                            Matchs
                        </Link>
                        
                        <Link to="/pointstable" className="px-4 py-2 bg-white/20 rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300 text-white">
                            Point Table
                        </Link>
                        
                        {role === 'admin' ? null :
                         role === 'viewer' ? 
                            <Link to="/request_role" className="px-4 py-2 bg-white/20 rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300 text-white">
                                Request Role
                            </Link> : 
                         role === 'manager' ? 
                            <Link to="/manager_portal" className="px-4 py-2 bg-white/20 rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300 text-white">
                                Managment Portal
                            </Link> :
                         <p className="text-white px-4 py-2">Loading...</p>
                        }
                        
                        <button
                            onClick={() => setShowNotification(!showNotification)}
                            className={`relative p-2 bg-white/20 rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300 ${isShaking ? "animate-bell-shake" : ""}`}
                            aria-label={isShaking ? "Stop notification bell animation" : "Start notification bell animation"}
                        >
                            <Bell color='white' size={20} />
                            {isShaking && (
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
                                </span>
                            )}
                        </button>
                        
                        <button 
                            onClick={handleClick} 
                            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 text-white"
                        >
                            LogOut
                        </button>
                    </div>
                </div>
            </div>
            
            <NotificationBox 
                notifications={notifications} 
                setNotifications={setNotifications} 
                role={role} 
                isOpen={showNotification} 
                setIsOpen={setShowNotification} 
            />
        </div> 
    )
}

export default Navbar;