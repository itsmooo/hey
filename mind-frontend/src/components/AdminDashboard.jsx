"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTherapists: 0,
    totalSessions: 0,
    totalJournals: 0,
  })
  const [recentUsers, setRecentUsers] = useState([])
  const [recentSessions, setRecentSessions] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token")
      const headers = { Authorization: `Bearer ${token}` }

      // Fetch all data
      const [usersRes, therapistsRes, sessionsRes, journalsRes] = await Promise.all([
        axios.get("http://localhost:8080/api/users", { headers }),
        axios.get("http://localhost:8080/api/therapists", { headers }),
        axios.get("http://localhost:8080/api/sessions", { headers }),
        axios.get("http://localhost:8080/api/journals", { headers }),
      ])

      setStats({
        totalUsers: usersRes.data.length,
        totalTherapists: therapistsRes.data.length,
        totalSessions: sessionsRes.data.length,
        totalJournals: journalsRes.data.length,
      })

      setRecentUsers(usersRes.data.slice(-5).reverse())
      setRecentSessions(sessionsRes.data.slice(-5).reverse())
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-lg text-gray-600">Manage the MindConnect platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-4 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="text-4xl w-15 h-15 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
            👥
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats.totalUsers}</h3>
            <p className="text-gray-600 text-sm">Total Users</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-4 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="text-4xl w-15 h-15 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
            👨‍⚕️
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats.totalTherapists}</h3>
            <p className="text-gray-600 text-sm">Total Therapists</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-4 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="text-4xl w-15 h-15 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
            📅
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats.totalSessions}</h3>
            <p className="text-gray-600 text-sm">Total Sessions</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-4 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="text-4xl w-15 h-15 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
            📝
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats.totalJournals}</h3>
            <p className="text-gray-600 text-sm">Total Journals</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold text-gray-800">Recent Users</h2>
          </div>
          <div className="flex flex-col gap-3">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                  {user.firstName.charAt(0)}
                  {user.lastName.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-800 mb-1">
                    {user.firstName} {user.lastName}
                  </h4>
                  <p className="text-xs text-gray-600 mb-1">{user.email}</p>
                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full uppercase tracking-wide">
                    {user.role?.name}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold text-gray-800">Recent Sessions</h2>
          </div>
          <div className="flex flex-col gap-4">
            {recentSessions.map((session) => (
              <div key={session.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg transition-all duration-200 hover:border-indigo-500 hover:bg-gray-50">
                <div className="flex flex-col items-center justify-center w-15 h-15 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg text-center">
                  <div className="text-lg font-bold leading-none">
                    {new Date(session.sessionDate).getDate()}
                  </div>
                  <div className="text-xs uppercase tracking-wide">
                    {new Date(session.sessionDate).toLocaleDateString('en', { month: 'short' })}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-gray-800 mb-1">Session #{session.id}</h4>
                  <p className="text-sm text-gray-600 mb-1">
                    User: {session.user?.firstName} {session.user?.lastName}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    Therapist: Dr. {session.therapist?.firstName} {session.therapist?.lastName}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    session.status.toLowerCase() === 'completed' ? 'bg-green-100 text-green-800' :
                    session.status.toLowerCase() === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    session.status.toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {session.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center mt-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <button className="flex flex-col items-center gap-3 p-6 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium transition-all duration-200 hover:border-indigo-500 hover:bg-gray-50 hover:-translate-y-0.5">
            <span className="text-3xl">👥</span>
            Manage Users
          </button>
          <button className="flex flex-col items-center gap-3 p-6 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium transition-all duration-200 hover:border-indigo-500 hover:bg-gray-50 hover:-translate-y-0.5">
            <span className="text-3xl">👨‍⚕️</span>
            Manage Therapists
          </button>
          <button className="flex flex-col items-center gap-3 p-6 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium transition-all duration-200 hover:border-indigo-500 hover:bg-gray-50 hover:-translate-y-0.5">
            <span className="text-3xl">📊</span>
            View Reports
          </button>
          <button className="flex flex-col items-center gap-3 p-6 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium transition-all duration-200 hover:border-indigo-500 hover:bg-gray-50 hover:-translate-y-0.5">
            <span className="text-3xl">⚙️</span>
            System Settings
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
