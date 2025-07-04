"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const TherapistDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalSessions: 0,
    todaySessions: 0,
    upcomingSessions: 0,
    completedSessions: 0,
  })
  const [todaySessions, setTodaySessions] = useState([])
  const [upcomingSessions, setUpcomingSessions] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [user])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token")
      const headers = { Authorization: `Bearer ${token}` }

      const response = await axios.get(`http://localhost:8080/api/sessions/therapist/${user.id}`, { headers })

      const sessions = response.data
      const today = new Date().toDateString()

      const todaySessionsList = sessions.filter((s) => new Date(s.sessionDate).toDateString() === today)

      const upcoming = sessions.filter((s) => s.status === "SCHEDULED" && new Date(s.sessionDate) > new Date())

      const completed = sessions.filter((s) => s.status === "COMPLETED")

      setTodaySessions(todaySessionsList)
      setUpcomingSessions(upcoming.slice(0, 5))

      setStats({
        totalSessions: sessions.length,
        todaySessions: todaySessionsList.length,
        upcomingSessions: upcoming.length,
        completedSessions: completed.length,
      })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    }
  }

  const updateSessionStatus = async (sessionId, status) => {
    try {
      const token = localStorage.getItem("token")
      const headers = { Authorization: `Bearer ${token}` }

      await axios.put(`http://localhost:8080/api/sessions/${sessionId}/status`, status, { headers })

      fetchDashboardData() // Refresh data
    } catch (error) {
      console.error("Error updating session status:", error)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome, Dr. {user.firstName}!</h1>
        <p className="text-lg text-gray-600">Manage your therapy sessions and help your clients</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-4 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="text-4xl w-15 h-15 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
            📊
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats.totalSessions}</h3>
            <p className="text-gray-600 text-sm">Total Sessions</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-4 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="text-4xl w-15 h-15 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
            📅
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats.todaySessions}</h3>
            <p className="text-gray-600 text-sm">Today's Sessions</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-4 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="text-4xl w-15 h-15 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
            ⏰
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats.upcomingSessions}</h3>
            <p className="text-gray-600 text-sm">Upcoming Sessions</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-4 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="text-4xl w-15 h-15 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
            ✅
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats.completedSessions}</h3>
            <p className="text-gray-600 text-sm">Completed Sessions</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold text-gray-800">Today's Sessions</h2>
          </div>
          <div className="flex flex-col gap-4">
            {todaySessions.length > 0 ? (
              todaySessions.map((session) => (
                <div key={session.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg transition-all duration-200 hover:border-indigo-500 hover:bg-gray-50 items-center">
                  <div className="text-sm text-gray-400">
                    {new Date(session.sessionDate).toLocaleTimeString("en", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-800 mb-1">
                      {session.user?.firstName} {session.user?.lastName}
                    </h4>
                    <p className="text-sm text-gray-600 mb-1">Type: {session.sessionType}</p>
                    <p className="text-sm text-gray-600 mb-2">Duration: {session.duration} minutes</p>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      session.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                      session.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      session.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {session.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {session.status === "SCHEDULED" && (
                      <>
                        <button
                          className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors duration-200"
                          onClick={() => updateSessionStatus(session.id, "COMPLETED")}
                        >
                          Complete
                        </button>
                        <button
                          className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors duration-200"
                          onClick={() => updateSessionStatus(session.id, "CANCELLED")}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No sessions scheduled for today</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold text-gray-800">Upcoming Sessions</h2>
          </div>
          <div className="flex flex-col gap-4">
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map((session) => (
                <div key={session.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg transition-all duration-200 hover:border-indigo-500 hover:bg-gray-50">
                  <div className="flex flex-col items-center justify-center w-15 h-15 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg text-center">
                    <div className="text-lg font-bold leading-none">
                      {new Date(session.sessionDate).getDate()}
                    </div>
                    <div className="text-xs uppercase tracking-wide">
                      {new Date(session.sessionDate).toLocaleDateString("en", { month: "short" })}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-800 mb-1">
                      {session.user?.firstName} {session.user?.lastName}
                    </h4>
                    <p className="text-sm text-gray-600 mb-1">Type: {session.sessionType}</p>
                    <span className="text-xs text-gray-400">
                      {new Date(session.sessionDate).toLocaleTimeString("en", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No upcoming sessions</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Profile</h3>
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-semibold text-gray-800">Specialization:</span> {user.specialization}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold text-gray-800">Experience:</span> {user.experience} years
            </p>
            <p className="text-gray-700">
              <span className="font-semibold text-gray-800">Rating:</span> ⭐ {user.rating}/5.0
            </p>
            <p className="text-gray-700">
              <span className="font-semibold text-gray-800">Status:</span>
              <span className={`ml-2 font-semibold ${user.available ? "text-green-600" : "text-red-600"}`}>
                {user.available ? "Available" : "Unavailable"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TherapistDashboard
