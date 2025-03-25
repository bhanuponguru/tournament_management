import {React, useState} from 'react'
import axios from 'axios';
import {Navigate} from "react-router-dom";
import {useCookies} from 'react-cookie';

const Login = () => {
    const [onLogin, setOnLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    
    if(cookies.token){
        return <Navigate to="/" />
    }
    
    const handleLogin = () => {
        const base_url = process.env.REACT_APP_baseUrl;
        const url = base_url + "/users/login";
        axios.post(url, {
            email: email,
            password: password
        }).then((response) => {
            setCookie('token', response.data.access_token, {path: '/', maxAge: 604800});
        }).catch((error) => {
            console.log(error);
            setError("Invalid Credentials");
        })
        setEmail("");
        setPassword("");
    }
    
    const hadleSignup = () => {
        const base_url = process.env.REACT_APP_baseUrl;
        const url = base_url + "/users/register";
        axios.post(url, {
            email: email,
            password: password,
            name: name
        }).then((response) => {
            setMessage("Signup Successful Please login to continue");
            setOnLogin(true);
        }).catch((error) => {
            console.log(error);
            setError(error);
        })
        setEmail("");
        setName("");
        setPassword("");
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-6">
            <div className="w-full max-w-md bg-gray-800 rounded-lg p-6 shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-4">Cricket Management</h1>
                
                <div className="flex mb-6 rounded-lg overflow-hidden">
                    <div 
                        onClick={() => {setOnLogin(true); setError('')}}  
                        className={`flex justify-center w-1/2 py-3 cursor-pointer transition-colors ${onLogin ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-700 hover:bg-gray-600"}`}
                    >
                        Login
                    </div>
                    <div 
                        onClick={() => {setOnLogin(false); setError('')}}  
                        className={`flex justify-center w-1/2 py-3 cursor-pointer transition-colors ${onLogin ? "bg-gray-700 hover:bg-gray-600" : "bg-blue-600 hover:bg-blue-700"}`}
                    >
                        Sign Up
                    </div>
                </div>
                
                <div className="mb-4">
                    {message && <div className="text-center text-green-400 p-2 bg-green-900/30 rounded mb-2">{message}</div>}
                    {error && <div className="text-center text-red-400 p-2 bg-red-900/30 rounded mb-2">{error}</div>}
                </div>
                
                {onLogin ? (
                    <div className="flex flex-col">
                        <div className="mb-4">
                            <label className="block mb-1" htmlFor="email">Email</label>
                            <input 
                                value={email} 
                                onChange={(e) => {setEmail(e.target.value)}} 
                                className="w-full p-2 bg-gray-700 rounded" 
                                type="email" 
                                id="email" 
                                placeholder="Enter your email" 
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1" htmlFor="password">Password</label>
                            <input 
                                value={password} 
                                onChange={(e) => {setPassword(e.target.value)}} 
                                className="w-full p-2 bg-gray-700 rounded" 
                                id="password" 
                                type="password" 
                                placeholder="Enter your password" 
                            />
                        </div>
                        <button 
                            onClick={handleLogin} 
                            className="w-full bg-blue-600 p-3 rounded-lg hover:bg-blue-700 transition-colors mt-2"
                        >
                            Login
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <div className="mb-4">
                            <label className="block mb-1" htmlFor="email">Email</label>
                            <input 
                                value={email} 
                                onChange={(e) => {setEmail(e.target.value)}} 
                                className="w-full p-2 bg-gray-700 rounded" 
                                type="email" 
                                id="email" 
                                placeholder="Enter your email" 
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1" htmlFor="name">Name</label>
                            <input 
                                value={name} 
                                onChange={(e) => {setName(e.target.value)}} 
                                className="w-full p-2 bg-gray-700 rounded" 
                                id="name" 
                                type="text" 
                                placeholder="Enter your name" 
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1" htmlFor="password">Password</label>
                            <input 
                                value={password} 
                                onChange={(e) => {setPassword(e.target.value)}} 
                                className="w-full p-2 bg-gray-700 rounded" 
                                id="password" 
                                type="password" 
                                placeholder="Create a password" 
                            />
                        </div>
                        <button 
                            onClick={hadleSignup} 
                            className="w-full bg-blue-600 p-3 rounded-lg hover:bg-blue-700 transition-colors mt-2"
                        >
                            Sign Up
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Login