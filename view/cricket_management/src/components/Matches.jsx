import {React, useState, useLayoutEffect, useEffect} from 'react'
import Navbar from '../utils/Navbar'
import axios from '../api/axios'
import { useCookies } from 'react-cookie'

const Matches = () => {
    const [cookies] = useCookies(["token"]);
    const [selectedTournament, setSelectedTournament] = useState("");
    const [tournaments, setTournaments] = useState([]);
    const [matches, setMatches] = useState([]);
    const [filter, setFilter] = useState("all")
    const [loadingMatches, setLoadingMatches] = useState(false)
    const [loadingTournaments, setLoadingTournaments] = useState(true)
    
    useLayoutEffect(() => {
        const fetchTournaments = async () => {
            try {
                setLoadingTournaments(true)
                const response = await axios.get("/tournaments/all",{headers: {Authorization: `Bearer ${cookies.token}`}})
                setTournaments(response.data)
                setLoadingTournaments(false)
            } catch (error) {
                console.log(error)
                setLoadingTournaments(false)
            }
        }
        fetchTournaments()
    },[])
    
    const LoadingSpinner = () => (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        </div>
    );
    
    function getCurrentDate(separator='-'){
        let newDate = new Date()
        let date = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear();
        
        return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date}`
    }
    
    useEffect(() => {
        const fetchMatches = async () => {
            if(selectedTournament !== ""){
                try {
                    setLoadingMatches(true)
                    const response = await axios.get(`/matches/?tournament_id=${selectedTournament}`,{headers: {Authorization: `Bearer ${cookies.token}`}})
                    setMatches(response.data)
                    setLoadingMatches(false)
                } catch (error) {
                    console.log(error)
                    setLoadingMatches(false)
                }
            }
        }
        fetchMatches()
    },[selectedTournament])
    
  return (
    <div
      className="min-h-screen bg-[url(https://c0.wallpaperflare.com/path/967/82/462/australia-richmond-melbourne-cricket-ground-cricket-371772744fa62261f54850a915da5c9b.jpg)] bg-gray-900 text-white p-6 bg-cover bg-center"
    >
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="relative z-30">
        <Navbar />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto pt-20">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">Tournaments</h1>
        
        <div className="mb-6">
          <label htmlFor="filters" className="block mb-2 text-sm font-semibold">Filter Tournaments</label>
          <select 
            onChange={(e)=>setFilter(e.target.value)} 
            value={filter} 
            name="filters" 
            id="filters"
            className="w-full p-3 bg-white/20 rounded-lg border border-white/30 focus:ring-2 focus:ring-white/50 transition-all duration-300 text-white"
          >
            <option value="all" className="bg-gray-900 text-white">All Tournaments</option>
            <option value="upcoming" className="bg-gray-900 text-white">Upcoming Tournaments</option>
            <option value="ongoing" className="bg-gray-900 text-white">Ongoing Tournaments</option>
            <option value="completed" className="bg-gray-900 text-white">Completed Tournaments</option>
          </select>
        </div>

        {loadingTournaments ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner/>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tournaments.map((tournament) => {
              if(
                (filter === "upcoming" && getCurrentDate() < tournament.start_date) ||
                (filter === "ongoing" && getCurrentDate() >= tournament.start_date && getCurrentDate() <= tournament.end_date) ||
                (filter === "completed" && getCurrentDate() > tournament.end_date) ||
                filter === "all"
              ){
                return(
                  <div 
                    key={tournament.tournament_id} 
                    className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg p-5 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <h2 className="text-xl font-semibold mb-2 text-white">{tournament.tournament_name}</h2>
                    <h3 className="text-white/70 mb-1">{tournament.tournament_format}</h3>
                    <p className="text-white/60 mb-4">
                      from {tournament.start_date} to {tournament.end_date}
                    </p>
                    <button 
                      onClick={() => setSelectedTournament(tournament.tournament_id)}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 font-semibold"
                    >
                      Show Matches
                    </button>
                  </div>
                )
              }
              return null;
            })}
          </div>
        )}

        {selectedTournament !== "" && (
          loadingMatches ? (
            <div className="flex justify-center items-center h-64 mt-8">
              <LoadingSpinner/>
            </div>
          ) : (
            matches.length === 0 ? (
              <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg text-center">
                <p className="text-white/80 text-lg">No Matches in this tournament</p>
              </div>
            ) : (
              <div className="mt-10">
                <h2 className="text-3xl font-bold mb-6 text-white">Matches</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {matches.map((match) => (
                    <div 
                      key={match.match_id} 
                      className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg p-5 hover:bg-white/20 transition-all duration-300"
                    >
                      <h2 className="text-xl font-semibold mb-3 text-white">
                        {match.team_a_name} vs {match.team_b_name}
                      </h2>
                      <div className="text-white/80 space-y-2">
                        <p>Location: {match.location}</p>
                        <p>Date: {match.date_time.split("T")[0]}</p>
                        <p>Time: {match.date_time.split("T")[1].split(":")[0]+":"+match.date_time.split("T")[1].split(":")[1]}</p>
                        {match.outcome !== null && (
                          <div className="mt-3 p-2 bg-white/10 border border-green-500/30 rounded-lg">
                            <p className="text-green-400">
                              {match.outcome === match.first_batting 
                                ? `${match.outcome === "team_a" ? match.team_a_name : match.team_b_name} won by ${(match.outcome === "team_a" ? match.team_a_score : match.team_b_score)-(match.outcome === "team_b" ? match.team_a_score : match.team_b_score)} runs`
                                : `${match.outcome === "team_a" ? match.team_a_name : match.team_b_name} won by ${11-parseInt(match.outcome === "team_a" ? match.team_a_wickets : match.team_b_wickets)} wickets`}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )
        )}
      </div>
    </div>
  )
}

export default Matches