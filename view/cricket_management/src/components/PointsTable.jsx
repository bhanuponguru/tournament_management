import { React, useState, useEffect, useLayoutEffect } from 'react';
import Navbar from '../utils/Navbar';
import axios from '../api/axios';
import { useCookies } from 'react-cookie';

const PointsTable = () => {
    const [cookies] = useCookies(["token"]);
    const [selectedTournament, setSelectedTournament] = useState("");
    const [tournaments, setTournaments] = useState([]);
    const [teams, setTeams] = useState([]);
    const [table, setTable] = useState([]);
    const [filter, setFilter] = useState("all");
    const [loadingTable, setLoadingTable] = useState(false);
    const [loadingTournaments, setLoadingTournaments] = useState(true);
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    useLayoutEffect(() => {
        const fetchTournaments = async () => {
            try {
                setLoadingTournaments(true);
                const response = await axios.get("/tournaments/all", { headers: { Authorization: `Bearer ${cookies.token}` } });
                setTournaments(response.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoadingTournaments(false);
            }
        };
        fetchTournaments();
    }, []);

    useEffect(() => {
        const fetchTables = async () => {
            setTable([]);
            if (selectedTournament !== "") {
                setLoadingTable(true);
                try {
                    const response = await axios.get(`/teams/?tournament_id=${selectedTournament}`, {
                        headers: { Authorization: `Bearer ${cookies.token}` },
                    });
                    setTeams(response.data);
                } catch (error) {
                    console.log(error);
                } finally {
                    setLoadingTable(false);
                    setShowLeaderboard(true);
                }
            }
        };
        fetchTables();
    }, [selectedTournament]);

    useEffect(() => {
        const createTable = () => {
            const sortedTable = teams.map((team) => ({
                name: team.name,
                nrr: team.nrr,
                matchesPlayed: team.matches_played,
                points: team.points,
            })).sort((a, b) => b.points - a.points || b.nrr - a.nrr);
            setTable(sortedTable);
        };
        createTable();
    }, [teams]);

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
            
            <div className="relative z-10 max-w-7xl mx-auto pt-20">
                <h1 className="text-4xl font-bold text-center mb-8 text-white">Tournaments</h1>
                
                <div className="mb-6">
                    <label htmlFor="filters" className="block mb-2 text-sm font-semibold">Filter Tournaments</label>
                    <select
                        onChange={(e) => setFilter(e.target.value)}
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
                        <LoadingSpinner />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {tournaments.map((tournament) => {
                            if (
                                (filter === "upcoming" && new Date() < new Date(tournament.start_date)) ||
                                (filter === "ongoing" && new Date() >= new Date(tournament.start_date) && new Date() <= new Date(tournament.end_date)) ||
                                (filter === "completed" && new Date() > new Date(tournament.end_date)) ||
                                filter === "all"
                            ) {
                                return (
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
                                            Show Table
                                        </button>
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                )}
            </div>

            {showLeaderboard && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
                    <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-3xl overflow-hidden shadow-2xl w-3/4 max-w-3xl">
                        <div className="p-6">
                            <h1 className="text-3xl font-bold mb-6 text-center text-white">Leaderboard</h1>
                            
                            {loadingTable ? (
                                <div className="flex justify-center items-center h-40">
                                    <LoadingSpinner />
                                </div>
                            ) : (
                                table.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-white/20">
                                                    <th className="p-3 text-white/90 font-semibold">Team</th>
                                                    <th className="p-3 text-white/90 font-semibold">NRR</th>
                                                    <th className="p-3 text-white/90 font-semibold">Matches</th>
                                                    <th className="p-3 text-white/90 font-semibold">Points</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {table.map((team, index) => (
                                                    <tr 
                                                        key={index} 
                                                        className={`border-b border-white/10 ${index === 0 ? 'bg-gradient-to-r from-indigo-900/30 to-purple-900/30' : ''}`}
                                                    >
                                                        <td className="p-3 text-white">
                                                            {index === 0 && (
                                                                <span className="inline-block mr-2 text-yellow-400">🏆</span>
                                                            )}
                                                            {team.name}
                                                        </td>
                                                        <td className="p-3 text-white/80">{team.nrr}</td>
                                                        <td className="p-3 text-white/80">{team.matchesPlayed}</td>
                                                        <td className="p-3 font-semibold text-white">{team.points}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
                                        <p className="text-white/70 text-lg">No teams in the tournament</p>
                                    </div>
                                )
                            )}
                            
                            <div className="mt-6 flex justify-center">
                                <button
                                    onClick={() => setShowLeaderboard(false)}
                                    className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 font-semibold"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PointsTable;