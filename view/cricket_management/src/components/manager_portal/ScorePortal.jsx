import React from "react";
import axios from "axios";
import Navbar from "./utils/Navbar";
import {useCookies} from 'react-cookie';
const ScorePortal = () => {
  const [cookies,setCookie,removeCookie] = useCookies(["token"]);
  const [match, setMatch] = React.useState("");
  const [team1, setTeam1] = React.useState("");
  const [team2, setTeam2] = React.useState("");
  const [tossWinner, setTossWinner] = React.useState(team1);
  const [battingTeam, setBattingTeam] = React.useState(team1);
  const [inning, setInning] = React.useState(1);
  const [batsman, setBatsman] = React.useState("");
  const [bowler, setBowler] = React.useState("");
  const [bowlerScore, setBowlerScore] = React.useState("");
  const [batsmanScore, setBatsmanScore] = React.useState("");
  const [ballType, setBallType] = React.useState("");
  const [wicketType, setWicketType] = React.useState("");
  const [wicketBy, setWicketBy] = React.useState("");
  const [catchBy, setCatchBy] = React.useState("");
  const [isStumped, setIsStumped] = React.useState(false);
  const base_url = process.env.REACT_APP_baseUrl;
  
  const response = axios.get(base_url + '/matches/today',{
    headers:{
      Authorization: "Bearer " + cookies.token
    }
  })

  const matches = response.data;

  
  
  return (<div>
    <Navbar />
    <h1>Score Portal</h1>
  </div>);
};

export default ScorePortal;
