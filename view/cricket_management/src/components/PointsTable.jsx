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
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <Navbar />
            <div className="p-4">
                <div className="mb-4">
                    <label htmlFor="filters" className="block mb-1 text-gray-300">Filters</label>
                    <select
                        onChange={(e) => setFilter(e.target.value)}
                        value={filter}
                        name="filters"
                        id="filters"
                        className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded"
                    >
                        <option value="all">All</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                {loadingTournaments ? <LoadingSpinner /> : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {tournaments.map((tournament) => {
                            if (
                                (filter === "upcoming" && new Date() < new Date(tournament.start_date)) ||
                                (filter === "ongoing" && new Date() >= new Date(tournament.start_date) && new Date() <= new Date(tournament.end_date)) ||
                                (filter === "completed" && new Date() > new Date(tournament.end_date)) ||
                                filter === "all"
                            ) {
                                return (
                                    <div key={tournament.tournament_id} className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors">
                                        <h2 className="text-xl font-semibold">{tournament.tournament_name}</h2>
                                        <h3 className="text-gray-400">{tournament.tournament_format}</h3>
                                        <p className="text-gray-500">{tournament.start_date} to {tournament.end_date}</p>
                                        <button
                                            onClick={() => setSelectedTournament(tournament.tournament_id)}
                                            className="w-full bg-blue-600 p-2 rounded-lg hover:bg-blue-700"
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
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-gray-800 p-6 rounded-lg w-3/4 max-w-2xl">
                        <h1 className="text-2xl mb-4">Leaderboard</h1>
                        {loadingTable ? <LoadingSpinner /> : (
                            table.length > 0 ? (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-700">
                                            <th className="p-2">Team</th>
                                            <th className="p-2">NRR</th>
                                            <th className="p-2">Matches Played</th>
                                            <th className="p-2">Points</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {table.map((team, index) => (
                                            <tr key={index} className="border-b border-gray-600">
                                                <td className="p-2">{team.name}</td>
                                                <td className="p-2">{team.nrr}</td>
                                                <td className="p-2">{team.matchesPlayed}</td>
                                                <td className="p-2">{team.points}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-center text-gray-400">No teams in the tournament</p>
                            )
                        )}
                        <button
                            onClick={() => setShowLeaderboard(false)}
                            className="mt-4 w-full bg-red-600 p-2 rounded-lg hover:bg-red-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PointsTable;