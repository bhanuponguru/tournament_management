import { React, useLayoutEffect, useState } from 'react';
import Navbar from '../utils/Navbar';
import axios from '../api/axios';
import { useCookies } from 'react-cookie';

const Home = () => {
  const [cookies] = useCookies(["token"]);
  const [todaysMatches, setTodaysMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [details, setDetails] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date().getTime());
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
    </div>
);

  useLayoutEffect(() => {
    fetchMatchs();
    const interval = setInterval(fetchMatchs, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchMatchs = () => {
    axios.get('/matches/today', { headers: { Authorization: `Bearer ${cookies.token}` } })
      .then((response) => {
        setTodaysMatches(response.data);
        console.log(response.data);
        setLoadingMatches(false);
      })
      .catch((error) => {
        console.log(error);
        setLoadingMatches(false);
      });
  };

  const getDatalils = (id) =>{
    setLoadingDetails(true);
    axios.get(`/matches/player_statistics/?match_id=${id}`,{headers: {Authorization: `Bearer ${cookies.token}`}})
    .then((response) => {
      setDetails(response.data);
      console.log(response.data);
    }).catch((error) => {
      console.log(error);
    }).finally(()=>{
      setLoadingDetails(false);
    })
    setShowDetails(true);
  }

  return (
    <div className="w-full min-h-screen">
      <div 
        className="bg-gray-900 bg-[url(https://c0.wallpaperflare.com/path/967/82/462/australia-richmond-melbourne-cricket-ground-cricket-371772744fa62261f54850a915da5c9b.jpg)] text-white bg-cover bg-center relative min-h-screen"
      >
        <div className="fixed top-0 left-0 w-screen h-screen bg-black/70"></div>

        <Navbar />

        <div className="relative z-10 container mx-auto p-4">
          <h1 className="text-3xl font-bold text-center mt-4 text-white">Today's Matches</h1>
          <div className="flex flex-col items-center mt-6">
            {loadingMatches ? (
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white"></div>
            ) : (
              <div className="w-full max-w-2xl">
                {todaysMatches.length === 0 ? (
                  <h1 className="text-lg text-gray-400 text-center">No Matches Today</h1>
                ) : (
                  todaysMatches.map((match) => (
                    <div key={match.match_id} className="bg-white/20 rounded-lg border border-white/30 p-6 mt-4 w-full backdrop-blur-sm">
                      {match.first_batting === "team_a" && match.inning === 1 ? (
                        <div className="text-center">
                          <p className="text-xl font-semibold text-blue-300">{match.team_a_name} {match.team_a_score}-{match.team_a_wickets} {parseInt(match.team_a_balls/6)}{ parseInt(match.team_a_balls%6) ===0? "" : `.${parseInt(match.team_a_balls%6)}`} Overs</p>
                          <p className="text-lg text-white/80">{match.team_b_name}</p>
                        </div>
                      ) : match.first_batting === "team_b" && match.inning === 1 ? (
                        <div className="text-center">
                          <p className="text-xl font-semibold text-blue-300">{match.team_b_name} {match.team_a_score}-{match.team_a_wickets} {parseInt(match.team_b_balls/6)}{ parseInt(match.team_b_balls%6) ===0? "" : `.${parseInt(match.team_b_balls%6)}`} Overs</p>
                          <p className="text-lg text-white/80">{match.team_a_name}</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-xl font-semibold text-green-300">{match.team_a_name} {match.team_a_score}-{match.team_a_wickets}   {parseInt(match.team_a_balls/6)}{ parseInt(match.team_a_balls%6) ===0? "" : `.${parseInt(match.team_a_balls%6)}`} Overs</p>
                          <p className="text-xl font-semibold text-red-300">{match.team_b_name} {match.team_b_score}-{match.team_b_wickets}  {parseInt(match.team_b_balls/6)}{ parseInt(match.team_b_balls%6) ===0? "" : `.${parseInt(match.team_b_balls%6)}`} Overs</p>
                        </div>
                      )}
                      {match.outcome !== null ? (
                        <div className="text-center" >
                          <p className="text-green-300 mt-2">
                            {match.outcome === match.first_batting 
                                ? `${match.outcome === "team_a" ? match.team_a_name : match.team_b_name} won by ${(match.outcome === "team_a" ? match.team_a_score : match.team_b_score)-(match.outcome === "team_b" ? match.team_a_score : match.team_b_score)} runs`
                                : `${match.outcome === "team_a" ? match.team_a_name : match.team_b_name} won by ${10-parseInt(match.outcome === "team_a" ? match.team_a_wickets : match.team_b_wickets)} wickets`}
                          </p>
                        </div>
                      ):(
                        match.last_update!== null ? (
                          <div className="text-center">
                            <p>batsman-{match.last_update.last_update.batsman_name}-{match.last_update.batsman_statistics.batsman_score}-{match.last_update.batsman_statistics.balls_played}</p>
                            <p>bowler-{match.last_update.last_update.bowler_name}-{match.last_update.bowler_statistics.bowler_runs}-{match.last_update.bowler_statistics.wickets}-{parseInt(match.last_update.bowler_statistics.balls_bowled/6)}{ parseInt(match.last_update.bowler_statistics.balls_bowled%6) ===0? "" : `.${parseInt(match.last_update.bowler_statistics.balls_bowled%6)}`} Overs</p>

                          </div>
                        ) : (null)
                      )}
                      <div className="text-center mt-4">
                        <p className="text-lg text-white/70">{match.date_time.split("T")[0]} -- {match.date_time.split("T")[1].split(":")[0]}:{match.date_time.split("T")[1].split(":")[1]}</p>
                        <p className="text-lg text-white/70">{match.location}</p>
                        <button onClick={()=>{getDatalils(match.match_id)}} className="px-4 mt-2 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 font-semibold" >Get Details</button>
                      </div>
                      {showDetails && (
                        <div className="fixed w-full top-0 left-0  flex items-center justify-center bg-black/70 z-50">
                          <div className="bg-white/10 backdrop-blur-md border  border-white/30 rounded-3xl overflow-hidden shadow-2xl w-3/4 max-w-3xl">
                              <div className="p-6 w-full">
                                  <h1 className="text-3xl font-bold mb-6 text-center text-white">Details</h1>
                                  {loadingDetails ? (
                                      <div className="flex justify-center items-center h-40">
                                          <LoadingSpinner />
                                      </div>
                                  ) : (
                                    !loadingDetails && ( ((details.team_a_bowler_stats!== undefined && details.team_a_bowler_stats.length !== 0) || (details.team_b_bowler_stats!== undefined && details.team_b_bowler_stats.length !== 0) || (details.team_b_batsman_stats!== undefined && details.team_b_batsman_stats.length !== 0) || (details.team_a_batsman_stats!== undefined && details.team_a_batsman_stats.length !== 0)) ? (
                                          <div className="overflow-x-auto h-[50vh] [&::-webkit-scrollbar]:w-2
                                          [&::-webkit-scrollbar-track]:bg-gray-100
                                          [&::-webkit-scrollbar-thumb]:bg-gray-300
                                          dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                                          dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
                                            <h1 className="text-2Xl font-bold mb-6 text-center text-green-500">{match.team_a_name}</h1>
                                            <hr/>
                                            { details.team_a_bowler_stats!== undefined && details.team_a_bowler_stats.length !== 0 && <div>
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
                                            </div>}
                                            { details.team_a_batsman_stats!== undefined && details.team_a_batsman_stats.length !== 0 && <div>
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
                                            </div>}
                                            
                                            <h1 className="text-4Xl font-bold mb-6 mt-2 text-center text-green-500">{match.team_b_name}</h1>
                                            <hr />
                                            { details.team_b_bowler_stats!== undefined && details.team_b_bowler_stats.length !== 0 && <div>
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
                                            </div>}
                                            {details.team_b_batsman_stats!== undefined && details.team_b_batsman_stats.length !== 0 && <div>
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
                                            </div>      }                   
                                          </div>
                                      ) : (
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
                      </div>
                      )}
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