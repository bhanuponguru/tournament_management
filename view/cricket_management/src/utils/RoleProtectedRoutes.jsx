import { Outlet, Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";
import axios from "../api/axios";

const RoleProtectedRoutes = ({ role1, role2 = null }) => {
    const [cookies] = useCookies(["token"]);
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        const verifyRole = async (role) => {
            try {
                await axios.get(`/users/verify_role/?role=${role}`, {
                    headers: { Authorization: `Bearer ${cookies.token}` },
                });
                return true;
            } catch {
                return false;
            }
        };

        const checkRoles = async () => {
            const role1Valid = await verifyRole(role1);
            const role2Valid = await verifyRole(role2);
            setIsAuthorized(role1Valid || role2Valid);
        };

        checkRoles();
    }, [cookies.token, role1, role2]);

    if (isAuthorized === null)
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="text-white text-lg font-semibold animate-pulse">
                    Loading...
                </div>
            </div>
        );

    return isAuthorized ? <Outlet /> : <Navigate to="/request_role" />;
};

export default RoleProtectedRoutes;
