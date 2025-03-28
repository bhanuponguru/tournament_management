import {React,useState,useLayoutEffect} from 'react'
import Navbar from '../utils/Navbar'
import  axios from '../api/axios'
import { useCookies } from 'react-cookie'
const PointsTable = () => {
    const [cookies] = useCookies(["token"]);
    const [selectedTournament, setSelectedTournament] = useState("");
    const [tournaments, setTournaments] = useState([]);
    const [teams, seTeams] = useState([]);
    const [filter, setFilter] = useState("all")
    const [loadingTable, setLoadingTable] = useState(false)
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
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
    
    function getCurrentDate(separator='-'){
        let newDate = new Date()
        let date = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear();
        
        return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date}`
    }
  return (
    <div>
        <Navbar/>
        <div>
        <div className="mb-4">
                <label htmlFor="filters" className="block mb-1 text-gray-300">Filters</label>
                <select 
                    onChange={(e)=>setFilter(e.target.value)} 
                    value={filter} 
                    name="filters" 
                    id="filters"
                    className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                    <option value="all" className="bg-gray-900 text-white">All</option>
                    <option value="upcoming" className="bg-gray-900 text-white">Upcoming</option>
                    <option value="ongoing" className="bg-gray-900 text-white">Ongoing</option>
                    <option value="completed" className="bg-gray-900 text-white">Completed</option>
                </select>
            </div>

            {loadingTournaments ? (
                <div className="flex justify-center items-center h-64">
                    <LoadingSpinner/>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                                    className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-700 transition-colors duration-300"
                                >
                                    <h2 className="text-xl font-semibold mb-2 text-white">{tournament.tournament_name}</h2>
                                    <h3 className="text-gray-400 mb-1">{tournament.tournament_format}</h3>
                                    <p className="text-gray-500 mb-3">
                                        from {tournament.start_date} to {tournament.end_date}
                                    </p>
                                    <button 
                                        onClick={() => setSelectedTournament(tournament.tournament_id)}
                                        className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Show Table
                                    </button>
                                </div>
                            )
                        }
                        return null;
                    })}
                </div>
            )}
        </div>
    </div>
  )
}

export default PointsTable
