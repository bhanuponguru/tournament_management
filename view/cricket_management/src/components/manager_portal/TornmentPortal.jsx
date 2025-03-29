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
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
    </div>
  );

  return (
    <div
      className="min-h-screen bg-[url(https://c0.wallpaperflare.com/path/967/82/462/australia-richmond-melbourne-cricket-ground-cricket-371772744fa62261f54850a915da5c9b.jpg)] bg-gray-900 text-white p-6 bg-cover bg-center"
      
    >
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="relative z-30">
        <Navbar />
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto bg-white/10 rounded-3xl overflow-hidden shadow-2xl mt-8">
        <div className="w-full p-8 relative z-20">
          <h1 className="text-4xl font-bold text-center mb-8 text-white">Tournament Match Portal</h1>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="tournmant" className="block mb-2 text-sm font-semibold">
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
                  className="w-full p-3 bg-white/20 rounded-lg border border-white/30 focus:ring-2 focus:ring-white/50 transition-all duration-300 text-white"
                >
                  <option value={""} className="bg-gray-900 text-white">Select Tournament</option>
                  {tournaments.map((tournament,key) => (
                    <option key={key} value={tournament.tournament_id} className="bg-gray-900 text-white">
                      {tournament.tournament_name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {noTeam && (
              <div className="bg-red-500/20 p-4 rounded-lg border border-red-500/50">
                <p className="text-red-200">
                  Not enough teams available for this tournament. Please 
                  <Link to="/manager_portal/teams" className="text-blue-300 ml-1 underline">
                    add teams first
                  </Link>
                </p>
              </div>
            )}

            {selectedTournament && !noTeam && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="team_a" className="block mb-2 text-sm font-semibold">Select Team A</label>
                  {loadingTeams ? (
                    <LoadingSpinner />
                  ) : (
                    <select 
                      onChange={(e) => setTeam_A(e.target.value)} 
                      value={team_A} 
                      name="team_a" 
                      id="team_a"
                      className="w-full p-3 bg-white/20 rounded-lg border border-white/30 focus:ring-2 focus:ring-white/50 transition-all duration-300 text-white"
                    >
                      <option value="" className="bg-gray-900 text-white">Select Team A</option>
                      {teams.map((team) => (
                        <option 
                          key={team.team_id} 
                          value={team.team_id} 
                          disabled={team.team_id == team_B}
                          className="bg-gray-900 text-white"
                        >
                          {team.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label htmlFor="team_b" className="block mb-2 text-sm font-semibold">Select Team B</label>
                  {loadingTeams ? (
                    <LoadingSpinner />
                  ) : (
                    <select 
                      onChange={(e) => setTeam_B(e.target.value)} 
                      value={team_B} 
                      name="team_b" 
                      id="team_b"
                      className="w-full p-3 bg-white/20 rounded-lg border border-white/30 focus:ring-2 focus:ring-white/50 transition-all duration-300 text-white"
                    >
                      <option value="" className="bg-gray-900 text-white">Select Team B</option>
                      {teams.map((team) => (
                        <option 
                          key={team.team_id} 
                          value={team.team_id} 
                          disabled={team.team_id == team_A}
                          className="bg-gray-900 text-white"
                        >
                          {team.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label htmlFor="date" className="block mb-2 text-sm font-semibold">Match Date</label>
                  <input 
                    onChange={(e)=>setDate(e.target.value)} 
                    type="datetime-local" 
                    name="date" 
                    id="date" 
                    className="w-full p-3 bg-white/20 rounded-lg border border-white/30 focus:ring-2 focus:ring-white/50 transition-all duration-300 text-white"
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block mb-2 text-sm font-semibold">Match Location</label>
                  <input 
                    onChange={(e)=>setLocation(e.target.value)} 
                    type="text" 
                    name="location" 
                    id="location" 
                    placeholder="Enter match location"
                    className="w-full p-3 bg-white/20 rounded-lg border border-white/30 focus:ring-2 focus:ring-white/50 transition-all duration-300 text-white"
                  />
                </div>
                <button 
                  onClick={createMatch} 
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 shadow-lg"
                >
                  Create Match
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TournmentPortal