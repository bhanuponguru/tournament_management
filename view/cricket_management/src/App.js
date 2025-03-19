import Home from './components/Home';
import Login from './components/Login';
import ProtectedRoutes from './utils/ProtectedRoutes';
import './index.css';
import NotFound from './components/404NotFound';
import ManagerPortalHome from './components/manager_portal/ManagerPortalHome';
import ScorePortal from './components/manager_portal/ScorePortal';
import TeamsPortal from './components/manager_portal/TeamsPortal';
import TornmentPortal from './components/manager_portal/TornmentPortal';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import RoleProtectedRoutes from './utils/RoleProtectedRoutes';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Home />} />
          <Route element={<RoleProtectedRoutes role1 = {"manager"} role2 = {"organizer"} />}>
            <Route path="/manager_portal" element={<ManagerPortalHome />} />
            <Route path="/manager_portal/score" element={<ScorePortal />} />
            <Route path="/manager_portal/teams" element={<TeamsPortal />} />
            <Route path="/manager_portal/tournmant" element={<TornmentPortal />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
