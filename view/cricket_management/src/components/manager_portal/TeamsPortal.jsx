import {React, useState, useLayoutEffect, useEffect} from 'react'
import axios from '../../api/axios';
import {useCookies} from 'react-cookie';

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
    } catch (error) {
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
    } catch (error) {
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
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Team Portal</h1>
      <div className="max-w-md mx-auto mb-6">
        <div className="mb-4">
          <label htmlFor="tournmant" className="block mb-1"> 
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
              className="w-full p-2 bg-gray-700 rounded"
            >
              <option value={""}>Select Tournament</option>
              {tournaments.map((tournament,key) => {return (
                <option key={key} value={tournament.tournament_id}>
                  {tournament.tournament_name}
                </option>
              )})}
            </select>
          )}
        </div>

        {selectedTournament && teams.length !== 0 && (
          <div className="mb-4">
            <label htmlFor="teams" className="block mb-1">
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
                className="w-full p-2 bg-gray-700 rounded"
              >
                <option value={""}>Select Team</option>
                {teams.map((team,key) => {return (
                  <option key={key} value={team.team_id}>
                    {team.name}
                  </option>
                )})}
              </select>
            )}
          </div>
        )}
        
        {noTeam && (
          <div className="mb-4">
            <p className="text-red-400">No Teams Available. Please add team before adding players.</p>
          </div>
        )}
        
        <div className="flex gap-4 justify-center mt-6">
          {selectedTeam !== "" && selectedTournament !== "" && !noTeam && (
            <button 
              onClick={()=>{setShowPlayerForm(true)}} 
              className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Add Player
              <p className="text-sm text-gray-300">Add player to selected team</p>
            </button>
          )}
          <button 
            onClick={()=>{setShowTeamForm(true)}} 
            className="bg-green-600 px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Add Team
            <p className="text-sm text-gray-300">Create a new team</p>
          </button>
        </div>
      </div>

      {showPlayerForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80">
          <div className="bg-gray-800 text-white p-6 rounded-lg w-96">
            <div className="flex justify-end">
              <button onClick={() => setShowPlayerForm(false)} className="text-gray-400 hover:text-white">&times;</button>
            </div>
            <h2 className="text-xl font-semibold mb-4">Add Player</h2>
            <label className="block mb-1">Player Name</label>
            <input 
              type="text" 
              value={playerName} 
              onChange={(e)=>{setPlayerName(e.target.value)}} 
              name="player" 
              id="player" 
              className="w-full p-2 mb-4 bg-gray-700 rounded"
              placeholder="Enter player name"
            />
            {!selectedTeamObj.captain_id && (
              <div className="mb-4">
                <button 
                  onClick={()=>{setIsCaptain(!isCaptain)}} 
                  className={`${isCaptain ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 hover:bg-gray-700"} rounded-lg p-2 w-full`}
                >
                  {isCaptain ? "Captain Selected" : "Set as Captain"}
                </button>
              </div>
            )}
            <button 
              onClick={hanadleAddPlayer}
              disabled={submitLoading}
              className="w-full bg-blue-600 p-2 rounded-lg hover:bg-blue-700"
            >
              Add Player
            </button>
          </div>
        </div>
      )}
      
      {showTeamForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80">
          <div className="bg-gray-800 text-white p-6 rounded-lg w-96">
            <div className="flex justify-end">
              <button onClick={() => setShowTeamForm(false)} className="text-gray-400 hover:text-white">&times;</button>
            </div>
            <h2 className="text-xl font-semibold mb-4">Create Team</h2>
            <label className="block mb-1">Team Name</label>
            <input 
              type="text" 
              value={teamName} 
              onChange={(e)=>{setTeamName(e.target.value)}} 
              name="team" 
              id="team" 
              className="w-full p-2 mb-4 bg-gray-700 rounded"
              placeholder="Enter team name"
            />
            <button 
              onClick={handleAddTeam}
              disabled={submitLoading}
              className="w-full bg-blue-600 p-2 rounded-lg disabled:bg-gray-500 hover:bg-blue-700"
            >
              Add Team
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeamsPortal