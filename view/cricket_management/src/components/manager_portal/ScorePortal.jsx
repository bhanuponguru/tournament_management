import {React ,useLayoutEffect,useState,useEffect, use} from "react";
import axios from "../../api/axios";
import Navbar from "./utils/Navbar";
import {useCookies} from 'react-cookie';

const ScorePortal = () => {
  const [cookies,setCookie,removeCookie] = useCookies(["token"]);
  const [team1, setTeam1] = useState([]);
  const [team2, setTeam2] = useState([]);
  const [battingTeam, setBattingTeam] = useState([]);
  const [bowlingTeam, setBowlingTeam] = useState([]);
  const [batsman, setBatsman] = useState("");
  const [bowler, setBowler] = useState("");
  const [bowlerScore, setBowlerScore] = useState("");
  const [batsmanScore, setBatsmanScore] = useState("");
  const [ballType, setBallType] = useState("");
  const [wicketType, setWicketType] = useState("");
  const [wicketBy, setWicketBy] = useState("");
  const [catchBy, setCatchBy] = useState("");
  const [matches, setMatches] = useState([]);
  const [selectedMatchObj, setSelectedMatchObj] = useState({});
  const [selectedTournament, setSelectedTournament] = useState("");
  const [tournament, setTournament] = useState([]);
  const [selectedMatch,setSelectedMatch] = useState("");
  const [loadingTournaments, setLoadingTournaments] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [loadingMatchFinish, setLoadingMatchFinish] = useState(false);

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  const handleFinish = async () => 
  {
    setLoadingMatchFinish(true);
    if(selectedMatchObj.inning === 1)
    {
      axios.put('/matches/update_inning',{match_id:selectedMatch},{headers:{"Authorization":`Bearer ${cookies.token}`}}).catch((error)=>{console.log(error)})
      window.location.reload();
      setLoadingMatchFinish(false);
    }
    else 
    {
      axios.put('/matches/complete',{match_id:selectedMatch},{headers:{"Authorization":`Bearer ${cookies.token}`}}).catch((error)=>{console.log(error)})
      window.location.reload();
      setLoadingMatchFinish(false);
    }
  }

  useLayoutEffect(()=>{
    const getTournaments = async () => {
      try {
        setLoadingTournaments(true);
        const responce = await axios.get('/tournaments',{headers:{"Authorization":`Bearer ${cookies.token}`}});
        setTournament(responce.data);
        setLoadingTournaments(false);
      } catch (error) {
        console.log(error);
        setLoadingTournaments(false);
      }
    }
    getTournaments();
  },[])
  
  const handleSubmitScore = async () => {
    setSubmitLoading(true);
    let data = {
      match_id: selectedMatch,
      batsman_id: batsman,
      bowler_id: bowler,
      ball_type: ballType,
      batsman_score: batsmanScore,
      bowler_score: bowlerScore || 0,
      wicket_type: wicketType || "",
      wicket_by_id: wicketBy || 0 ,
      catch_by_id: catchBy || 0,
      is_stumping: wicketType === "stumped" ? true : false
    }
    try {
      await axios.put('/matches/log', data, {headers:{"Authorization":`Bearer ${cookies.token}`}});
    } catch (error) {
      console.log(error);
    }
    setSubmitLoading(false);
    setBatsman("");
    setBowler("");
    setBallType("");
    setBatsmanScore("");
    setBowlerScore("");
    setWicketType("");
    setWicketBy("");
    setCatchBy("");
  }

  useEffect(()=>{
    const fetchMatches = async () => {
      if(selectedTournament){
        try {
          setLoadingMatches(true);
          const responce = await axios.get(`/matches/?tournament_id=${selectedTournament}`,{headers:{"Authorization":`Bearer ${cookies.token}`}});
          setMatches(responce.data);
          setLoadingMatches(false);
        } catch (error) {
          console.log(error);
          setLoadingMatches(false);
        }
      }
      if(selectedMatch !== ""){
        setSelectedMatch("")
      }
    }
    fetchMatches();
  },[selectedTournament])

  useEffect(()=>{
    const fetchTeamPlayers = async () => {
      if(selectedMatch!=="" && selectedTournament!==""){
        const matchDetails = matches.find(item => item.match_id == selectedMatch);
        if (matchDetails) {
          try {
            setLoadingTeams(true);
            const team1Response = await axios.get('/teams/players?team_id='+matchDetails.team_a_id,{headers:{"Authorization":`Bearer ${cookies.token}`}});
            const team2Response = await axios.get('/teams/players?team_id='+matchDetails.team_b_id,{headers:{"Authorization":`Bearer ${cookies.token}`}});
            
            setTeam1(team1Response.data);
            setTeam2(team2Response.data);
            setSelectedMatchObj(matchDetails);
            setLoadingTeams(false);
          } catch (error) {
            console.log(error);
            setLoadingTeams(false);
          }
        }
      }
      if(selectedMatch===""){
        setTeam1([])
        setTeam2([])
        setSelectedMatchObj({})
      }
    }
    fetchTeamPlayers();
  },[selectedMatch])

  useEffect(()=>{
    if(team1.length !== 0 && team2.length !== 0)
    {
      if((selectedMatchObj.first_batting === "team_a" && selectedMatchObj.inning === 1) || (selectedMatchObj.first_batting === "team_b" && selectedMatchObj.inning === 2)){
        setBattingTeam(team1)
        setBowlingTeam(team2)
      }
      else if((selectedMatchObj.first_batting === "team_b" && selectedMatchObj.inning === 1) || (selectedMatchObj.first_batting === "team_a" && selectedMatchObj.inning === 2))
      {
        setBattingTeam(team2)
        setBowlingTeam(team1)
      }
    }
  },[team1,team2])
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {<Navbar />}
      <h1 className="text-3xl font-bold text-center mb-6">Score Portal</h1>

      <div className="max-w-md mx-auto space-y-4">
        {loadingTournaments ? (
          <LoadingSpinner />
        ) : tournament.length !== 0 ? (
          <div>
            <label htmlFor="Tournament" className="block mb-1">Select a Tournament</label>
            <select 
              onChange={(e)=>{setSelectedTournament(e.target.value)}} 
              name="Tournament" 
              id="Tournament"
              className="w-full p-2 bg-gray-700 rounded"
            >
              <option value="">Select an option</option>
              {tournament.map((item,key)=>{
                return <option key={key} value={item.tournament_id}>{item.tournament_name}</option>
              })}
            </select>
          </div>
        ) : <p className="text-red-400">No Tournament available</p>}

        {selectedTournament !== "" && (loadingMatches ? (
          <LoadingSpinner />
        ) : matches.length !== 0 ? 
          <div>
            <label htmlFor="Match" className="block mb-1">Select a Match</label>
            <select 
              onChange={(e)=>{setSelectedMatch(e.target.value)}} 
              name="Match" 
              id="Match"
              className="w-full p-2 bg-gray-700 rounded"
            >
              <option value="">Select an option</option>
              {matches.map((item,key)=>{
                if(item.outcome !== null)
                  return null
                return <option key={key} value={item.match_id}>{item.team_a_name} vs {item.team_b_name}</option>
              })}
            </select>
          </div>
        :<p className="text-red-400">No Matches available</p>)}
        {selectedTournament && selectedMatch !== "" && <p className="text-center text-xl text-gray-300">{selectedMatchObj.team_a_name} vs {selectedMatchObj.team_b_name}</p>}
        {selectedTournament && selectedMatch !== "" && <p className="text-center text-xl text-gray-300">{selectedMatchObj.inning === 1 ? "First Inning" : "Second Inning"}</p>}
        {selectedTournament && selectedMatch !== "" && <div>
          <label htmlFor="tossWinner" className="block mb-1">Select Toss Winner</label>
          <select 
            onChange={(e)=>{
              axios.put('/matches/toss_winner',{team:e.target.value,match_id:selectedMatch},{headers:{"Authorization":`Bearer ${cookies.token}`}})
              .catch((error)=>{
                console.log(error);
              })
              setSelectedMatchObj({...selectedMatchObj,toss_winner:e.target.value})
              }} 
            value={selectedMatchObj.toss_winner === null ? "" : selectedMatchObj.toss_winner} 
            name="tossWinner" 
            id="tossWinner"
            className="w-full p-2 bg-gray-700 rounded"
          >
            <option disabled={selectedMatchObj.toss_winner !== null} value={""}>Select a Team</option>
            <option disabled={selectedMatchObj.toss_winner === "team_b"} value={"team_a"}>{selectedMatchObj.team_a_name}</option>
            <option disabled={selectedMatchObj.toss_winner === "team_a"} value={"team_b"}>{selectedMatchObj.team_b_name}</option>
          </select>
        </div>}

        {selectedTournament && selectedMatch!==''&& selectedMatchObj.toss_winner !== null && 
        <div>
          <label htmlFor="batting team" className="block mb-1">Choose Batting Team</label>
          <select 
            onChange={(e)=>{
            axios.put('/matches/first_batting',{team:e.target.value,match_id:selectedMatch},{headers:{"Authorization":`Bearer ${cookies.token}`}})
            .catch((error)=>{
              console.log(error);
            })
            setSelectedMatchObj({...selectedMatchObj,first_batting:e.target.value})
            }} 
            value={selectedMatchObj.first_batting === null ? "" : selectedMatchObj.first_batting} 
            name="tossWinner" 
            id="tossWinner"
            className="w-full p-2 bg-gray-700 rounded"
          >
            <option disabled={selectedMatchObj.first_batting !== null} value={""}>Select a Team</option>
            <option disabled={selectedMatchObj.first_batting === "team_b"} value={"team_a"}>{selectedMatchObj.team_a_name}</option>
            <option disabled={selectedMatchObj.first_batting === "team_a"} value={"team_b"}>{selectedMatchObj.team_b_name}</option>
          </select>
        </div>}

        {selectedTournament && selectedMatch !== "" && selectedMatchObj.first_batting !== null && (loadingTeams ? (
          <LoadingSpinner />
        ) : (
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label htmlFor="batsman" className="block mb-1">Select Batsman</label>
              <select 
                onChange={(e)=>{setBatsman(e.target.value)}} 
                name="batsman" 
                id="batsman"
                className="w-full p-2 bg-gray-700 rounded"
              >
                <option value="">Select an option</option>
                {battingTeam.map((item,key)=>{
                  return <option key={key} value={item.player_id}>{item.name}</option>
                })}
              </select>
            </div>
            <div className="w-1/2">
              <label htmlFor="Bowler" className="block mb-1">Select Bowler</label>
              <select 
                onChange={(e)=>{setBowler(e.target.value)}} 
                name="Bowler" 
                id="Bowler"
                className="w-full p-2 bg-gray-700 rounded"
              >
                <option value="">Select an option</option>
                {bowlingTeam.map((item,key)=>{
                  return <option key={key} value={item.player_id}>{item.name}</option>
                })}
              </select>
            </div>
          </div>
        ))}

        {batsman !== "" && bowler !== "" && 
          <div>
            <label htmlFor="ballType" className="block mb-1">Ball Type</label>
            <select 
              onChange={(e)=>{setBallType(e.target.value)}} 
              name="ballType" 
              id="ballType"
              className="w-full p-2 bg-gray-700 rounded"
            >
              <option value="">Select an option</option>
              <option value="wide">Wide</option>
              <option value="noball">No Ball</option>
              <option value="legal">Legal</option>
            </select>
          </div>
        }

        { selectedTournament && selectedMatch && ballType == "legal" &&
          <div>
            <label htmlFor="batsmanScore" className="block mb-1">Select Batsman Score</label>
            <select 
              onChange={(e)=>{setBatsmanScore(e.target.value)}} 
              name="batsmanScore" 
              id="batsmanScore"
              className="w-full p-2 bg-gray-700 rounded"
            >
              <option value="">Select an option</option>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="6">6</option>
              <option value="wicket">Wicket</option>
            </select>
            { batsmanScore !== 'wicket' && batsmanScore != "" &&
              <div className="mt-4">
                <label htmlFor="bowlerScore" className="block mb-1">Select Bowler Score</label>
                <select 
                  onChange={(e)=>{setBowlerScore(e.target.value)}} 
                  name="bowlerScore" 
                  id="bowlerScore"
                  className="w-full p-2 bg-gray-700 rounded"
                >
                  <option value="">Select an option</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="6">6</option>
                </select>
              </div>
            }
            {batsmanScore === "wicket" &&
              <div className="mt-4">
                <label htmlFor="wicketType" className="block mb-1">Select Wicket Type</label>
                <select 
                  onChange={(e)=>{setWicketType(e.target.value)}} 
                  name="wicketType" 
                  id="wicketType"
                  className="w-full p-2 bg-gray-700 rounded"
                >
                  <option value="">Select an option</option>
                  <option value="bowled">Bowled</option>
                  <option value="caught">Caught</option>
                  <option value="runout">Runout</option>
                  <option value="stumped">Stumped</option>
                </select>
              </div>
            }
            {batsmanScore === "wicket" &&  wicketType === "caught" &&
              <div className="mt-4">
                <label htmlFor="catchBy" className="block mb-1">Caught By</label>
                <select 
                  onChange={(e)=>{setCatchBy(e.target.value)}} 
                  name="catchBy" 
                  id="catchBy"
                  className="w-full p-2 bg-gray-700 rounded"
                >
                  <option value="">Select an option</option>
                  {bowlingTeam.map((item,key)=>{
                    return <option key={key} value={item.player_id}>{item.name}</option>
                  })}
                </select>
              </div>
            }
            {batsmanScore === "wicket" && wicketType === "runout" &&
              <div className="mt-4">
                <label htmlFor="wicketBy" className="block mb-1">Wicket By</label>
                <select 
                  onChange={(e)=>{setWicketBy(e.target.value)}} 
                  name="wicketBy" 
                  id="wicketBy"
                  className="w-full p-2 bg-gray-700 rounded"
                >
                  <option value="">Select an option</option>
                  {bowlingTeam.map((item,key)=>{
                    return <option key={key} value={item.player_id}>{item.name}</option>
                  })}
                </select>
              </div>
            }
          </div>
        }

        {selectedTournament && selectedMatch && ballType === "wide" &&
          <div>
            <label htmlFor="batsmanScore" className="block mb-1">Select Batsman Score</label>
            <select 
              onChange={(e)=>{setBatsmanScore(e.target.value)}} 
              name="batsmanScore" 
              id="batsmanScore"
              className="w-full p-2 bg-gray-700 rounded"
            >
              <option value="">Select an option</option>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="6">6</option>
              <option value="wicket">Wicket</option>
            </select>
            { batsmanScore !== 'wicket' && batsmanScore !== "" &&
              <div className="mt-4">
                <label htmlFor="bowlerScore" className="block mb-1">Select Bowler Score</label>
                <select 
                  onChange={(e)=>{setBowlerScore(e.target.value)}} 
                  name="bowlerScore" 
                  id="bowlerScore"
                  className="w-full p-2 bg-gray-700 rounded"
                >
                  <option value="">Select an option</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="6">6</option>
                </select>
              </div>
            }
            {batsmanScore === "wicket" &&
              <div className="mt-4">
                <label htmlFor="wicketType" className="block mb-1">Select Wicket Type</label>
                <select 
                  onChange={(e)=>{setWicketType(e.target.value)}} 
                  name="wicketType" 
                  id="wicketType"
                  className="w-full p-2 bg-gray-700 rounded"
                >
                  <option value="">Select an option</option>
                  <option value="runout">Runout</option>
                  <option value="stumped">Stumped</option>
                </select>
              </div>
            }
            {batsmanScore === "wicket" && wicketType === "runout" &&
              <div className="mt-4">
                <label htmlFor="wicketBy" className="block mb-1">Wicket By</label>
                <select 
                  onChange={(e)=>{setWicketBy(e.target.value)}} 
                  name="wicketBy" 
                  id="wicketBy"
                  className="w-full p-2 bg-gray-700 rounded"
                >
                  <option value="">Select an option</option>
                  {bowlingTeam.map((item,key)=>{
                    return <option key={key} value={item.player_id}>{item.name}</option>
                  })}
                </select>
              </div>
            }
          </div>
        }

        {selectedTournament && selectedMatch && ballType === "noball" &&
          <div>
            <label htmlFor="batsmanScore" className="block mb-1">Select Batsman Score</label>
            <select 
              onChange={(e)=>{
                setBatsmanScore(e.target.value);
                if(e.target.value === 'wicket'){
                  setWicketType("runout")
                }
              }} 
              name="batsmanScore" 
              id="batsmanScore"
              className="w-full p-2 bg-gray-700 rounded"
            >
              <option value="">Select an option</option>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="6">6</option>
              <option value="wicket">Wicket</option>
            </select>
            { batsmanScore !== 'wicket' && batsmanScore !== "" &&
              <div className="mt-4">
                <label htmlFor="bowlerScore" className="block mb-1">Select Bowler Score</label>
                <select 
                  onChange={(e)=>{setBowlerScore(e.target.value)}} 
                  name="bowlerScore" 
                  id="bowlerScore"
                  className="w-full p-2 bg-gray-700 rounded"
                >
                  <option value="">Select an option</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="6">6</option>
                </select>
              </div>
            }
            {batsmanScore === "wicket" &&
              <div className="mt-4">
                <p className="text-red-400">Wicket is only runout</p>
              </div>
            }
            {batsmanScore === "wicket" && wicketType === "runout" &&
              <div className="mt-4">
                <label htmlFor="wicketBy" className="block mb-1">Wicket By</label>
                <select 
                  onChange={(e)=>{setWicketBy(e.target.value)}} 
                  name="wicketBy" 
                  id="wicketBy"
                  className="w-full p-2 bg-gray-700 rounded"
                >
                  <option value="">Select an option</option>
                  {bowlingTeam.map((item,key)=>{
                    return <option key={key} value={item.player_id}>{item.name}</option>
                  })}
                </select>
              </div>
            }
          </div>
        }

        {selectedTournament && selectedMatch && ballType && batsman && bowler && batsmanScore && 
          <button 
            onClick={handleSubmitScore} 
            disabled={submitLoading}
            className="w-full bg-blue-600 p-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-500 mt-4"
          >
            {submitLoading ? <LoadingSpinner /> : 'Submit Score'}
          </button>
        }
        {selectedTournament && selectedMatch && <button 
          className="w-full bg-blue-600 p-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-500 mt-4 text-white flex justify-center items-center" 
          onClick={handleFinish}
          disabled={loadingMatchFinish}
        >
          {loadingMatchFinish ? <LoadingSpinner /> : (selectedMatchObj.inning === 1 ? "Finish inning" : "Finish match")}
        </button>}
      </div>
    </div>
  );
};

export default ScorePortal;