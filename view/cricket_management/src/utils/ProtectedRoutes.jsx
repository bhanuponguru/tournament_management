import { Outlet, Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";
import axios from "../api/axios";

const ProtectedRoutes = () => {
    const [cookies] = useCookies(["token"]);
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const verifyToken = async () => {
            if (!cookies.token) {
                setIsAuthenticated(false);
                return;
            }

            try {
                await axios.get("/users/verify", {
                    headers: { Authorization: `Bearer ${cookies.token}` },
                });
                setIsAuthenticated(true);
            } catch (error) {
                console.log(error);
                setIsAuthenticated(false);
            }
        };

        verifyToken();
    }, [cookies.token]);

    if (isAuthenticated === null) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="text-white text-lg font-semibold animate-pulse">
                    Verifying...
                </div>
            </div>
        );
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
