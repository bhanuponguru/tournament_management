import {React, useState, useLayoutEffect, useEffect} from 'react'
import { useCookies } from "react-cookie";
import axios from "../../api/axios";
import { Link } from "react-router-dom";
import Navbar from './utils/Navbar';

const TournmentPortal = () => {
  const [cookies] = useCookies(["token"]);
  const [selectedTournament, setSelectedTournament] = useState("");
  const [tournaments, setTournaments] = useState([]);
  const [noTeam, setNoTeam] = useState(false);
  const [teams, setTeams] = useState([]);
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [team_A, setTeam_A] = useState("");
  const [team_B, setTeam_B] = useState("");
  const [loadingTournaments, setLoadingTournaments] = useState(true);
  const [loadingTeams, setLoadingTeams] = useState(false);

  useLayoutEffect(() => {
    const getTournaments = async () => {
      try {
        setLoadingTournaments(true);
        const response = await axios.get("/tournaments", {
          headers: { Authorization: `Bearer ${cookies.token}` },
        });
        setTournaments(response.data);
        setLoadingTournaments(false);
      } catch (error) {
        console.log(error);
        setLoadingTournaments(false);
      }
    }
    getTournaments();
  },[]);

  useEffect(() => {
    if(selectedTournament !== "") {
      getTeams(selectedTournament);
    }
  },[selectedTournament]);

  const getTeams = async (id) => {
    try {
      setLoadingTeams(true);
      const response = await axios.get(`/teams/?tournament_id=${id}`, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });
      setTeams(response.data);
      if(response.data.length <= 1) {
        setNoTeam(true);
      }
      else {
        setNoTeam(false);
      }
      setLoadingTeams(false);
    } catch (error) {
      console.log(error);
      setLoadingTeams(false);
    }
  }

  const createMatch = async()=>{
    if(!date || !location || !team_A || !team_B) {
      alert("Please fill all the fields");
      return;
    }
    try {
      const response = await axios.post("/matches/create", {
        team_a_id: team_A,
        team_b_id: team_B,
        date_time: date,
        location: location,
        tournament_id: selectedTournament
      },{
        headers: { Authorization: `Bearer ${cookies.token}` },
      });
      alert("Match Created Successfully");
    } catch (error) {
      console.log(error);
    }
  }

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <Navbar />
      <h1 className="text-3xl font-bold text-center mb-6">Tournament Match Portal</h1>
      
      <div className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="tournmant" className="block mb-1"> 
            Select Tournament 
          </label>
          {loadingTournaments ? (
            <LoadingSpinner />
          ) : (
            <select 
              onChange={(e)=>{setSelectedTournament(e.target.value)}} 
              value={selectedTournament} 
              name="tournmant" 
              id="tournmant"
              className="w-full p-2 bg-gray-700 rounded"
            >
              <option value={""}>Select Tournament</option>
              {tournaments.map((tournament,key) => (
                <option key={key} value={tournament.tournament_id}>
                  {tournament.tournament_name}
                </option>
              ))}
            </select>
          )}
        </div>

        {noTeam && (
          <div className="bg-red-900/30 p-4 rounded-lg mb-4">
            <p className="text-red-400">
              Not enough teams available for this tournament. Please 
              <Link to="/manager_portal/teams" className="text-blue-400 ml-1 underline">
                add teams first
              </Link>
            </p>
          </div>
        )}

        {selectedTournament && !noTeam && (
          <div className="space-y-4">
            <div>
              <label htmlFor="team_a" className="block mb-1">Select Team A</label>
              {loadingTeams ? (
                <LoadingSpinner />
              ) : (
                <select 
                  onChange={(e) => setTeam_A(e.target.value)} 
                  value={team_A} 
                  name="team_a" 
                  id="team_a"
                  className="w-full p-2 bg-gray-700 rounded"
                >
                  <option value="">Select Team A</option>
                  {teams.map((team) => (
                    <option 
                      key={team.team_id} 
                      value={team.team_id} 
                      disabled={team.team_id == team_B}
                    >
                      {team.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label htmlFor="team_b" className="block mb-1">Select Team B</label>
              {loadingTeams ? (
                <LoadingSpinner />
              ) : (
                <select 
                  onChange={(e) => setTeam_B(e.target.value)} 
                  value={team_B} 
                  name="team_b" 
                  id="team_b"
                  className="w-full p-2 bg-gray-700 rounded"
                >
                  <option value="">Select Team B</option>
                  {teams.map((team) => (
                    <option 
                      key={team.team_id} 
                      value={team.team_id} 
                      disabled={team.team_id == team_A}
                    >
                      {team.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label htmlFor="date" className="block mb-1">Match Date</label>
              <input 
                onChange={(e)=>setDate(e.target.value)} 
                type="datetime-local" 
                name="date" 
                id="date" 
                className="w-full p-2 bg-gray-700 rounded"
              />
            </div>
            <div>
              <label htmlFor="location" className="block mb-1">Match Location</label>
              <input 
                onChange={(e)=>setLocation(e.target.value)} 
                type="text" 
                name="location" 
                id="location" 
                placeholder="Enter match location"
                className="w-full p-2 bg-gray-700 rounded"
              />
            </div>
            <button 
              onClick={createMatch} 
              className="w-full bg-blue-600 p-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Match
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TournmentPortal