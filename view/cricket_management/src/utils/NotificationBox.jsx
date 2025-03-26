import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useCookies } from "react-cookie";
import axios from "../api/axios";

const NotificationBox = ({ isOpen, setIsOpen, role, notifications, setNotifications }) => {
  const [cookies] = useCookies(["token"]);

  const onApprove = (id) => {
    if (role === "admin") {
      axios
        .put(
          "/admin/role_requests/approve",
          { request_id: id },
          { headers: { Authorization: `Bearer ${cookies.token}` } }
        )
        .then((response) => {
          alert(response.data.message);
          window.location.reload();
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const onDecline = (id) => {
    if (role === "admin") {
      axios
        .put(
          "/admin/role_requests/decline",
          { request_id: id },
          { headers: { Authorization: `Bearer ${cookies.token}` } }
        )
        .then((response) => {
          alert(response.data.message);
          window.location.reload();
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: isOpen ? "0%" : "100%", opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed top-4 right-4 w-80 bg-gray-800 text-white p-4 rounded-lg shadow-lg"
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition">
          <X className="w-5 h-5" />
        </button>
      </div>


      <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
        {notifications.length === 0 ? (
          <p className="text-gray-400 text-center">No notifications</p>
        ) : (
          notifications.map((notification, index) => (
            <div key={index} className="p-3 bg-gray-700 rounded-md border border-gray-600 shadow-md">
              <p className="text-sm">
                <span className="font-semibold text-gray-300">Status: </span>
                <span
                  className={`font-bold ${
                    notification.status === "approved"
                      ? "text-green-400"
                      : notification.status === "declined"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {notification.status}
                </span>
              </p>
              <p className="text-sm">
                <span className="font-semibold text-gray-300">Requested Role: </span>
                <span className="text-blue-400 font-medium">{notification.requested_role}</span>
              </p>
              <p className="text-sm">
                <span className="font-semibold text-gray-300">Description: </span>
                <span className="italic text-gray-200">{notification.description}</span>
              </p>


              {role === "admin" && notification.status !== "approved" && notification.status !== "declined" && (
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => onApprove(notification.request_id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition font-semibold"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => onDecline(notification.request_id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition font-semibold"
                  >
                    Decline
                  </button>
                </div>
              )}


              {notification.status === "approved" && (
                <p className="mt-2 text-sm font-semibold text-green-400">
                  {role === "admin" ? "Approved" : `Approved by: ${notification.admin_email}`}
                </p>
              )}
              {notification.status === "declined" && (
                <p className="mt-2 text-sm font-semibold text-red-400">
                  {role === "admin" ? "Declined" : `Declined by: ${notification.admin_email}`}
                </p>
              )}
            </div>
          ))
        )}
      </div>


      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #374151;
            border-radius: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #9ca3af;
            border-radius: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #d1d5db;
          }
        `}
      </style>
    </motion.div>
  );
};

export default NotificationBox;
