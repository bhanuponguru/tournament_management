import React, { useState } from "react";
import axios from "../api/axios";
import { Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const Login = () => {
    const [onLogin, setOnLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);

    if (cookies.token) {
        return <Navigate to="/" />;
    }

    const handleLogin = () => {
        axios
            .post("/users/login", {
                email: email,
                password: password,
            })
            .then((response) => {
                setCookie("token", response.data.access_token, {
                    path: "/",
                    maxAge: 604800,
                });
            })
            .catch((error) => {
                console.log(error);
                setError("Invalid Credentials");
            });
        setEmail("");
        setPassword("");
    };

    const handleSignup = () => {
        axios
            .post("/users/register", {
                email: email,
                password: password,
                name: name,
            })
            .then((response) => {
                setMessage("Signup Successful. Please login to continue.");
                setOnLogin(true);
            })
            .catch((error) => {
                console.log(error);
                setError(error.response.data.detail);
            });
        setEmail("");
        setName("");
        setPassword("");
    };

    return (
        <div
            className="flex bg-[url(https://c0.wallpaperflare.com/path/967/82/462/australia-richmond-melbourne-cricket-ground-cricket-371772744fa62261f54850a915da5c9b.jpg)] items-center justify-center min-h-screen bg-gray-900 text-white p-6 bg-cover bg-center"

        >
            <div className="w-full max-w-5xl bg-white/10 rounded-3xl overflow-hidden shadow-2xl flex">

                <div
                    className="w-1/2 bg-[url(https://c0.wallpaperflare.com/path/967/82/462/australia-richmond-melbourne-cricket-ground-cricket-371772744fa62261f54850a915da5c9b.jpg)] relative bg-cover bg-center flex flex-col justify-end p-8 text-white"

                >
                    <div className="absolute inset-0 bg-black/50"></div>
                    <div className="relative z-10">
                        <h1 className="text-4xl font-bold mb-4 text-center">
                            Master the Game, Lead the Tournament
                        </h1>
                        <p className="text-lg opacity-80">
                            Your passion, strategy, and teamwork drive the spirit
                            of cricket. Manage tournaments, track performances, and
                            transform potential into victory.
                        </p>
                    </div>
                </div>


                <div className="w-1/2 bg-white p-8 flex items-center justify-center">
                    <div className="w-full max-w-md">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-800">
                                {onLogin ? "Welcome Back" : "Create Account"}
                            </h1>
                        </div>

                        <div className="flex mb-6 bg-gray-100 rounded-full p-1">
                            <button
                                onClick={() => {
                                    setOnLogin(true);
                                    setError("");
                                }}
                                className={`w-1/2 py-2 rounded-full transition-all duration-300 ${
                                    onLogin
                                        ? "bg-black text-white shadow-lg transform -translate-y-1"
                                        : "text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => {
                                    setOnLogin(false);
                                    setError("");
                                }}
                                className={`w-1/2 py-2 rounded-full transition-all duration-300 ${
                                    !onLogin
                                        ? "bg-black text-white shadow-lg transform -translate-y-1"
                                        : "text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                Sign Up
                            </button>
                        </div>

                        {message && (
                            <div className="text-[#10B981] text-sm mb-4 text-center bg-green-900/20 p-2 rounded-lg">
                                {message}
                            </div>
                        )}
                        {error && (
                            <div className="text-[#EF4444] text-sm mb-4 text-center bg-red-900/20 p-2 rounded-lg">
                                {error}
                            </div>
                        )}
                        <form className="space-y-4">

                            {!onLogin && (
                                <div>
                                    <label className="block text-gray-700 mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your name"
                                        className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300 hover:shadow-md text-black"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300 hover:shadow-md text-black"
                                />
                            </div>


                            <div>
                                <label className="block text-gray-700 mb-2">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300 hover:shadow-md text-black"
                                />
                            </div>


                            <button
                                type="button"
                                onClick={onLogin ? handleLogin : handleSignup}
                                className="w-full bg-black text-white py-3 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
                            >
                                {onLogin ? "Sign In" : "Create Account"}
                            </button>
                        </form>


                        <div className="text-center mt-6 text-gray-600">
                            {onLogin
                                ? "Don't have an account? "
                                : "Already have an account? "}
                            <button
                                onClick={() => setOnLogin(!onLogin)}
                                className="text-black font-bold ml-1 hover:underline"
                            >
                                {onLogin ? "Sign Up" : "Login"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;