import {Outlet , Navigate} from "react-router-dom";
import { useCookies } from "react-cookie";

const RoleProtectedRoutes = (role) => {
    const [cookies] = useCookies(["token"]);
    const user = cookies.token? true: false;
    return user ? <Outlet /> : <Navigate to="/login" />;
}

export default RoleProtectedRoutes;