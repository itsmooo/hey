"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const SessionList = ({ user, userType }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user && user.id) {
      fetchSessions();
    } else {
      setLoading(false);
      setError("User information not available");
    }
  }, [user, userType]);

  const fetchSessions = async () => {
    try {
      if (!user || !user.id) {
        setError("User information not available");
        setLoading(false);
        return;
      }

      const endpoint =
        userType === "therapist"
          ? `http://localhost:8080/api/sessions/therapist/${user.id}`
          : `http://localhost:8080/api/sessions/user/${user.id}`;

      console.log("Fetching sessions from:", endpoint);
      console.log("User ID:", user.id);
      console.log("User Type:", userType);

      // Since session endpoints are now public, we don't need to send Authorization header
      const response = await axios.get(endpoint, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Sessions response:", response.data);
      setSessions(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching sessions:", error);
      setError(error.response?.data || "Failed to fetch sessions");
    } finally {
      setLoading(false);
    }
  };

  const updateSessionStatus = async (sessionId, status) => {
    try {
      await axios.put(
        `http://localhost:8080/api/sessions/${sessionId}/status`,
        status,
        {
          headers: { 
            "Content-Type": "application/json"
          },
        }
      );
      fetchSessions();
    } catch (error) {
      console.error("Error updating session status:", error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      SCHEDULED: "blue",
      COMPLETED: "green",
      CANCELLED: "red",
      NO_SHOW: "orange",
    };
    return colors[status] || "gray";
  };

  const filteredSessions = sessions.filter((session) => {
    if (filter === "all") return true;
    return session.status === filter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg text-gray-600">Loading sessions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
        <button
          onClick={fetchSessions}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-5">
        <h1 className="text-4xl font-bold text-gray-800">
          {userType === "therapist" ? "My Sessions" : "My Therapy Sessions"}
        </h1>
        {userType !== "therapist" && (
          <Link
            to="/book-session"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 inline-block text-center"
          >
            Book New Session
          </Link>
        )}
      </div>

      <div className="mb-8">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border-2 border-gray-200 rounded-lg text-sm bg-white cursor-pointer focus:outline-none focus:border-indigo-500"
        >
          <option value="all">All Sessions</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="NO_SHOW">No Show</option>
        </select>
      </div>

      <div className="flex flex-col gap-5">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <div
              key={session.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex justify-between items-center p-5 bg-gray-50 border-b border-gray-200">
                <div className="flex flex-col gap-1">
                  <div className="text-lg font-semibold text-gray-800">
                    {new Date(session.sessionDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(session.sessionDate).toLocaleTimeString("en", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium text-white`}
                  style={{ backgroundColor: getStatusColor(session.status) }}
                >
                  {session.status}
                </span>
              </div>

              <div className="p-5 flex flex-col md:flex-row gap-5">
                {userType === "therapist" ? (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {session.user?.firstName} {session.user?.lastName}
                    </h3>
                    <p className="text-gray-600 text-sm">Client</p>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      Dr. {session.therapist?.firstName}{" "}
                      {session.therapist?.lastName}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {session.therapist?.specialization}
                    </p>
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex mb-2">
                    <span className="font-medium text-gray-700 min-w-20">
                      Type:
                    </span>
                    <span className="text-gray-600">{session.sessionType}</span>
                  </div>
                  <div className="flex mb-2">
                    <span className="font-medium text-gray-700 min-w-20">
                      Duration:
                    </span>
                    <span className="text-gray-600">
                      {session.duration} minutes
                    </span>
                  </div>
                  {session.notes && (
                    <div className="flex mb-2">
                      <span className="font-medium text-gray-700 min-w-20">
                        Notes:
                      </span>
                      <span className="text-gray-600">{session.notes}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 p-5 border-t border-gray-200 bg-gray-50 flex-wrap">
                {userType === "therapist" && session.status === "SCHEDULED" && (
                  <>
                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm"
                      onClick={() =>
                        updateSessionStatus(session.id, "COMPLETED")
                      }
                    >
                      Mark Complete
                    </button>
                    <button
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 text-sm"
                      onClick={() => updateSessionStatus(session.id, "NO_SHOW")}
                    >
                      No Show
                    </button>
                    <button
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm"
                      onClick={() =>
                        updateSessionStatus(session.id, "CANCELLED")
                      }
                    >
                      Cancel
                    </button>
                  </>
                )}

                {userType !== "therapist" && session.status === "SCHEDULED" && (
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm"
                    onClick={() => updateSessionStatus(session.id, "CANCELLED")}
                  >
                    Cancel Session
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              No sessions found
            </h3>
            <p className="text-gray-600 mb-6">
              {userType === "therapist"
                ? "No sessions scheduled yet"
                : "You haven't booked any sessions yet"}
            </p>
            {userType !== "therapist" && (
              <Link
                to="/book-session"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 inline-block"
              >
                Book Your First Session
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionList;
