import { useState } from "react";
import axios from "../api/axios";
import { useCookies } from "react-cookie";

const RequestRole = () => {
  const [cookies] = useCookies(["token"]);
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleRequest = () => {
    setError("");
    setMessage("");

    if (!role || !description) {
      setError("Please fill in all fields.");
      return;
    }

    axios
      .post(
        "/users/request_role",
        { role, description },
        { headers: { Authorization: `Bearer ${cookies.token}` } }
      )
      .then(() => {
        setMessage("✅ Request Sent Successfully");
        setRole("");
        setDescription("");
      })
      .catch(() => {
        setError("❌ Error in sending request. Try again.");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold text-center mb-4">
          Request a Role Promotion
        </h2>

        {message && (
          <p className="text-green-400 bg-green-900 p-2 rounded mb-3 text-center">
            {message}
          </p>
        )}
        {error && (
          <p className="text-red-400 bg-red-900 p-2 rounded mb-3 text-center">
            {error}
          </p>
        )}

        <label htmlFor="role" className="block mb-2 text-gray-300">
          Select role you want to promote to
        </label>
        <select
          onChange={(e) => setRole(e.target.value)}
          value={role}
          name="role"
          id="role"
          className="w-full p-2 mb-4 bg-gray-700 text-white rounded border border-gray-600 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Role</option>
          <option value="manager">Manager</option>
          <option value="organizer">Organizer</option>
          <option value="admin">Admin</option>
        </select>

        <label htmlFor="description" className="block mb-2 text-gray-300">
          Enter why you want this role
        </label>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          name="description"
          id="description"
          rows="3"
          className="w-full p-2 mb-4 bg-gray-700 text-white rounded border border-gray-600 focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Write your reason here..."
        ></textarea>

        <button
          onClick={handleRequest}
          className="w-full bg-blue-600 p-2 rounded-lg hover:bg-blue-700 transition"
        >
          Send Request
        </button>
      </div>
    </div>
  );
};

export default RequestRole;
