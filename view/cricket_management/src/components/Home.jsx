import { React, useLayoutEffect, useState, useEffect } from 'react';
import Navbar from '../utils/Navbar';
import axios from '../api/axios';
import { useCookies } from 'react-cookie';

const Home = () => {
  const [cookies] = useCookies(["token"]);
  const [todaysMatches, setTodaysMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true); // Only show loading on first fetch

  useLayoutEffect(() => {
    fetchMatchs();
    const interval = setInterval(fetchMatchs, 10000); // Polling every 10 sec
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const fetchMatchs = () => {
    axios.get('/matches/today', { headers: { Authorization: `Bearer ${cookies.token}` } })
      .then((response) => {
        setTodaysMatches(response.data);
        setLoadingMatches(false); // Ensure loading is only for first fetch
      })
      .catch((error) => {
        console.log(error);
        setLoadingMatches(false);
      });
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mt-4 text-gray-100">Today's Matches</h1>
        <div className="flex flex-col items-center mt-6">
          {loadingMatches ? (
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
          ) : (
            <div className="w-full max-w-2xl">
              {todaysMatches.length === 0 ? (
                <h1 className="text-lg text-gray-400 text-center">No Matches Today</h1>
              ) : (
                todaysMatches.map((match) => (
                  <div key={match.match_id} className="bg-gray-800 rounded-lg shadow-md p-6 mt-4 w-full">
                    {match.first_batting === "team_a" && match.inning === 1 ? (
                      <div className="text-center">
                        <p className="text-xl font-semibold text-blue-400">{match.team_a_name} {match.team_a_score}-{match.team_a_wickets}</p>
                        <p className="text-lg text-gray-300">{match.team_b_name}</p>
                      </div>
                    ) : match.first_batting === "team_b" && match.inning === 1 ? (
                      <div className="text-center">
                        <p className="text-xl font-semibold text-blue-400">{match.team_b_name} {match.team_a_score}-{match.team_a_wickets}</p>
                        <p className="text-lg text-gray-300">{match.team_a_name}</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-xl font-semibold text-green-400">{match.team_a_name} {match.team_a_score}-{match.team_a_wickets}</p>
                        <p className="text-xl font-semibold text-red-400">{match.team_b_name} {match.team_b_score}-{match.team_b_wickets}</p>
                      </div>
                    )}
                    {match.outcome !== null ? (
                      <div className="text-center" >
                        <p className="text-green-400 mt-2">
                          {match.outcome === match.first_batting 
                              ? `${match.outcome === "team_a" ? match.team_a_name : match.team_b_name} won by ${(match.outcome === "team_a" ? match.team_a_score : match.team_b_score)-(match.outcome === "team_b" ? match.team_a_score : match.team_b_score)} runs`
                              : `${match.outcome === "team_a" ? match.team_a_name : match.team_b_name} won by ${11-parseInt(match.outcome === "team_a" ? match.team_a_wickets : match.team_b_wickets)} wickets`}
                        </p>
                      </div>
                    ):(
                      null
                    )}
                    <div className="text-center mt-4">
                      <p className="text-lg text-gray-300">{match.date_time.split("T")[0]} -- {match.date_time.split("T")[1].split(":")[0]}:{match.date_time.split("T")[1].split(":")[1]}</p>
                      <p className="text-lg text-gray-300">{match.location}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
