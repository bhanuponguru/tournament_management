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
    const [loadingDetails, setLoadingDetails] = useState(false)
    const [details, setDetails] = useState({})
    const [showDetails, setShowDetails] = useState(false)
    const [team1Name, setTeam1Name] = useState("");
    const [team2Name, setTeam2Name] = useState("");
    
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
    const getDatalils = (id) =>{
      setLoadingDetails(true);
      axios.get(`/matches/player_statistics/?match_id=${id}`,{headers: {Authorization: `Bearer ${cookies.token}`}})
      .then((response) => {
        setDetails(response.data);
        console.log(response.data);
      }).catch((error) => {
        console.log(error);
      }).finally(() => {
        setLoadingDetails(false);
      })
      matches.map((match) => {
        if(match.match_id === id){
          setTeam1Name(match.team_a_name);
          setTeam2Name(match.team_b_name);
        }
      })
      setShowDetails(true);
      
    }
    
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
                      <button onClick={()=>{getDatalils(match.match_id)}} className="px-4 mt-2 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 font-semibold" >Get Details</button>
                    </div>
                  ))}
                </div>
                {showDetails &&(
                  <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/70">
                    <div className="bg-white/10 h-[70vh] [&::-webkit-scrollbar]:w-2
                                      [&::-webkit-scrollbar-track]:bg-gray-100
                                      [&::-webkit-scrollbar-thumb]:bg-gray-300
                                      dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                                      dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 overflow-y-scroll backdrop-blur-md p-4 border border-white/30 rounded-3xl overflow-hidden shadow-2xl w-3/4 max-w-3xl">
                    {loadingDetails ? (
                      <div className="flex justify-center items-center h-64">
                        <LoadingSpinner />
                      </div>
                    ):(!loadingDetails && ( (details.team_a_bowler_stats!== undefined && details.team_a_bowler_stats.length !== 0) ? (
                      <div className="flex flex-col items-center justify-center">
                          <h1 className="text-2Xl font-bold mb-6 text-center text-green-500">{team1Name}</h1>
                          <hr/>
                          <h1 className="text-2Xl font-semibold mt-2 mb-6 text-center text-white">Bowling</h1>
                          <hr />
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/20">
                                        <th className="p-3 text-white/90 font-semibold">Name</th>
                                        <th className="p-3 text-white/90 font-semibold">Runs</th>
                                        <th className="p-3 text-white/90 font-semibold">Wickets</th>
                                        <th className="p-3 text-white/90 font-semibold">Economy</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {details.team_a_bowler_stats.map((bowler) => (
                                        <tr key={bowler.player_id} className="border-b border-white/20">
                                            <td className="p-3 text-white/90">{bowler.bowler_name}</td>
                                            <td className="p-3 text-white/90">{bowler.bowler_runs}</td>
                                            <td className="p-3 text-white/90">{bowler.wickets}</td>
                                            <td className="p-3 text-white/90">{parseFloat((bowler.bowler_runs / (bowler.balls_bowled / 6)).toFixed(2))}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                          <hr/>
                          <h1 className="text-2Xl font-semibold mt-2 mb-6 text-center text-white">Batting</h1>
                          <hr />
                          <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/20">
                                        <th className="p-3 text-white/90 font-semibold">Name</th>
                                        <th className="p-3 text-white/90 font-semibold">Runs</th>
                                        <th className="p-3 text-white/90 font-semibold">Balls Played</th>
                                        <th className="p-3 text-white/90 font-semibold">Strike Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {details.team_a_batsman_stats.map((batsman) => (
                                        <tr key={batsman.player_id} className="border-b border-white/20">
                                            <td className="p-3 text-white/90">{batsman.batsman_name}{batsman.is_wicket? "":"*"}</td>
                                            <td className="p-3 text-white/90">{batsman.batsman_score}</td>
                                            <td className="p-3 text-white/90">{batsman.balls_played}</td>
                                            <td className="p-3 text-white/90">{parseFloat(((batsman.batsman_score / batsman.balls_played) * 100).toFixed(2))}</td>
                                        </tr>
                                    ))}
                                </tbody>
                          </table>
                          <hr/>
                          <h1 className="text-4Xl font-bold mb-6 mt-2 text-center text-green-500">{team2Name}</h1>
                          <hr />
                          <h1 className="text-2Xl font-semibold mt-2 mb-6 text-center text-white">Bowling</h1>
                          <hr />
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/20">
                                        <th className="p-3 text-white/90 font-semibold">Name</th>
                                        <th className="p-3 text-white/90 font-semibold">Runs</th>
                                        <th className="p-3 text-white/90 font-semibold">Wickets</th>
                                        <th className="p-3 text-white/90 font-semibold">Economy</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {details.team_b_bowler_stats.map((bowler) => (
                                        <tr key={bowler.player_id} className="border-b border-white/20">
                                            <td className="p-3 text-white/90">{bowler.bowler_name}</td>
                                            <td className="p-3 text-white/90">{bowler.bowler_runs}</td>
                                            <td className="p-3 text-white/90">{bowler.wickets}</td>
                                            <td className="p-3 text-white/90">{parseFloat((bowler.bowler_runs / (bowler.balls_bowled / 6)).toFixed(2))}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                          <hr/>
                          <h1 className="text-2Xl font-semibold mt-2 mb-6 text-center text-white">Batting</h1>
                          <hr />
                          <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/20">
                                        <th className="p-3 text-white/90 font-semibold">Name</th>
                                        <th className="p-3 text-white/90 font-semibold">Runs</th>
                                        <th className="p-3 text-white/90 font-semibold">Balls Played</th>
                                        <th className="p-3 text-white/90 font-semibold">Strike Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {details.team_b_batsman_stats.map((batsman) => (
                                        <tr key={batsman.player_id} className="border-b border-white/20">
                                            <td className="p-3 text-white/90">{batsman.batsman_name}{batsman.is_wicket? "":"*"}</td>
                                            <td className="p-3 text-white/90">{batsman.batsman_score}</td>
                                            <td className="p-3 text-white/90">{batsman.balls_played}</td>
                                            <td className="p-3 text-white/90">{parseFloat(((batsman.batsman_score / batsman.balls_played) * 100).toFixed(2))}</td>
                                        </tr>
                                    ))}
                                </tbody>
                          </table>
                      </div>
                      ):(
                        <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
                          <p className="text-white/70 text-lg">No Details avilable</p>
                        </div>
                      ))
                    )}
                    
                    <div className="mt-6 flex justify-center">
                      <button
                          onClick={() => setShowDetails(false)}
                          className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 font-semibold"
                      >
                          Close
                      </button>
                    </div>
                    
                    </div>
                  </div>

                )}
              </div>
            )
          )
        )}
      </div>
    </div>
  )
}

export default Matches