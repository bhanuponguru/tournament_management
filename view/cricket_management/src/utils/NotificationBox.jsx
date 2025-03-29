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
      className="fixed top-20 right-4 w-80 z-50"
    >
      <div className="bg-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm border border-white/20">
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-white">Notifications</h2>
            <button 
              onClick={() => setIsOpen(false)} 
              className="bg-white/20 p-1 rounded-full hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <p className="text-white/70 text-center py-2">No notifications</p>
            ) : (
              notifications.map((notification, index) => (
                <div 
                  key={index} 
                  className="p-3 bg-white/20 rounded-lg border border-white/30 shadow-md"
                >
                  <p className="text-sm">
                    <span className="font-semibold text-white/80">Status: </span>
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
                    <span className="font-semibold text-white/80">Requested Role: </span>
                    <span className="text-blue-300 font-medium">{notification.requested_role}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold text-white/80">Description: </span>
                    <span className="italic text-white/90">{notification.description}</span>
                  </p>

                  {role === "admin" && notification.status !== "approved" && notification.status !== "declined" && (
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => onApprove(notification.request_id)}
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white p-2 rounded-lg hover:from-green-700 hover:to-green-600 transition-all duration-300 font-semibold"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onDecline(notification.request_id)}
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white p-2 rounded-lg hover:from-red-700 hover:to-red-600 transition-all duration-300 font-semibold"
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
                      {`role === "admin" ? "Declined" : Declined by: ${notification.admin_email}`}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <style>
          {`
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(255, 255, 255, 0.1);
              border-radius: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.3);
              border-radius: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.5);
            }
            
            @keyframes bell-shake {
              0% { transform: rotate(0); }
              15% { transform: rotate(5deg); }
              30% { transform: rotate(-5deg); }
              45% { transform: rotate(4deg); }
              60% { transform: rotate(-4deg); }
              75% { transform: rotate(2deg); }
              85% { transform: rotate(-2deg); }
              92% { transform: rotate(1deg); }
              100% { transform: rotate(0); }
            }
            
            .animate-bell-shake {
              animation: bell-shake 2s infinite;
            }
          `}
        </style>
      </div>
    </motion.div>
  );
};

export default NotificationBox;