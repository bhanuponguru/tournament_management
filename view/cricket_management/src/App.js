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
import PointsTable from './components/PointsTable';
import Matches from './components/Matches';
import Requestrole from './utils/Requestrole';
function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Home />} />
          <Route path="/matches" element={<Matches />} /> 
          <Route path="/pointstable" element={<PointsTable />} /> 
          <Route element={<RoleProtectedRoutes role1 = {"manager"} role2 = {"organizer"} />}>
            <Route path="/manager_portal" element={<ManagerPortalHome />} />
            <Route path="/manager_portal/score" element={<ScorePortal />} />
            <Route path="/manager_portal/teams" element={<TeamsPortal />} />
            <Route path="/manager_portal/tournmant" element={<TornmentPortal />} />
          </Route>
          <Route element={<RoleProtectedRoutes role1 = {"viewer"} />}>
            <Route path="/request_role" element={<Requestrole />} />
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
