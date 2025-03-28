import {React, useState, useLayoutEffect, useEffect} from 'react'
import axios from '../../api/axios';
import {useCookies} from 'react-cookie';
import Navbar from './utils/Navbar';

const TeamsPortal = () => {
  const [cookies] = useCookies(["token"]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedTeamObj, setSelectedTeamObj] = useState({});
  const [isCaptain, setIsCaptain] = useState(false);
  const [noTeam, setNoTeam] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState("");
  const [selectedTournamentObj, setSelectedTournamentObj] = useState({});
  const [teamName, setTeamName] = useState("");
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [teams, setTeams] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [loadingTournaments, setLoadingTournaments] = useState(true);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // All existing functions remain unchanged
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

  const setSelectedTournamentOject = (id)=> {
    if(id === "") {
      return;
    }
    tournaments.find((tournament) => {
      if(tournament.tournament_id === id) {
        setSelectedTournamentObj(tournament);
      }
    });
  }

  const setSelectedTeamObject = (id)=>{
    if(id === "") {
      return;
    }
    teams.map((team) => {if(team.team_id == id) {setSelectedTeamObj(team);}});
  }

  const getTeams = async (id) => {
    try {
      setLoadingTeams(true);
      const response = await axios.get(`/teams/?tournament_id=${id}`, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });
      setTeams(response.data);
      if(response.data.length === 0) {
        setNoTeam(true);
      }
      else {
        setNoTeam(false);
      }
      setLoadingTeams(false);
    } 
    catch (error) {
      console.log(error);
      setLoadingTeams(false);
    }
  }

  const hanadleAddPlayer = async()=>{
    setSubmitLoading(true);
    if(!selectedTeam) {
      alert("Please select a team");
      return;
    }
    if(!playerName) {
      alert("Please fill the player name");
      return;
    }
    const data = {
      name: playerName,
      team_id: selectedTeam,
      is_captain: isCaptain,
    }
    try {
      const response = await axios.post("/players/create", data, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });
      alert(response.data.message);
      setShowPlayerForm(false);
      setPlayerName("");
      if(isCaptain) {
        setIsCaptain(false);
        getTeams(selectedTournament);
        teams.map((team) => {if(team.team_id === selectedTeam) {setSelectedTeamObj(team);}});
      }
    }
    catch(error) {
      console.log(error);
    }
    setSubmitLoading(false);
  }

  const handleAddTeam = async()=>{
    setSubmitLoading(true);
    if(!selectedTournament) {
      alert("Please select a tournament");
      return;
    }
    if(!teamName) {
      alert("Please fill the team name");
      return;
    }
    const data = {
      name: teamName,
      tournament_id: selectedTournament,
    }
    try {
      const response = await axios.post("/teams/create", data, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });
      alert(response.data.message);
      setShowTeamForm(false);
      setTeamName("");
      getTeams(selectedTournament);
    } catch (error) {
      console.log(error);
    }
    setSubmitLoading(false);
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
          <h1 className="text-4xl font-bold text-center mb-8 text-white">Team Portal</h1>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="tournmant" className="block mb-2 text-sm font-semibold">
                Select Tournament where you want to add a player
              </label>
              {loadingTournaments ? (
                <LoadingSpinner />
              ) : (
                <select 
                  onChange={(e)=>{setSelectedTournament(e.target.value);setSelectedTournamentOject(e.target.value)}} 
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

            {selectedTournament && teams.length !== 0 && (
              <div>
                <label htmlFor="teams" className="block mb-2 text-sm font-semibold">
                  Select Team where you want to add a player
                </label>
                {loadingTeams ? (
                  <LoadingSpinner />
                ) : (
                  <select 
                    onChange={(e)=>{setSelectedTeam(e.target.value); setSelectedTeamObject(e.target.value);}} 
                    value={selectedTeam}  
                    name="teams" 
                    id="teams"
                    className="w-full p-3 bg-white/20 rounded-lg border border-white/30 focus:ring-2 focus:ring-white/50 transition-all duration-300 text-white"
                  >
                    <option value={""} className="bg-gray-900 text-white">Select Team</option>
                    {teams.map((team,key) => (
                      <option key={key} value={team.team_id} className="bg-gray-900 text-white">
                        {team.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}
            
            {noTeam && (
              <div className="bg-red-500/20 p-4 rounded-lg border border-red-500/50">
                <p className="text-red-200">No Teams Available. Please add team before adding players.</p>
              </div>
            )}
            
            <div className="flex gap-6 justify-center mt-8">
              {selectedTeam !== "" && selectedTournament !== "" && !noTeam && (
                <button 
                  onClick={()=>{setShowPlayerForm(true)}} 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 shadow-lg"
                >
                  <span className="block text-lg font-semibold">Add Player</span>
                  <span className="block text-sm text-white/80 mt-1">Add player to selected team</span>
                </button>
              )}
              <button 
                onClick={()=>{setShowTeamForm(true)}} 
                className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 shadow-lg"
              >
                <span className="block text-lg font-semibold">Add Team</span>
                <span className="block text-sm text-white/80 mt-1">Create a new team</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal for Add Player */}
      {showPlayerForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 w-96 shadow-2xl border border-white/30">
            <div className="flex justify-end">
              <button 
                onClick={() => setShowPlayerForm(false)} 
                className="bg-white/20 p-1 rounded-full hover:bg-white/30 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <h2 className="text-2xl font-bold mb-6 text-white">Add Player</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-semibold">Player Name</label>
                <input 
                  type="text" 
                  value={playerName} 
                  onChange={(e)=>{setPlayerName(e.target.value)}} 
                  name="player" 
                  id="player" 
                  className="w-full p-3 bg-white/20 rounded-lg border border-white/30 focus:ring-2 focus:ring-white/50 transition-all duration-300 text-white"
                  placeholder="Enter player name"
                />
              </div>
              
              {!selectedTeamObj.captain_id && (
                <div>
                  <button 
                    onClick={()=>{setIsCaptain(!isCaptain)}} 
                    className={`w-full p-3 rounded-lg transition-all duration-300 ${
                      isCaptain 
                        ? "bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700" 
                        : "bg-white/20 hover:bg-white/30"
                    }`}
                  >
                    {isCaptain ? "Captain Selected ✓" : "Set as Captain"}
                  </button>
                </div>
              )}
              
              <button 
                onClick={hanadleAddPlayer}
                disabled={submitLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold disabled:opacity-50"
              >
                {submitLoading ? <LoadingSpinner /> : "Add Player"}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal for Add Team */}
      {showTeamForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 w-96 shadow-2xl border border-white/30">
            <div className="flex justify-end">
              <button 
                onClick={() => setShowTeamForm(false)} 
                className="bg-white/20 p-1 rounded-full hover:bg-white/30 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <h2 className="text-2xl font-bold mb-6 text-white">Create Team</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-semibold">Team Name</label>
                <input 
                  type="text" 
                  value={teamName} 
                  onChange={(e)=>{setTeamName(e.target.value)}} 
                  name="team" 
                  id="team" 
                  className="w-full p-3 bg-white/20 rounded-lg border border-white/30 focus:ring-2 focus:ring-white/50 transition-all duration-300 text-white"
                  placeholder="Enter team name"
                />
              </div>
              
              <button 
                onClick={handleAddTeam}
                disabled={submitLoading}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 p-4 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-300 font-semibold disabled:opacity-50"
              >
                {submitLoading ? <LoadingSpinner /> : "Add Team"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeamsPortal