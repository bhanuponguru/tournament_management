import { useState, useLayoutEffect, useEffect } from "react";
import Navbar from "../utils/Navbar";
import { useCookies } from "react-cookie";
import axios from "../api/axios";

const Players = () => {
    const [cookies] = useCookies(["token"]);
    const [selectedTournament, setSelectedTournament] = useState("");
    const [tournaments, setTournaments] = useState([]);
    const [loadingTournaments, setLoadingTournaments] = useState(true);
    const [filter, setFilter] = useState("all");
    const [players, setPlayers] = useState([]);
    const [showPlayers, setShowPlayers] = useState(false);
    const [loadingPlayers, setLoadingPlayers] = useState(false);

    useLayoutEffect(() => {
        const fetchTournaments = async () => {
            try {
                setLoadingTournaments(true);
                const response = await axios.get("/tournaments/all", {
                    headers: { Authorization: `Bearer ${cookies.token}` },
                });
                setTournaments(response.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoadingTournaments(false);
            }
        };
        fetchTournaments();
    }, []);

    const LoadingSpinner = () => (
        <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        </div>
    );

    function getCurrentDate(separator = "-") {
        let newDate = new Date();
        let date = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear();
        return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date}`;
    }

    useEffect(() => {
        const fetchPlayers = async () => {
            if (selectedTournament) {
                setLoadingPlayers(true);
                try {
                    const response = await axios.get(`/tournaments/players?tournament_id=${selectedTournament}`, {
                        headers: { Authorization: `Bearer ${cookies.token}` },
                    });
                    setPlayers(response.data);
                } catch (error) {
                    console.log(error);
                } finally {
                    setLoadingPlayers(false);
                }
            }
        };
        fetchPlayers();
    }, [selectedTournament]);

    return (
        <div className="min-h-screen bg-[url(https://c0.wallpaperflare.com/path/967/82/462/australia-richmond-melbourne-cricket-ground-cricket-371772744fa62261f54850a915da5c9b.jpg)] bg-gray-900 text-white p-6 bg-cover bg-center">
            <div className="absolute inset-0 bg-black/50"></div>

            <div className="relative z-30">
                <Navbar />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto pt-20">
                <h1 className="text-4xl font-bold text-center mb-8 text-white">Tournaments</h1>

                <div className="mb-6">
                    <label htmlFor="filters" className="block mb-2 text-sm font-semibold">
                        Filter Tournaments
                    </label>
                    <select
                        onChange={(e) => setFilter(e.target.value)}
                        value={filter}
                        name="filters"
                        id="filters"
                        className="w-full p-3 bg-white/20 rounded-lg border border-white/30 focus:ring-2 focus:ring-white/50 transition-all duration-300 text-white"
                    >
                        <option value="all" className="bg-gray-900 text-white">
                            All Tournaments
                        </option>
                        <option value="upcoming" className="bg-gray-900 text-white">
                            Upcoming Tournaments
                        </option>
                        <option value="ongoing" className="bg-gray-900 text-white">
                            Ongoing Tournaments
                        </option>
                        <option value="completed" className="bg-gray-900 text-white">
                            Completed Tournaments
                        </option>
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
                                (filter === "upcoming" && getCurrentDate() < tournament.start_date) ||
                                (filter === "ongoing" &&
                                    getCurrentDate() >= tournament.start_date &&
                                    getCurrentDate() <= tournament.end_date) ||
                                (filter === "completed" && getCurrentDate() > tournament.end_date) ||
                                filter === "all"
                            ) {
                                return (
                                    <div
                                        key={tournament.tournament_id}
                                        className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg p-5 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1"
                                    >
                                        <h2 className="text-xl font-semibold mb-2 text-white">
                                            {tournament.tournament_name}
                                        </h2>
                                        <h3 className="text-white/70 mb-1">{tournament.tournament_format}</h3>
                                        <p className="text-white/60 mb-4">
                                            from {tournament.start_date} to {tournament.end_date}
                                        </p>
                                        <button
                                            onClick={() => {
                                                setSelectedTournament(tournament.tournament_id);
                                                setShowPlayers(true);
                                            }}
                                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 font-semibold"
                                        >
                                            Show Players
                                        </button>
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                )}

                {showPlayers && (
                    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/70">
                        <div className="bg-white/10 h-[70vh] [&::-webkit-scrollbar]:w-2
                                          [&::-webkit-scrollbar-track]:bg-gray-100
                                          [&::-webkit-scrollbar-thumb]:bg-gray-300
                                          dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                                          dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 overflow-y-scroll backdrop-blur-md p-4 border border-white/30 rounded-3xl overflow-hidden shadow-2xl w-3/4 max-w-3xl">
                            {loadingPlayers ? (
                                <div className="flex justify-center items-center h-64">
                                    <LoadingSpinner />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center">
                                    <table className="w-full text-left">
                                        <thead className="sticky rounded-2xl top-0 bg-black/50 backdrop-blur-lg">
                                            <tr className="border-b border-white/20">
                                                <th className="p-3 text-white/90 font-semibold">Name</th>
                                                <th className="p-3 text-white/90 font-semibold">Team</th>
                                                <th className="p-3 text-white/90 font-semibold">Innings</th>
                                                <th className="p-3 text-white/90 font-semibold">Runs</th>
                                                <th className="p-3 text-white/90 font-semibold">Batting Avg</th>
                                                <th className="p-3 text-white/90 font-semibold">Runs (B)</th>
                                                <th className="p-3 text-white/90 font-semibold">Wickets</th>
                                                <th className="p-3 text-white/90 font-semibold">Bowling Avg</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {players.map((player) => (
                                                <tr key={player.player_id} className="border-b border-white/20">
                                                    <td className="p-3">{player.name}</td>
                                                    <td className="p-3">{player.team_name}</td>
                                                    <td className="p-3">{player.innings}</td>
                                                    <td className="p-3">{player.batsman_runs}</td>
                                                    <td className="p-3">{player.innings ? (player.batsman_runs / player.innings).toFixed(2) : 0}</td>
                                                    <td className="p-3">{player.bowler_runs}</td>
                                                    <td className="p-3">{player.wickets}</td>
                                                    <td className="p-3">{player.wickets ? (player.bowler_runs / player.wickets).toFixed(2) : 0}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <button
                                          onClick={() => setShowPlayers(false)}
                                          className="px-8 py-3 m-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 font-semibold"
                                      >
                                          Close
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Players;
