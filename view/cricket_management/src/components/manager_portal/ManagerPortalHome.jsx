import {React,useState,useEffect} from 'react'
import {Link} from 'react-router-dom';
import axios from '../../api/axios';
import { useCookies } from 'react-cookie';
const ManagerPortalHome = () => {
  const [cookies] = useCookies(["token"]);
  const [addTournmant, setAddTournmant] = useState(false);
  const [showTornamentForm, setShowTornamentForm] = useState(false);
  const [tournamentName, setTournamentName] = useState("");
  const [tournamentFormat, setTournamentFormat] = useState("T20");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [organizerEmail, setOrganizerEmail] = useState("");
  const handleSubmit = () => {
    if(startDate === "" || endDate === "" || managerEmail === "" || organizerEmail === "" || tournamentName === "") {
      alert("Please fill all the fields");
      return;
    }
    if(new Date(startDate) > new Date(endDate)) {
      alert("Start Date should be less than end date");
      return;
    }
    const data = {
      name: tournamentName,
      format: tournamentFormat,
      start_date: startDate,
      end_date: endDate,
      manager_email: managerEmail,
      organizer_email: organizerEmail
    }
    axios.post('/tournaments/create',data,{
      headers:{
        'Authorization': `Bearer ${cookies.token}`
      }
    }).then((responce) => {
      setShowTornamentForm(false);
      setTournamentName("");
      setTournamentFormat("T20");
      setStartDate("");
      setEndDate("");
      setManagerEmail("");
      setOrganizerEmail("");
      alert(responce.data.message);
    }).catch((error) => {
      alert(error.response.data.detail);
      console.log(error);
    })
  }
  function getTournaments() {
  axios.get('/tournaments',{
    headers:{
      'Authorization': `Bearer ${cookies.token}`
    }
  }).then((responce) => {
    const tournaments = responce.data;
    setAddTournmant(tournaments.length === 0);
  }).catch((error) => {
    console.log(error);
  })}
  useEffect(() => {
    getTournaments();
  }, [])
  return (
    <div>
      <div>
        <div>
          {showTornamentForm ? 
            <div className="fixed flex items-center justify-center bg-black/70 left-0 right-0 h-screen w-screen" >
            <div className="flex w-1/2 flex-col text-black rounded-lg p-4 m-2 bg-blue-200" >
              <div className="flex justify-end w-full" >
                <svg
                      onClick = {()=>{
                        setShowTornamentForm(false);
                      }}
                      className="h-6 w-6  cursor-pointer"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      height={24}
                      focusable={false}
                      fill="transparent"
                          
                      >
                      <path
                          
                      stroke="black"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm6 4l6 6m0-6l-6 6"
                      />
                </svg>
              </div>
              <div className="flex flex-col items-center" >
                <div className="flex flex-col w-3/4 items-center" >
                  <label className="p-2 rounded-lg w-full" htmlFor="name">Tournament Name</label>
                  <input onChange={(e)=>{setTournamentName(e.target.value);}} value={tournamentName} className="p-2 rounded-lg w-full" placeholder = "Tournament Name" type="text" name="name" id="name" />
                  <label className="p-2 rounded-lg w-full" htmlFor="TournamentFormat">Tournament Format</label>
                  <select  onChange={(e)=>{setTournamentFormat(e.target.value)}} value={tournamentFormat} className="p-2 rounded-lg w-full" name="TournamentFormat" id="TournamentFormat">
                    <option value="T20">T20</option>
                    <option value="ODI">ODI</option>
                    <option value="Test">Test</option>
                  </select>
                  <label className="p-2 rounded-lg w-full" htmlFor="start_date">Start Date</label>
                  <input onChange={(e)=>{setStartDate(e.target.value)}} value={startDate} className="p-2 rounded-lg w-full" type="date" name="start_date" id="start_date" />
                  <label className="p-2 rounded-lg w-full" htmlFor="end_date">End Date</label>
                  <input onChange={(e)=>{setEndDate(e.target.value)}} value={endDate} className="p-2 rounded-lg w-full" type="date" name="end_date" id="end_date" />
                  <label  className="p-2 rounded-lg w-full" htmlFor="manager">Manager Email</label>
                  <input onChange={(e)=>{setManagerEmail(e.target.value)}} value={managerEmail} className="p-2 rounded-lg w-full" placeholder = "Manager Email" type="email" name="manager" id="manager" />
                  <label className="p-2 rounded-lg w-full" htmlFor="organizer">Organizer Email</label>
                  <input onChange={(e)=>{setOrganizerEmail(e.target.value)}} value={organizerEmail} className="p-2 rounded-lg w-full" placeholder = "Organizer Email" type="email" name="organizer" id="organizer" />
                  <button onClick={handleSubmit} className="p-2 rounded-lg bg-blue-400 hover:bg-blue-500 mt-2 w-fit" type="submit">Add Tournament</button>
                </div>
              </div>
            </div>
          </div> : null}
        </div>
        <h1 className="text-2xl">Welcome to Cricket Management</h1>
        <div className="flex flex-row justify-between">
          { addTournmant ? <p>There are no tournaments available add a Tournament before adding anything else</p> : <div>
            <Link to="/manager_portal/teams" className="bg-blue-400 p-2 rounded-lg hover:bg-blue-500">Add Teams</Link>
            <Link to="/manager_portal/tournmant" className="bg-blue-400 p-2 rounded-lg hover:bg-blue-500">Add matches</Link>
            <Link to="/manager_portal/score" className="bg-blue-400 p-2 rounded-lg hover:bg-blue-500">Add Score</Link>
          </div>}
            <button onClick = {()=>{
              setShowTornamentForm(true);
            }}  className="bg-blue-400 p-2 rounded-lg hover:bg-blue-500" >Add Tournament</button>
        </div>
      </div>
    </div>
  )
}

export default ManagerPortalHome
