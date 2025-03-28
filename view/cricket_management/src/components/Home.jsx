import { React, useLayoutEffect, useState } from 'react';
import Navbar from '../utils/Navbar';
import axios from '../api/axios';
import { useCookies } from 'react-cookie';

const Home = () => {
  const [cookies] = useCookies(["token"]);
  const [todaysMatches, setTodaysMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);

  useLayoutEffect(() => {
    fetchMatchs();
    const interval = setInterval(fetchMatchs, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchMatchs = () => {
    axios.get('/matches/today', { headers: { Authorization: `Bearer ${cookies.token}` } })
      .then((response) => {
        setTodaysMatches(response.data);
        setLoadingMatches(false);
      })
      .catch((error) => {
        console.log(error);
        setLoadingMatches(false);
      });
  };

  return (
    <div className="w-full min-h-screen">
      <div 
        className="bg-gray-900 bg-[url(https://c0.wallpaperflare.com/path/967/82/462/australia-richmond-melbourne-cricket-ground-cricket-371772744fa62261f54850a915da5c9b.jpg)] text-white bg-cover bg-center relative min-h-screen"
      >
        <div className="absolute inset-0 bg-black/70"></div>

        <Navbar />

        <div className="relative z-10 container mx-auto p-4">
          <h1 className="text-3xl font-bold text-center mt-4 text-white">Today's Matches</h1>
          <div className="flex flex-col items-center mt-6">
            {loadingMatches ? (
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
            ) : (
              <div className="w-full max-w-2xl">
                {todaysMatches.length === 0 ? (
                  <h1 className="text-lg text-gray-400 text-center">No Matches Today</h1>
                ) : (
                  todaysMatches.map((match) => (
                    <div key={match.match_id} className="bg-white/20 rounded-lg border border-white/30 p-6 mt-4 w-full backdrop-blur-sm">
                      {match.first_batting === "team_a" && match.inning === 1 ? (
                        <div className="text-center">
                          <p className="text-xl font-semibold text-blue-300">{match.team_a_name} {match.team_a_score}-{match.team_a_wickets}</p>
                          <p className="text-lg text-white/80">{match.team_b_name}</p>
                        </div>
                      ) : match.first_batting === "team_b" && match.inning === 1 ? (
                        <div className="text-center">
                          <p className="text-xl font-semibold text-blue-300">{match.team_b_name} {match.team_a_score}-{match.team_a_wickets}</p>
                          <p className="text-lg text-white/80">{match.team_a_name}</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-xl font-semibold text-green-300">{match.team_a_name} {match.team_a_score}-{match.team_a_wickets}</p>
                          <p className="text-xl font-semibold text-red-300">{match.team_b_name} {match.team_b_score}-{match.team_b_wickets}</p>
                        </div>
                      )}
                      {match.outcome !== null ? (
                        <div className="text-center" >
                          <p className="text-green-300 mt-2">
                            {match.outcome === match.first_batting 
                                ? `${match.outcome === "team_a" ? match.team_a_name : match.team_b_name} won by ${(match.outcome === "team_a" ? match.team_a_score : match.team_b_score)-(match.outcome === "team_b" ? match.team_a_score : match.team_b_score)} runs`
                                : `${match.outcome === "team_a" ? match.team_a_name : match.team_b_name} won by ${11-parseInt(match.outcome === "team_a" ? match.team_a_wickets : match.team_b_wickets)} wickets`}
                          </p>
                        </div>
                      ):(
                        null
                      )}
                      <div className="text-center mt-4">
                        <p className="text-lg text-white/70">{match.date_time.split("T")[0]} -- {match.date_time.split("T")[1].split(":")[0]}:{match.date_time.split("T")[1].split(":")[1]}</p>
                        <p className="text-lg text-white/70">{match.location}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;