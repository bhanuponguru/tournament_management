import { useState,useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios";
import { useCookies } from "react-cookie";

const ManagerPortalHome = () => {
  const [cookies] = useCookies(["token"]);
  const [addTournmant, setAddTournmant] = useState(false);
  const [showTornamentForm, setShowTornamentForm] = useState(false);
  const [tournamentName, setTournamentName] = useState("");
  const [tournamentFormat, setTournamentFormat] = useState("T20");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [organizerEmail, setOrganizerEmail] = useState("");

  const handleSubmit = () => {
    if (!tournamentName || !startDate || !endDate || !managerEmail || !organizerEmail) {
      alert("Please fill all the fields");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      alert("Start Date should be less than End Date");
      return;
    }
    const data = {
      name: tournamentName,
      format: tournamentFormat,
      start_date: startDate,
      end_date: endDate,
      manager_email: managerEmail,
      organizer_email: organizerEmail,
    };

    axios.post("/tournaments/create", data, {
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    })
    .then((response) => {
      setShowTornamentForm(false);
      setTournamentName("");
      setTournamentFormat("T20");
      setStartDate("");
      setEndDate("");
      setManagerEmail("");
      setOrganizerEmail("");
      alert(response.data.message);
    })
    .catch((error) => {
      alert(error.response.data.detail);
      console.log(error);
    });
  };

  useLayoutEffect(() => {
    axios.get("/tournaments", {
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    })
    .then((response) => {
      setAddTournmant(response.data.length === 0);
    })
    .catch((error) => console.log(error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Cricket Management Portal</h1>
      <div className="flex flex-col items-center gap-4 mb-6">
        {addTournmant ? (
          <p className="text-red-400">No tournaments available. Please add one first.</p>
        ) : (
          <div className="flex flex-col gap-4 w-full max-w-md">
            <Link to="/manager_portal/teams" className="bg-blue-600 px-6 py-3 rounded-lg text-center hover:bg-blue-700">
              Add Teams
              <p className="text-sm text-gray-300">Register teams for the tournament.</p>
            </Link>
            <Link to="/manager_portal/tournmant" className="bg-blue-600 px-6 py-3 rounded-lg text-center hover:bg-blue-700">
              Add Matches
              <p className="text-sm text-gray-300">Schedule matches for the tournament.</p>
            </Link>
            <Link to="/manager_portal/score" className="bg-blue-600 px-6 py-3 rounded-lg text-center hover:bg-blue-700">
              Add Score
              <p className="text-sm text-gray-300">Update match scores.</p>
            </Link>
          </div>
        )}
        <button onClick={() => setShowTornamentForm(true)} className="bg-green-600 px-6 py-3 rounded-lg hover:bg-green-700">
          Add Tournament
          <p className="text-sm text-gray-300">Create a new tournament.</p>
        </button>
      </div>
      {showTornamentForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80">
          <div className="bg-gray-800 text-white p-6 rounded-lg w-96">
            <div className="flex justify-end">
              <button onClick={() => setShowTornamentForm(false)} className="text-gray-400 hover:text-white">&times;</button>
            </div>
            <h2 className="text-xl font-semibold mb-4">Create Tournament</h2>
            <label className="block mb-1">Tournament Name</label>
            <input className="w-full p-2 mb-2 bg-gray-700 rounded" placeholder="Tournament Name" value={tournamentName} onChange={(e) => setTournamentName(e.target.value)} />
            <label className="block mb-1">Tournament Format</label>
            <select className="w-full p-2 mb-2 bg-gray-700 rounded" value={tournamentFormat} onChange={(e) => setTournamentFormat(e.target.value)}>
              <option value="T20">T20</option>
              <option value="ODI">ODI</option>
              <option value="Test">Test</option>
            </select>
            <label className="block mb-1">Start Date</label>
            <input className="w-full p-2 mb-2 bg-gray-700 rounded" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <label className="block mb-1">End Date</label>
            <input className="w-full p-2 mb-2 bg-gray-700 rounded" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <label className="block mb-1">Manager Email</label>
            <input className="w-full p-2 mb-2 bg-gray-700 rounded" placeholder="Manager Email" value={managerEmail} onChange={(e) => setManagerEmail(e.target.value)} />
            <label className="block mb-1">Organizer Email</label>
            <input className="w-full p-2 mb-4 bg-gray-700 rounded" placeholder="Organizer Email" value={organizerEmail} onChange={(e) => setOrganizerEmail(e.target.value)} />
            <button onClick={handleSubmit} className="w-full bg-blue-600 p-2 rounded-lg hover:bg-blue-700">Add Tournament</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerPortalHome;