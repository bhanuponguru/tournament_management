import { useState, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios";
import { useCookies } from "react-cookie";

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
    if (!tournamentName || !startDate || !endDate || !managerEmail || !organizerEmail) {
      alert("Please fill all the fields");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      alert("Start Date should be less than End Date");
      return;
    }
    const data = {
      name: tournamentName,
      format: tournamentFormat,
      start_date: startDate,
      end_date: endDate,
      manager_email: managerEmail,
      organizer_email: organizerEmail,
    };

    axios
      .post("/tournaments/create", data, {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((response) => {
        setShowTornamentForm(false);
        setTournamentName("");
        setTournamentFormat("T20");
        setStartDate("");
        setEndDate("");
        setManagerEmail("");
        setOrganizerEmail("");
        alert(response.data.message);
      })
      .catch((error) => {
        alert(error.response.data.detail);
        console.log(error);
      });
  };

  useLayoutEffect(() => {
    axios
      .get("/tournaments", {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((response) => {
        setAddTournmant(response.data.length === 0);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div 
      className="flex bg-[url(https://c0.wallpaperflare.com/path/967/82/462/australia-richmond-melbourne-cricket-ground-cricket-371772744fa62261f54850a915da5c9b.jpg)] items-center justify-center min-h-screen bg-gray-900 text-white p-6 bg-cover bg-center"

    >
      <div className="w-full max-w-5xl bg-white/10 rounded-3xl overflow-hidden shadow-2xl">
        {/* Left Side - Background with Motivational Text */}
        <div className="flex">
          <div 
            className="w-1/3  bg-[url(https://c0.wallpaperflare.com/path/967/82/462/australia-richmond-melbourne-cricket-ground-cricket-371772744fa62261f54850a915da5c9b.jpg)] relative bg-cover bg-center flex flex-col justify-center p-8 text-white"

          >
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-4 text-center">
                Tournament Management
              </h1>
              <p className="text-lg opacity-80 text-center">
                Streamline your cricket tournament operations with precision and ease. 
                Manage teams, matches, and scores seamlessly.
              </p>
            </div>
          </div>

          {/* Right Side - Main Content */}
          <div className="w-2/3 bg-black/40 p-8">
            <h1 className="text-4xl font-bold text-center mb-8 text-white">
              Cricket Management Portal
            </h1>

            <div className="flex flex-col items-center gap-6">
              {addTournmant ? (
                <p className="text-red-400 text-lg">No tournaments available. Please add one first.</p>
              ) : (
                <div className="grid grid-cols-3 gap-6 w-full">
                  {[
                    { 
                      title: "Add Teams", 
                      description: "Register teams for the tournament.", 
                      to: "/manager_portal/teams" 
                    },
                    { 
                      title: "Add Matches", 
                      description: "Schedule matches for the tournament.", 
                      to: "/manager_portal/tournmant" 
                    },
                    { 
                      title: "Add Score", 
                      description: "Update match scores.", 
                      to: "/manager_portal/score" 
                    }
                  ].map((item, index) => (
                    <Link
                      key={index}
                      to={item.to}
                      className="bg-black/20 border border-white/20 text-white px-6 py-5 rounded-xl text-center shadow-xl hover:bg-white/20 transition-all transform hover:-translate-y-2 duration-300"
                    >
                      <h2 className="text-xl font-bold mb-2">{item.title}</h2>
                      <p className="text-sm text-gray-300">{item.description}</p>
                    </Link>
                  ))}
                </div>
              )}

              <button
                onClick={() => setShowTornamentForm(true)}
                className="bg-black/20 border border-white/20 text-white px-8 py-4 rounded-xl shadow-xl hover:bg-white/20 transform transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
              >
                <span className="text-lg font-bold">Add Tournament</span>
                <p className="text-sm text-gray-300 mt-1">Create a new tournament</p>
              </button>
            </div>

            {/* Tournament Form Modal */}
            {showTornamentForm && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
                <div className="bg-white/10 border border-white/20 text-white p-8 rounded-2xl w-full max-w-md shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Create Tournament</h2>
                    <button
                      onClick={() => setShowTornamentForm(false)}
                      className="text-gray-400 hover:text-white text-3xl"
                    >
                      &times;
                    </button>
                  </div>

                  <div className="space-y-4">
                    {[
                      { 
                        label: "Tournament Name", 
                        type: "text", 
                        value: tournamentName, 
                        onChange: setTournamentName,
                        placeholder: "Enter tournament name" 
                      },
                      { 
                        label: "Tournament Format", 
                        type: "select", 
                        value: tournamentFormat, 
                        onChange: setTournamentFormat,
                        options: ["T20", "ODI", "Test"] 
                      },
                      { 
                        label: "Start Date", 
                        type: "date", 
                        value: startDate, 
                        onChange: setStartDate 
                      },
                      { 
                        label: "End Date", 
                        type: "date", 
                        value: endDate, 
                        onChange: setEndDate 
                      },
                      { 
                        label: "Manager Email", 
                        type: "email", 
                        value: managerEmail, 
                        onChange: setManagerEmail,
                        placeholder: "Enter manager email" 
                      },
                      { 
                        label: "Organizer Email", 
                        type: "email", 
                        value: organizerEmail, 
                        onChange: setOrganizerEmail,
                        placeholder: "Enter organizer email" 
                      }
                    ].map((field, index) => (
                      <div key={index}>
                        <label className="block text-sm text-gray-300 mb-2">{field.label}</label>
                        {field.type === 'select' ? (
                          <select
                            className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                          >
                            {field.options.map(option => (
                              <option className="text-black" key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            placeholder={field.placeholder}
                          />
                        )}
                      </div>
                    ))}

                    <button
                      onClick={handleSubmit}
                      className="w-full bg-white/10 border border-white/20 text-white p-4 rounded-xl hover:bg-white/20 transition-all duration-300"
                    >
                      Add Tournament
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerPortalHome;